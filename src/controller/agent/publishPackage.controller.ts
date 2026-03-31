import type { Request, Response } from "express";
import { db } from "../../db/db.js";
import { ApiError } from "../../uitls/apiError.js";
import { asyncHandler } from "../../uitls/asyncHandler.js";
import { publishPackageValidator } from "../../validator/packagePublish.validator.js";

const publishPackage = asyncHandler(async (req: Request, res: Response) => {
  const valid = publishPackageValidator.safeParse(req.body);
  if (!valid.success) {
    throw new ApiError(400, "Inputs are invalid", valid.error.issues);
  }

  const data = valid.data;

  // Start the transaction
  const packageRes = await db.$transaction(async (tx) => {
    // Create banner image
    const bannerImage = await tx.bb_image.create({
      data: {
        imageUrl: data.bannerImageUrl,
        fileId: data.bannerImageFileId,
      },
      select: { id: true },
    });

    // Create package address if provided
    let addressId: string | undefined;
    if (data.packageAddress) {
      const address = await tx.bb_address.create({
        data: {
          country: data.packageAddress.country!,
          state: data.packageAddress.state!,
          district: data.packageAddress.district!,
          pin: data.packageAddress.pin!,
          city: data.packageAddress.city!,
          longitude: data.packageAddress.longitude!,
          latitude: data.packageAddress.latitude!,
        },
        select: { id: true },
      });
      addressId = address.id;
    }

    // Create main package
    const pkg = await tx.bb_travelPackage.create({
      data: {
        agentId: req.agentId!,
        title: data.title,
        description: data.description,
        pricePerPerson: data.pricePerPerson,

        totalSeats: data.totalSeats,
        seatsAvailable: data.totalSeats,
        seatsBooked: 0,

        discountPercentage: data.discountPercentage ?? 0,
        gstPercentage: data.gstPercentage ?? 0,

        destination: data.destination,
        durationDays: data.durationDays,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,

        packageBannerImageId: bannerImage.id,
        ...(addressId && { address: { connect: { id: addressId } } }),
      },
      select: { id: true },
    });

    // Create package images if provided
    if (data.packageImages?.length) {
      for (const img of data.packageImages) {
        await tx.bb_image.create({
          data: {
            imageUrl: img.imageUrl,
            fileId: img.fileId ?? null,
            travelPackageId: pkg.id,
          },
        });
      }
    }

    // Create itinerary days (simplified - no nested hotel, transport, visit, meal data)
    for (const day of data.itineraryDays) {
      await tx.bb_itineraryDay.create({
        data: {
          dayNumber: day.dayNumber,
          title: day.title,
          description: day.description ?? null,
          packageId: pkg.id,
        },
      });
    }

    return { pkg };
  }); // Transaction end

  return res.status(201).json({
    success: true,
    message: "Package published successfully",
    packageId: packageRes.pkg.id,
  });
});

export { publishPackage };
