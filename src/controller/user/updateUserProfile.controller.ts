import { db } from "../../db/db.js";
import type { Request, Response } from "express";
import { ApiResponse } from "../../uitls/apiResponse.js";
import { ApiError } from "../../uitls/apiError.js";
import { asyncHandler } from "../../uitls/asyncHandler.js";
import { updateUserProfileSchema } from "../../validator/updateUserProfile.validator.js";

const updateUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;

  // Validate request body
  const validatedData = updateUserProfileSchema.safeParse(req.body);
  if (!validatedData.success) {
    throw new ApiError(400, "Invalid data for update profile");
  }

  const data = validatedData.data;
  // Check if user exists
  const existingUser = await db.bb_user.findUnique({
    where: {
      id: userId!,
    },
  });

  if (!existingUser) {
    throw new ApiError(404, "User not found");
  }

  // Check if phone number already exists for another user
  if (data.phone && data.phone !== existingUser.phone) {
    const phoneExists = await db.bb_user.findUnique({
      where: {
        phone: data.phone,
      },
    });

    if (phoneExists && phoneExists.id !== userId) {
      throw new ApiError(400, "Phone number already exists");
    }
  }

  // Handle profile image creation/update if URL provided
  let profileImageId = existingUser.profileImageId;
  if (data.profileImageUrl) {
    // Create new image record or update existing
    if (existingUser.profileImageId) {
      await db.bb_image.update({
        where: {
          id: existingUser.profileImageId,
        },
        data: {
          imageUrl: data.profileImageUrl,
          ...(data.profileFileId && {
            fileId: data.profileFileId,
          }),
        },
      });
    } else {
      const newImage = await db.bb_image.create({
        data: {
          imageUrl: data.profileImageUrl,
          ...(data.profileFileId && {
            fileId: data.profileFileId,
          }),
        },
      });
      profileImageId = newImage.id;
    }
  }

  // Handle address updates/creation
  if (data.addresses && data.addresses.length > 0) {
    for (const address of data.addresses) {
      if (address.id) {
        // Update existing address
        await db.bb_address.update({
          where: {
            id: address.id,
          },
          data: {
            ...(address.addressType && { addressType: address.addressType }),
            ...(address.country !== undefined && { country: address.country }),
            ...(address.state !== undefined && { state: address.state }),
            ...(address.district !== undefined && {
              district: address.district,
            }),
            ...(address.pin !== undefined && { pin: address.pin }),
            ...(address.city !== undefined && { city: address.city }),
            ...(address.longitude !== undefined && {
              longitude: address.longitude,
            }),
            ...(address.latitude !== undefined && {
              latitude: address.latitude,
            }),
          },
        });
      } else {
        // Create new address
        await db.bb_address.create({
          data: {
            userId: userId!,
            addressType: address.addressType || "PERMANENT",
            country: address.country!,
            state: address.state!,
            district: address.district!,
            pin: address.pin!,
            city: address.city!,
            longitude: address.longitude!,
            latitude: address.latitude!,
          },
        });
      }
    }
  }

  // Update user profile
  const updatedUser = await db.bb_user.update({
    where: {
      id: userId!,
    },
    data: {
      ...(data.fullName && { fullName: data.fullName }),
      ...(data.phone !== undefined && { phone: data.phone }),
      ...(profileImageId && { profileImageId }),
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      role: true,
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
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, "User profile updated successfully"),
    );
});

export { updateUserProfile };
