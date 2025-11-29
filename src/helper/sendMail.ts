import type z from "zod";
import { validENV } from "../validator/env.validator.js";
import { transporter } from "../uitls/nodeMaillerSetup.js";
import { accountVerificationTemplate } from "../mailTemplates/accoutverifyMailTemplate.js";
import { ApiError } from "../uitls/apiError.js";

type accountVerificationMailObjType = {
  reciverGamil: string;
  reciverName: string;
  verificationLink: string;
};

const sendAccountVerificationMail = async ({
  reciverGamil,
  reciverName,
  verificationLink,
}: accountVerificationMailObjType) => {
  try {
    const htmlcontent = accountVerificationTemplate(
      reciverName,
      verificationLink,
    );
    const mailOptions = {
      from: validENV.GMAIL,
      to: reciverGamil,
      subject: "For email/account verification with BatioBhai",
      html: htmlcontent,
    };
    const mailres = await transporter.sendMail(mailOptions);
    
  } catch (error: any) {
    throw new ApiError(
      500,
      error.message || "Internal server while sending the verification mail",
    );
  }
};

export { sendAccountVerificationMail };
