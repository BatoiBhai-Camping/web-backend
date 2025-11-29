import { validENV } from "../validator/env.validator.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: validENV.GMAIL,
    pass: validENV.APP_PASSWORD,
  },
});

export { transporter };
