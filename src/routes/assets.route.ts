import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { uploadAsset } from "../controller/assetsHandeller.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const assetsRouter = Router(); // this router only handel the file uploading and deleting form the cloude

assetsRouter
  .route("/upload-file")
  .post(authMiddleware, upload.single("file"), uploadAsset);

export { assetsRouter };
