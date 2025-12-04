import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { validENV } from "../validator/env.validator.js";

cloudinary.config({
  cloud_name: validENV.CLOUDINARY_CLOUD_NAME,
  api_key: validENV.CLOUDINARY_API_KEY,
  api_secret: validENV.CLOUDINARY_API_SECRET,
});

// upload the assets to the cloudinary and sendback the url and fileid

const uploadToCloudinary = async (filePath: any) => {
  if (!filePath) {
    return null;
  }
  try {
    // upload the file to the cloudinary
    const uploadRes = await cloudinary.uploader.upload(filePath);
    if (!uploadRes) {
      if (validENV.NODE_ENV === "development") {
        console.log(uploadRes);
      }
      return null;
    }
    return {
      fileUrl: uploadRes.url,
      fileId: uploadRes.public_id,
    };
  } catch (error: any) {
    if (validENV.NODE_ENV === "development") {
      console.log(error);
    }
    fs.unlinkSync(filePath);
    return null;
  } finally {
    fs.unlinkSync(filePath);
  }
};

// delete asset from cloudinary
const deleteFromCloudinary = async (fileId: string) => {
  try {
    const deleteRes = await cloudinary.uploader.destroy(fileId);
    if (!deleteRes) {
      if (validENV.NODE_ENV === "development") {
        console.log(deleteRes);
      }
      return false;
    }
    return true;
  } catch (error: any) {
    if (validENV.NODE_ENV === "development") {
      console.log(error);
    }
    return false;
  }
};

export { uploadToCloudinary, deleteFromCloudinary };
