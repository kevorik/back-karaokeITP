import { createTransport } from "nodemailer";
import { Injectable } from "@nestjs/common";
import { promisify } from "util";
@Injectable()
export class MailService {
  async sendEmail(options: any) {
    console.log("emailSENDLER", options);
    const mailTransport = createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      auth: { user: "karaoke.itp@gmail.com", pass: "sdyhndifsgzdwkaw" },
      tls: { rejectUnauthorized: false },
    });
    const recoveryCode = options.recovery_code;
    console.log("recoveryCoderecoveryCode", recoveryCode);
    const link = `http://localhost:5173/reset/${recoveryCode}`;
    console.log("linkzzzz", link);
    const email = options.email;

    const sendMail = promisify(mailTransport.sendMail.bind(mailTransport));
    const subjectName = "Recovery Password";
    return sendMail({
      from: "karaoke.itp@gmail.com",
      to: email,
      subject: subjectName,
      text: `Hello !Please use this ${link} to reset your password.`,
    });
  }
}
