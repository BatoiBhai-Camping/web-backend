import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage,
});

export { upload };
