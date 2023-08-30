import {Buffer} from 'buffer';
import MailType from '../types/MailType';
import dotenv from 'dotenv';
const nodemailer = require("nodemailer");

dotenv.config()

const smtp_user = process.env.SMTP_USER;
const smtp_pwd = process.env.SMTP_PWD;

console.log(smtp_user ,  smtp_pwd)

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: smtp_user? smtp_user : "",
    pass: smtp_pwd ? Buffer.from(smtp_pwd, 'base64').toString('utf-8') : "",
  },
});


const sendEmail =  async (mail: MailType): Promise<void> => {

  const mailOptions = {
    from: mail.from,
    to: mail.to,
    subject: mail.subject,
    text: mail.text,
    html: mail.html,
  };

  try {
    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error; // Rethrow the error for handling at a higher level
  }

}

export {sendEmail};
