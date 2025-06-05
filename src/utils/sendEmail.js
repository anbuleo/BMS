import nodemailer from "nodemailer";
import env from "dotenv";
env.config();
 


export const sendEmail = async(to,subject,text)=>{
    try {
          const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
      
    });
  
    await transporter.sendMail({
      from: `"Book My Service" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html:text
    });
    } catch (error) {
        console.log(error)
    }
}