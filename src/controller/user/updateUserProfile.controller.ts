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
    throw new ApiError(
      400,
      "Invalid data for update profile",
      validatedData.error.issues,
    );
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

  // Handle address updates/creation (one-to-one relationship)
  if (data.address) {
    const existingAddress = await db.bb_address.findFirst({
      where: { userId: userId! },
    });

    if (existingAddress) {
      // Update existing address
      const addressUpdateData: any = {};
      if (data.address.addressType !== undefined)
        addressUpdateData.addressType = data.address.addressType;
      if (data.address.country !== undefined)
        addressUpdateData.country = data.address.country;
      if (data.address.state !== undefined)
        addressUpdateData.state = data.address.state;
      if (data.address.district !== undefined)
        addressUpdateData.district = data.address.district;
      if (data.address.pin !== undefined)
        addressUpdateData.pin = data.address.pin;
      if (data.address.city !== undefined)
        addressUpdateData.city = data.address.city;
      if (data.address.longitude !== undefined)
        addressUpdateData.longitude = data.address.longitude;
      if (data.address.latitude !== undefined)
        addressUpdateData.latitude = data.address.latitude;

      if (Object.keys(addressUpdateData).length > 0) {
        await db.bb_address.update({
          where: { id: existingAddress.id },
          data: addressUpdateData,
        });
      }
    } else {
      // Create new address
      await db.bb_address.create({
        data: {
          userId: userId!,
          addressType: data.address.addressType || "PERMANENT",
          country: data.address.country || "",
          state: data.address.state || null,
          district: data.address.district || null,
          pin: data.address.pin || null,
          city: data.address.city || null,
          longitude: data.address.longitude || null,
          latitude: data.address.latitude || null,
        },
      });
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
