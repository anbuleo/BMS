import User from "../models/userModel.js";
import { errorHandler } from "../utils/errorHandler.js";
import jwt from "jsonwebtoken"
import { generateOTP } from "../utils/generateOtp.js";
import { sendEmail } from "../utils/sendEmail.js";


const logIn = async (req, res,next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        let otp = generateOTP()
        const message = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>BookMyService OTP</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 10px;
        padding: 30px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
        margin-bottom: 30px;
      }
      .header h1 {
        color: #1d4ed8;
      }
      .otp-box {
        background-color: #e0f2fe;
        padding: 15px 25px;
        border-radius: 8px;
        font-size: 24px;
        text-align: center;
        letter-spacing: 5px;
        font-weight: bold;
        color: #0c4a6e;
        margin: 20px 0;
      }
      .message {
        font-size: 16px;
        color: #444;
        margin-bottom: 20px;
      }
      .footer {
        text-align: center;
        font-size: 14px;
        color: #888;
        margin-top: 30px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>BookMyService</h1>
      </div>
      <div class="message">
        <p>Hi,</p>
        <p>Your One-Time Password (OTP) for logging in is:</p>
      </div>
      <div class="otp-box">${otp}</div>
      <div class="message">
        <p>Please enter this OTP to complete your login. </p>
        <p>If you did not request this, please ignore this email.</p>
      </div>
      <div class="footer">
        &copy; 2025 BookMyService. All rights reserved.
      </div>
    </div>
  </body>
</html>
`

        if (!user){
           const user =  await User.create({ ...req.body });
           let token = jwt.sign({ id: user._id,role: user.role }, process.env.JWT_SECRET, {
                 expiresIn: process.env.JWT_EXP,
           })
          await sendEmail(req.body.email,"Your OTP Code - BookMyService",message)
            return res.status(201).json({ success: true, message: "User created successfully", otp, user,token});
        }else{
            let token = jwt.sign({ id: user._id,role: user.role }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXP,
          })
           await sendEmail(req.body.email,"Your OTP Code - BookMyService",message)
            return res.status(200).json({ success: true, message: "User logged in successfully", user,token,otp});
        }
        
    } catch (error) {
        next(errorHandler(500, error.message))
    }
}

const editRole = async(req,res,next)=>{
    try {
        let {role} = req.user
        const existArea = await User.findOne({area: req.body.area})
        if(existArea) return next(errorHandler(400, "Area already exist"))
        if(role !== "superAdmin") return next(errorHandler(403, "You are not authorized to perform this action"))
        const user = await User.findOneAndUpdate({ email: req.body.email }, { role: req.body.role, area: req.body.area,name: req.body.name }, { new: true });
        return res.status(200).json({ success: true, message: "User role updated successfully", user});
        
    } catch (error) {
        next(errorHandler(500, error.message))
    }
}

export default {
    logIn,
    editRole
}