import type { Request, Response } from "express";
import { db } from "../../db/db.js";
import { ApiError } from "../../uitls/apiError.js";
import { asyncHandler } from "../../uitls/asyncHandler.js";
import { updatePackageValidator } from "../../validator/updatePkg.validator.js";
import { ApiResponse } from "../../uitls/apiResponse.js";

const updatePackage = asyncHandler(async (req: Request, res: Response) => {
  const valid = updatePackageValidator.safeParse(req.body);
  if (!valid.success) {
    throw new ApiError(400, valid.error.message);
  }

  const data = valid.data;
  const userId = req.userId;
  const agent = await db.bb_agentProfile.findUnique({
    where: {
      userId: userId!,
    },
    select: {
      id: true,
    },
  });
  if (!agent) {
    throw new ApiError(400, "this user is not associate with any agent");
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
        // Verify banner image exists before updating
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
          // Banner ID exists but record not found - create new
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

    // Update main package fields
    const updateData: any = {};
    if (data.title) updateData.title = data.title;
    if (data.description) updateData.description = data.description;
    if (data.pricePerPerson) updateData.pricePerPerson = data.pricePerPerson;
    if (data.totalSeats) {
      updateData.totalSeats = data.totalSeats;
      // Adjust available seats proportionally
      const bookedSeats = existingPackage.seatBooked;
      updateData.seatsAvailable = Math.max(0, data.totalSeats - bookedSeats);
    }
    if (data.discountAmount !== undefined)
      updateData.discountAmount = data.discountAmount;
    if (data.discountPercentage !== undefined)
      updateData.discountPercentage = data.discountPercentage;
    if (data.withTax !== undefined) updateData.withTax = data.withTax;
    if (data.taxPercentage !== undefined)
      updateData.taxPercentage = data.taxPercentage;
    if (data.destination) updateData.destination = data.destination;
    if (data.durationDays) updateData.durationDays = data.durationDays;
    if (data.startDate) updateData.startDate = new Date(data.startDate);
    if (data.endDate) updateData.endDate = new Date(data.endDate);
    if (data.bookingActiveFrom)
      updateData.bookingActiveFrom = new Date(data.bookingActiveFrom);
    if (data.bookingEndAt)
      updateData.bookingEndAt = new Date(data.bookingEndAt);
    if (data.packagePolicies) updateData.packagePolicies = data.packagePolicies;
    if (data.cancellationPolicies)
      updateData.cancellationPolicies = data.cancellationPolicies;
    if (bannerImageId) updateData.packageBannerImageId = bannerImageId;

    await tx.bb_travelPackage.update({
      where: { id: data.packageId },
      data: updateData,
    });

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
          // Verify image exists before updating
          const existingImage = await tx.bb_image.findFirst({
            where: {
              id: img.id,
              travelPackageId: data.packageId,
            },
          });

          if (existingImage) {
            // Update existing image
            await tx.bb_image.update({
              where: { id: img.id },
              data: {
                imageUrl: img.imageUrl,
                ...(img.fileId && { fileId: img.fileId }),
              },
            });
          } else {
            // Image ID provided but doesn't exist - create new
            await tx.bb_image.create({
              data: {
                imageUrl: img.imageUrl,
                fileId: img.fileId ?? null,
                travelPackageId: data.packageId,
              },
            });
          }
        } else {
          // Create new image
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
      // Delete related entities first
      for (const dayId of data.deleteItineraryDayIds) {
        await tx.bb_transport.deleteMany({ where: { itineraryDayId: dayId } });
        await tx.bb_visitPlace.deleteMany({ where: { itineraryDayId: dayId } });

        const mealPlan = await tx.bb_mealPlan.findUnique({
          where: { itineraryDayId: dayId },
        });
        if (mealPlan) {
          await tx.bb_meal.deleteMany({ where: { mealPlanId: mealPlan.id } });
          await tx.bb_mealPlan.delete({ where: { id: mealPlan.id } });
        }

        await tx.bb_hotelStay.deleteMany({ where: { itineraryDayId: dayId } });
      }

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
          // Verify itinerary day exists and belongs to package before updating
          const existingItineraryDay = await tx.bb_itineraryDay.findFirst({
            where: {
              id: day.id,
              packageId: data.packageId,
            },
          });

          if (existingItineraryDay) {
            // Update existing itinerary day
            const updateDayData: any = {};

            // Check if dayNumber is being changed and if it conflicts with another day
            if (
              day.dayNumber &&
              day.dayNumber !== existingItineraryDay.dayNumber
            ) {
              const conflictingDay = await tx.bb_itineraryDay.findFirst({
                where: {
                  packageId: data.packageId,
                  dayNumber: day.dayNumber,
                  id: { not: day.id }, // exclude current day
                },
              });

              if (conflictingDay) {
                throw new ApiError(
                  400,
                  `Day number ${day.dayNumber} already exists for this package. Please choose a different day number.`,
                );
              }

              updateDayData.dayNumber = day.dayNumber;
            }

            if (day.title) updateDayData.title = day.title;
            if (day.description !== undefined)
              updateDayData.description = day.description;

            // Only update if there are changes
            if (Object.keys(updateDayData).length > 0) {
              await tx.bb_itineraryDay.update({
                where: { id: day.id },
                data: updateDayData,
              });
            }

            // Handle hotel stay deletion if requested
            if (day.deleteHotelStay) {
              await tx.bb_hotelStay.deleteMany({
                where: { itineraryDayId: day.id },
              });
            }

            // Handle transport deletions
            if (day.deleteTransportIds?.length) {
              await tx.bb_transport.deleteMany({
                where: {
                  id: { in: day.deleteTransportIds },
                  itineraryDayId: day.id,
                },
              });
            }

            // Handle visit deletions
            if (day.deleteVisitIds?.length) {
              await tx.bb_visitPlace.deleteMany({
                where: {
                  id: { in: day.deleteVisitIds },
                  itineraryDayId: day.id,
                },
              });
            }

            // Handle meal deletions
            if (day.deleteMealIds?.length) {
              const existingMealPlan = await tx.bb_mealPlan.findUnique({
                where: { itineraryDayId: day.id },
              });

              if (existingMealPlan) {
                await tx.bb_meal.deleteMany({
                  where: {
                    id: { in: day.deleteMealIds },
                    mealPlanId: existingMealPlan.id,
                  },
                });
              }
            }

            // Update hotel stay
            if (day.hotelStay && !day.deleteHotelStay) {
              const existingHotel = await tx.bb_hotelStay.findUnique({
                where: { itineraryDayId: day.id },
              });

              const hotelData: any = {};
              if (day.hotelStay.hotelName)
                hotelData.hotelName = day.hotelStay.hotelName;
              if (day.hotelStay.checkIn)
                hotelData.checkIn = new Date(day.hotelStay.checkIn);
              if (day.hotelStay.checkOut)
                hotelData.checkOut = new Date(day.hotelStay.checkOut);
              if (day.hotelStay.address !== undefined)
                hotelData.address = day.hotelStay.address;
              if (day.hotelStay.wifi !== undefined)
                hotelData.wifi = day.hotelStay.wifi;
              if (day.hotelStay.tv !== undefined)
                hotelData.tv = day.hotelStay.tv;
              if (day.hotelStay.attachWashroom !== undefined)
                hotelData.attachWashroom = day.hotelStay.attachWashroom;
              if (day.hotelStay.acRoom !== undefined)
                hotelData.acRoom = day.hotelStay.acRoom;
              if (day.hotelStay.kitchen !== undefined)
                hotelData.kitchen = day.hotelStay.kitchen;

              if (existingHotel) {
                await tx.bb_hotelStay.update({
                  where: { id: existingHotel.id },
                  data: hotelData,
                });
              } else {
                await tx.bb_hotelStay.create({
                  data: {
                    itineraryDayId: day.id,
                    hotelName: day.hotelStay.hotelName!,
                    checkIn: day.hotelStay.checkIn
                      ? new Date(day.hotelStay.checkIn)
                      : null,
                    checkOut: day.hotelStay.checkOut
                      ? new Date(day.hotelStay.checkOut)
                      : null,
                    address: day.hotelStay.address ?? null,
                    wifi: day.hotelStay.wifi ?? false,
                    tv: day.hotelStay.tv ?? false,
                    attachWashroom: day.hotelStay.attachWashroom ?? false,
                    acRoom: day.hotelStay.acRoom ?? false,
                    kitchen: day.hotelStay.kitchen ?? false,
                  },
                });
              }
            }

            // Update transports
            if (day.transports?.length) {
              for (const t of day.transports) {
                if (t.id) {
                  // Verify transport exists before updating
                  const existingTransport = await tx.bb_transport.findFirst({
                    where: {
                      id: t.id,
                      itineraryDayId: day.id,
                    },
                  });

                  if (existingTransport) {
                    // Update existing transport
                    const transportData: any = {};
                    if (t.fromLocation)
                      transportData.fromLocation = t.fromLocation;
                    if (t.toLocation) transportData.toLocation = t.toLocation;
                    if (t.mode) transportData.mode = t.mode;
                    if (t.startTime)
                      transportData.startTime = new Date(t.startTime);
                    if (t.endTime) transportData.endTime = new Date(t.endTime);

                    await tx.bb_transport.update({
                      where: { id: t.id },
                      data: transportData,
                    });
                  } else {
                    // Create new transport if ID doesn't exist
                    await tx.bb_transport.create({
                      data: {
                        itineraryDayId: day.id,
                        fromLocation: t.fromLocation!,
                        toLocation: t.toLocation!,
                        mode: t.mode!,
                        startTime: new Date(t.startTime!),
                        endTime: new Date(t.endTime!),
                      },
                    });
                  }
                } else {
                  // Create new transport
                  await tx.bb_transport.create({
                    data: {
                      itineraryDayId: day.id,
                      fromLocation: t.fromLocation!,
                      toLocation: t.toLocation!,
                      mode: t.mode!,
                      startTime: new Date(t.startTime!),
                      endTime: new Date(t.endTime!),
                    },
                  });
                }
              }
            }

            // Update visits
            if (day.visits?.length) {
              for (const v of day.visits) {
                if (v.id) {
                  // Verify visit exists before updating
                  const existingVisit = await tx.bb_visitPlace.findFirst({
                    where: {
                      id: v.id,
                      itineraryDayId: day.id,
                    },
                  });

                  if (existingVisit) {
                    // Update existing visit
                    const visitData: any = {};
                    if (v.name) visitData.name = v.name;
                    if (v.address !== undefined) visitData.address = v.address;
                    if (v.description !== undefined)
                      visitData.description = v.description;
                    if (v.visitTime !== undefined)
                      visitData.visitTime = v.visitTime;

                    await tx.bb_visitPlace.update({
                      where: { id: v.id },
                      data: visitData,
                    });
                  } else {
                    // Create new visit if ID doesn't exist
                    await tx.bb_visitPlace.create({
                      data: {
                        itineraryDayId: day.id,
                        name: v.name!,
                        address: v.address ?? null,
                        description: v.description ?? null,
                        visitTime: v.visitTime ?? null,
                      },
                    });
                  }
                } else {
                  // Create new visit
                  await tx.bb_visitPlace.create({
                    data: {
                      itineraryDayId: day.id,
                      name: v.name!,
                      address: v.address ?? null,
                      description: v.description ?? null,
                      visitTime: v.visitTime ?? null,
                    },
                  });
                }
              }
            }

            // Update meals
            if (day.meals?.length) {
              const existingMealPlan = await tx.bb_mealPlan.findUnique({
                where: { itineraryDayId: day.id },
              });

              let mealPlanId: string;
              if (existingMealPlan) {
                mealPlanId = existingMealPlan.id;
              } else {
                const newMealPlan = await tx.bb_mealPlan.create({
                  data: { itineraryDayId: day.id },
                });
                mealPlanId = newMealPlan.id;
              }

              for (const m of day.meals) {
                if (m.id) {
                  // Verify meal exists before updating
                  const existingMeal = await tx.bb_meal.findFirst({
                    where: {
                      id: m.id,
                      mealPlanId: mealPlanId,
                    },
                  });

                  if (existingMeal) {
                    // Update existing meal
                    await tx.bb_meal.update({
                      where: { id: m.id },
                      data: {
                        type: m.type,
                        ...(m.mealDescription !== undefined && {
                          mealDescription: m.mealDescription,
                        }),
                      },
                    });
                  } else {
                    // Create new meal if ID doesn't exist
                    await tx.bb_meal.create({
                      data: {
                        mealPlanId: mealPlanId,
                        type: m.type,
                        mealDescription: m.mealDescription ?? null,
                      },
                    });
                  }
                } else {
                  // Create new meal
                  await tx.bb_meal.create({
                    data: {
                      mealPlanId: mealPlanId,
                      type: m.type,
                      mealDescription: m.mealDescription ?? null,
                    },
                  });
                }
              }
            }
          } else {
            // Itinerary day ID provided but doesn't exist - throw error instead of creating
            // This prevents duplicate dayNumber issues and maintains data integrity
            throw new ApiError(
              404,
              `Itinerary day with ID ${day.id} not found for this package`,
            );
          }
        } else {
          // Verify dayNumber doesn't already exist before creating new itinerary day
          const existingDayWithNumber = await tx.bb_itineraryDay.findFirst({
            where: {
              packageId: data.packageId,
              dayNumber: day.dayNumber!,
            },
          });

          if (existingDayWithNumber) {
            throw new ApiError(
              400,
              `Day number ${day.dayNumber} already exists for this package. Use the existing day's ID to update it.`,
            );
          }

          // Create new itinerary day (same logic as publish)
          const itinerary = await tx.bb_itineraryDay.create({
            data: {
              dayNumber: day.dayNumber!,
              title: day.title!,
              description: day.description ?? null,
              packageId: data.packageId,
            },
          });

          if (day.hotelStay) {
            await tx.bb_hotelStay.create({
              data: {
                itineraryDayId: itinerary.id,
                hotelName: day.hotelStay.hotelName!,
                checkIn: day.hotelStay.checkIn
                  ? new Date(day.hotelStay.checkIn)
                  : null,
                checkOut: day.hotelStay.checkOut
                  ? new Date(day.hotelStay.checkOut)
                  : null,
                address: day.hotelStay.address ?? null,
                wifi: day.hotelStay.wifi ?? false,
                tv: day.hotelStay.tv ?? false,
                attachWashroom: day.hotelStay.attachWashroom ?? false,
                acRoom: day.hotelStay.acRoom ?? false,
                kitchen: day.hotelStay.kitchen ?? false,
              },
            });
          }

          if (day.transports?.length) {
            for (const t of day.transports) {
              await tx.bb_transport.create({
                data: {
                  itineraryDayId: itinerary.id,
                  fromLocation: t.fromLocation!,
                  toLocation: t.toLocation!,
                  mode: t.mode!,
                  startTime: new Date(t.startTime!),
                  endTime: new Date(t.endTime!),
                },
              });
            }
          }

          if (day.visits?.length) {
            for (const v of day.visits) {
              await tx.bb_visitPlace.create({
                data: {
                  itineraryDayId: itinerary.id,
                  name: v.name!,
                  address: v.address ?? null,
                  description: v.description ?? null,
                  visitTime: v.visitTime ?? null,
                },
              });
            }
          }

          if (day.meals?.length) {
            const mealPlan = await tx.bb_mealPlan.create({
              data: { itineraryDayId: itinerary.id },
            });

            for (const m of day.meals) {
              await tx.bb_meal.create({
                data: {
                  mealPlanId: mealPlan.id,
                  type: m.type,
                  mealDescription: m.mealDescription ?? null,
                },
              });
            }
          }
        }
      }
    }

    // Fetch and return updated package
    return await tx.bb_travelPackage.findUnique({
      where: { id: data.packageId },
      include: {
        agent: true,
        PackageBannerImage: true,
        packagesImages: true,
        itinerary: {
          include: {
            hotelStay: true,
            meals: {
              include: {
                meals: true,
              },
            },
            transports: true,
            visits: true,
          },
        },
      },
    });
  });

  return res.status(200).json({
    success: true,
    message: "Package updated successfully",
    data: updatedPackage,
  });
});

export { updatePackage };
