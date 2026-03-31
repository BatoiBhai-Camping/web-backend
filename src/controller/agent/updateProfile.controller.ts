import { db } from "../../db/db.js";
import type { Request, Response } from "express";
import { ApiResponse } from "../../uitls/apiResponse.js";
import { ApiError } from "../../uitls/apiError.js";
import { asyncHandler } from "../../uitls/asyncHandler.js";
import { updateAgentProfileSchema } from "../../validator/updataAgentProfile.validator.js";

const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;

  // Validate request body
  const validatedData = updateAgentProfileSchema.safeParse(req.body);
  console.log("her is the valid response", validatedData);
  if (!validatedData.success) {
    throw new ApiError(
      400,
      "invalid data for update the agent profile",
      validatedData.error.issues,
    );
  }

  const data = validatedData.data;

  // Check if agent profile exists
  const existingProfile = await db.bb_agentProfile.findUnique({
    where: {
      userId: userId!,
    },
    include: {
      user: {
        select: {
          profileImageId: true,
          phone: true,
        },
      },
    },
  });

  if (!existingProfile) {
    throw new ApiError(404, "Agent profile not found");
  }

  // Check if phone number already exists for another user
  if (data.phone && data.phone !== existingProfile.user.phone) {
    const phoneExists = await db.bb_user.findUnique({
      where: {
        phone: data.phone,
      },
    });

    if (phoneExists && phoneExists.id !== userId) {
      throw new ApiError(400, "Phone number already exists");
    }
  }

  // Separate user fields and agent profile fields
  const {
    fullName,
    phone,
    profileImageUrl,
    profileFileId,
    bannerImageUrl,
    bannerFileId,
    address,
    ...agentFields
  } = data;

  // Update both user and agent profile in a transaction
  const result = await db.$transaction(async (tx) => {
    let profileImageId = existingProfile.user.profileImageId;
    let bannerImageId = existingProfile.bannerImageId;

    // Handle profile image creation/update if URL provided
    if (profileImageUrl) {
      if (profileImageId) {
        await tx.bb_image.update({
          where: {
            id: profileImageId,
          },
          data: {
            imageUrl: profileImageUrl,
            ...(profileFileId && { fileId: profileFileId }),
          },
        });
      } else {
        const newImage = await tx.bb_image.create({
          data: {
            imageUrl: profileImageUrl,
            ...(profileFileId && { fileId: profileFileId }),
          },
        });
        profileImageId = newImage.id;
      }
    }

    // Handle banner image creation/update if URL provided
    if (bannerImageUrl) {
      if (bannerImageId) {
        await tx.bb_image.update({
          where: {
            id: bannerImageId,
          },
          data: {
            imageUrl: bannerImageUrl,
            ...(bannerFileId && { fileId: bannerFileId }),
          },
        });
      } else {
        const newBannerImage = await tx.bb_image.create({
          data: {
            imageUrl: bannerImageUrl,
            ...(bannerFileId && { fileId: bannerFileId }),
          },
        });
        bannerImageId = newBannerImage.id;
      }
    }

    // Handle address updates/creation (one-to-one relationship)
    if (address) {
      const existingAddress = await tx.bb_address.findFirst({
        where: { userId: userId! },
      });

      if (existingAddress) {
        // Update existing address
        const addressUpdateData: any = {};
        if (address.addressType !== undefined)
          addressUpdateData.addressType = address.addressType;
        if (address.country !== undefined)
          addressUpdateData.country = address.country;
        if (address.state !== undefined)
          addressUpdateData.state = address.state;
        if (address.district !== undefined)
          addressUpdateData.district = address.district;
        if (address.pin !== undefined) addressUpdateData.pin = address.pin;
        if (address.city !== undefined) addressUpdateData.city = address.city;
        if (address.longitude !== undefined)
          addressUpdateData.longitude = address.longitude;
        if (address.latitude !== undefined)
          addressUpdateData.latitude = address.latitude;

        if (Object.keys(addressUpdateData).length > 0) {
          await tx.bb_address.update({
            where: { id: existingAddress.id },
            data: addressUpdateData,
          });
        }
      } else {
        // Create new address
        await tx.bb_address.create({
          data: {
            userId: userId!,
            addressType: address.addressType || "PERMANENT",
            country: address.country || "",
            state: address.state || null,
            district: address.district || null,
            pin: address.pin || null,
            city: address.city || null,
            longitude: address.longitude || null,
            latitude: address.latitude || null,
          },
        });
      }
    }

    // Update user fields if provided
    if (fullName || phone !== undefined || profileImageId) {
      await tx.bb_user.update({
        where: {
          id: userId!,
        },
        data: {
          ...(fullName && { fullName }),
          ...(phone !== undefined && { phone }),
          ...(profileImageId && { profileImageId }),
        },
      });
    }

    // Update agent profile fields
    const updatedProfile = await tx.bb_agentProfile.update({
      where: {
        userId: userId!,
      },
      data: {
        ...(agentFields.companyName && {
          companyName: agentFields.companyName,
        }),
        ...(agentFields.description !== undefined && {
          description: agentFields.description,
        }),
        ...(agentFields.aadharNumber && {
          aadharNumber: agentFields.aadharNumber,
        }),
        ...(agentFields.panNumber && { panNumber: agentFields.panNumber }),
        ...(agentFields.gstNumber && { gstNumber: agentFields.gstNumber }),
        ...(bannerImageId && { bannerImageId }),
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            roleStatus: true,
            profileImage: {
              select: {
                id: true,
                imageUrl: true,
                fileId: true,
                createdAt: true,
              },
            },
            address: {
              select: {
                id: true,
                addressType: true,
                country: true,
                state: true,
                district: true,
                pin: true,
                city: true,
                longitude: true,
                latitude: true,
              },
            },
            createdAt: true,
            updatedAt: true,
          },
        },
        documents: true,
        bannerImage: {
          select: {
            id: true,
            imageUrl: true,
            fileId: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            packages: true,
            reviews: true,
          },
        },
      },
    });

    return updatedProfile;
  });

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Profile updated successfully"));
});

export { updateProfile };
