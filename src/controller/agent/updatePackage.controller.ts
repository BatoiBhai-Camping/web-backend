import type { Request, Response } from "express";
import { db } from "../../db/db.js";
import { ApiError } from "../../uitls/apiError.js";
import { asyncHandler } from "../../uitls/asyncHandler.js";
import { updatePackageValidator } from "../../validator/updatePkg.validator.js";
import { ApiResponse } from "../../uitls/apiResponse.js";

const updatePackage = asyncHandler(async (req: Request, res: Response) => {
  const valid = updatePackageValidator.safeParse(req.body);
  if (!valid.success) {
    throw new ApiError(400, "Invalid input", valid.error.issues);
  }

  const data = valid.data;
  const userId = req.userId;

  // Get agent profile
  const agent = await db.bb_agentProfile.findUnique({
    where: { userId: userId! },
    select: { id: true },
  });

  if (!agent) {
    throw new ApiError(400, "This user is not associated with any agent");
  }

  // Verify package exists and belongs to agent
  const existingPackage = await db.bb_travelPackage.findFirst({
    where: {
      id: data.packageId,
      isDeleted: false,
      agentId: agent.id,
    },
  });

  if (!existingPackage) {
    throw new ApiError(404, "Package not found or access denied");
  }

  // Start transaction
  const updatedPackage = await db.$transaction(async (tx) => {
    let bannerImageId = existingPackage.packageBannerImageId;

    // Handle banner image update
    if (data.bannerImageUrl) {
      if (bannerImageId) {
        const existingBanner = await tx.bb_image.findUnique({
          where: { id: bannerImageId },
        });

        if (existingBanner) {
          await tx.bb_image.update({
            where: { id: bannerImageId },
            data: {
              imageUrl: data.bannerImageUrl,
              ...(data.bannerImageFileId && { fileId: data.bannerImageFileId }),
            },
          });
        } else {
          const newBanner = await tx.bb_image.create({
            data: {
              imageUrl: data.bannerImageUrl,
              fileId: data.bannerImageFileId ?? null,
            },
          });
          bannerImageId = newBanner.id;
        }
      } else {
        const newBanner = await tx.bb_image.create({
          data: {
            imageUrl: data.bannerImageUrl,
            fileId: data.bannerImageFileId ?? null,
          },
        });
        bannerImageId = newBanner.id;
      }
    }

    // Build update data for main package
    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.pricePerPerson !== undefined)
      updateData.pricePerPerson = data.pricePerPerson;
    if (data.discountPercentage !== undefined)
      updateData.discountPercentage = data.discountPercentage;
    if (data.gstPercentage !== undefined)
      updateData.gstPercentage = data.gstPercentage;
    if (data.totalSeats !== undefined) {
      updateData.totalSeats = data.totalSeats;
      // Adjust available seats: seatsAvailable = totalSeats - seatsBooked
      const bookedSeats = existingPackage.seatsBooked;
      updateData.seatsAvailable = Math.max(0, data.totalSeats - bookedSeats);
    }
    if (data.destination !== undefined)
      updateData.destination = data.destination;
    if (data.durationDays !== undefined)
      updateData.durationDays = data.durationDays;
    if (data.startDate !== undefined)
      updateData.startDate = data.startDate ? new Date(data.startDate) : null;
    if (data.endDate !== undefined)
      updateData.endDate = data.endDate ? new Date(data.endDate) : null;
    if (bannerImageId) updateData.packageBannerImageId = bannerImageId;

    // Update package
    await tx.bb_travelPackage.update({
      where: { id: data.packageId },
      data: updateData,
    });

    // Handle package address updates
    if (data.packageAddress) {
      const existingAddress = await tx.bb_address.findFirst({
        where: { travelPackageId: data.packageId },
      });

      // Build address data, filtering out undefined values
      const addressData: any = {};
      if (data.packageAddress.country !== undefined)
        addressData.country = data.packageAddress.country;
      if (data.packageAddress.state !== undefined)
        addressData.state = data.packageAddress.state;
      if (data.packageAddress.district !== undefined)
        addressData.district = data.packageAddress.district;
      if (data.packageAddress.pin !== undefined)
        addressData.pin = data.packageAddress.pin;
      if (data.packageAddress.city !== undefined)
        addressData.city = data.packageAddress.city;
      if (data.packageAddress.longitude !== undefined)
        addressData.longitude = data.packageAddress.longitude;
      if (data.packageAddress.latitude !== undefined)
        addressData.latitude = data.packageAddress.latitude;

      if (existingAddress && Object.keys(addressData).length > 0) {
        await tx.bb_address.update({
          where: { id: existingAddress.id },
          data: addressData,
        });
      } else if (!existingAddress && data.packageAddress.country) {
        await tx.bb_address.create({
          data: {
            country: data.packageAddress.country,
            state: data.packageAddress.state || null,
            district: data.packageAddress.district || null,
            pin: data.packageAddress.pin || null,
            city: data.packageAddress.city || null,
            longitude: data.packageAddress.longitude || null,
            latitude: data.packageAddress.latitude || null,
            travelPackageId: data.packageId,
          },
        });
      }
    }

    // Handle package images deletion
    if (data.deleteImageIds?.length) {
      await tx.bb_image.deleteMany({
        where: {
          id: { in: data.deleteImageIds },
          travelPackageId: data.packageId,
        },
      });
    }

    // Handle package images update/create
    if (data.packageImages?.length) {
      for (const img of data.packageImages) {
        if (img.id) {
          const existingImage = await tx.bb_image.findFirst({
            where: {
              id: img.id,
              travelPackageId: data.packageId,
            },
          });

          if (existingImage) {
            await tx.bb_image.update({
              where: { id: img.id },
              data: {
                imageUrl: img.imageUrl,
                ...(img.fileId && { fileId: img.fileId }),
              },
            });
          } else {
            await tx.bb_image.create({
              data: {
                imageUrl: img.imageUrl,
                fileId: img.fileId ?? null,
                travelPackageId: data.packageId,
              },
            });
          }
        } else {
          await tx.bb_image.create({
            data: {
              imageUrl: img.imageUrl,
              fileId: img.fileId ?? null,
              travelPackageId: data.packageId,
            },
          });
        }
      }
    }

    // Handle itinerary days deletion
    if (data.deleteItineraryDayIds?.length) {
      await tx.bb_itineraryDay.deleteMany({
        where: {
          id: { in: data.deleteItineraryDayIds },
          packageId: data.packageId,
        },
      });
    }

    // Handle itinerary days update/create
    if (data.itineraryDays?.length) {
      for (const day of data.itineraryDays) {
        if (day.id) {
          // Update existing itinerary day
          const existingItineraryDay = await tx.bb_itineraryDay.findFirst({
            where: {
              id: day.id,
              packageId: data.packageId,
            },
          });

          if (!existingItineraryDay) {
            throw new ApiError(
              404,
              `Itinerary day with ID ${day.id} not found for this package`,
            );
          }

          // Check for dayNumber conflicts
          if (
            day.dayNumber &&
            day.dayNumber !== existingItineraryDay.dayNumber
          ) {
            const conflictingDay = await tx.bb_itineraryDay.findFirst({
              where: {
                packageId: data.packageId,
                dayNumber: day.dayNumber,
                id: { not: day.id },
              },
            });

            if (conflictingDay) {
              throw new ApiError(
                400,
                `Day number ${day.dayNumber} already exists for this package`,
              );
            }
          }

          const updateDayData: any = {};
          if (day.dayNumber !== undefined)
            updateDayData.dayNumber = day.dayNumber;
          if (day.title !== undefined) updateDayData.title = day.title;
          if (day.description !== undefined)
            updateDayData.description = day.description;

          if (Object.keys(updateDayData).length > 0) {
            await tx.bb_itineraryDay.update({
              where: { id: day.id },
              data: updateDayData,
            });
          }
        } else {
          // Create new itinerary day
          if (!day.dayNumber || !day.title) {
            throw new ApiError(
              400,
              "New itinerary days must have dayNumber and title",
            );
          }

          const existingDayWithNumber = await tx.bb_itineraryDay.findFirst({
            where: {
              packageId: data.packageId,
              dayNumber: day.dayNumber,
            },
          });

          if (existingDayWithNumber) {
            throw new ApiError(
              400,
              `Day number ${day.dayNumber} already exists for this package`,
            );
          }

          await tx.bb_itineraryDay.create({
            data: {
              dayNumber: day.dayNumber,
              title: day.title,
              description: day.description ?? null,
              packageId: data.packageId,
            },
          });
        }
      }
    }

    // Fetch and return updated package
    return await tx.bb_travelPackage.findUnique({
      where: { id: data.packageId },
      include: {
        agent: {
          select: {
            id: true,
            companyName: true,
            description: true,
          },
        },
        PackageBannerImage: true,
        packagesImages: true,
        address: true,
        itinerary: {
          orderBy: { dayNumber: "asc" },
        },
      },
    });
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updatedPackage, "Package updated successfully"));
});

export { updatePackage };
