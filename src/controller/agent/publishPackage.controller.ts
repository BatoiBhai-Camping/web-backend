import type { Request, Response } from "express";
import { db } from "../../db/db.js";
import { ApiError } from "../../uitls/apiError.js";
import { asyncHandler } from "../../uitls/asyncHandler.js";
import { publishPackageValidator } from "../../validator/packagePublish.validator.js";

const publishPackage = asyncHandler(async (req: Request, res: Response) => {
  const valid = publishPackageValidator.safeParse(req.body);
  if (!valid.success) {
    throw new ApiError(400, valid.error.message);
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

    // Create main package
    const pkg = await tx.bb_travelPackage.create({
      data: {
        agentId: req.agentId!,
        title: data.title,
        description: data.description,
        pricePerPerson: data.pricePerPerson,

        totalSeats: data.totalSeats,
        seatsAvailable: data.totalSeats,
        seatBooked: 0,

        discountAmount: data.discountAmount ?? 0,
        discountPercentage: data.discountPercentage ?? 0,
        withTax: data.withTax ?? false,
        taxPercentage: data.taxPercentage ?? 0,

        destination: data.destination,
        durationDays: data.durationDays,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,

        bookingActiveFrom: new Date(data.bookingActiveFrom),
        bookingEndAt: new Date(data.bookingEndAt),

        packagePolicies: data.packagePolicies ?? "NA",
        cancellationPolicies: data.cancellationPolicies ?? "NA",

        packageBannerImageId: bannerImage.id,
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

    // Create itinerary days
    for (const day of data.itineraryDays) {
      const itinerary = await tx.bb_itineraryDay.create({
        data: {
          dayNumber: day.dayNumber,
          title: day.title,
          description: day.description ?? null,
          packageId: pkg.id,
        },
        select: { id: true },
      });

      // Create hotel stay if provided
      if (day.hotelStay) {
        await tx.bb_hotelStay.create({
          data: {
            itineraryDayId: itinerary.id,
            hotelName: day.hotelStay.hotelName,
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

      // Create transports
      for (const t of day.transports) {
        await tx.bb_transport.create({
          data: {
            itineraryDayId: itinerary.id,
            fromLocation: t.fromLocation,
            toLocation: t.toLocation,
            mode: t.mode,
            startTime: new Date(t.startTime),
            endTime: new Date(t.endTime),
          },
        });
      }

      // Create visiting places
      for (const v of day.visits) {
        await tx.bb_visitPlace.create({
          data: {
            itineraryDayId: itinerary.id,
            name: v.name,
            address: v.address ?? null,
            description: v.description ?? null,
            visitTime: v.visitTime ?? null,
          },
        });
      }

      // Create meal plan if meals are provided
      if (day.meals?.length) {
        const mealPlan = await tx.bb_mealPlan.create({
          data: {
            itineraryDayId: itinerary.id,
          },
          select: { id: true },
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

    return { pkg };
  }); // Transaction end

  return res.status(201).json({
    success: true,
    message: "Package published successfully",
    packageId: packageRes.pkg.id,
  });
});

export { publishPackage };
