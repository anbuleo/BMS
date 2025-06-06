import Booking from "../models/bookModel.js";
import User from "../models/userModel.js";
import { errorHandler } from "../utils/errorHandler.js";
import { sendEmail } from "../utils/sendEmail.js";


const createBooking = async(req,res,next) =>{
    try {
       
        // let {area} = req.body
        let values = req.body
        const booking = await Booking.create({...req.body,userId: req.user.id});
        const admin = await User.findOne({area: req.body.area})
        const superAdmin = await User.findOne({role: "superAdmin"})
        
        let template =`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Booking Confirmation - BookMyService</title>
    <style>
      body {
        font-family: system-ui, sans-serif, Arial;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
        color: #2c3e50;
      }
      .container {
        max-width: 600px;
        margin: 30px auto;
        background-color: #ffffff;
        border-radius: 8px;
        padding: 25px 30px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      }
      .header {
        text-align: center;
        margin-bottom: 20px;
      }
      .header h1 {
        color: #1e3a8a;
      }
      .info {
        font-size: 14px;
        line-height: 1.6;
      }
      .highlight-box {
        background-color: #e0f7fa;
        border-radius: 6px;
        padding: 15px;
        margin-top: 20px;
      }
      .row {
        display: flex;
        margin-bottom: 10px;
      }
      .label {
        width: 130px;
        font-weight: bold;
      }
      .footer {
        text-align: center;
        font-size: 12px;
        color: #888;
        margin-top: 30px;
        border-top: 1px dashed #ccc;
        padding-top: 15px;
      }
      .icon {
        font-size: 32px;
        text-align: center;
        margin-bottom: 10px;
        color: #00796b;
      }
      @media only screen and (max-width: 600px) {
        .row {
          flex-direction: column;
        }
        .label {
          width: 100%;
          margin-bottom: 5px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>BookMyService</h1>
        <p style="font-size: 15px; margin-top: 5px;">Booking Confirmation</p>
      </div>

      <div class="info">
        <p>Hi <strong>{{name}}</strong>,</p>
        <p>
          Thank you for booking a service with <strong>BookMyService</strong>!
          Below are your booking details:
        </p>
      </div>

      <div class="highlight-box">
        <div class="icon">📋</div>
        <div class="row"><div class="label">Date & Time:</div><div>{{date}} {{time}}</div></div>
        <div class="row"><div class="label">Name:</div><div>{{name}}</div></div>
        <div class="row"><div class="label">Service:</div><div>{{service}}</div></div>
       {{#if customService}}
  <div class="row"><div class="label">Custom Service:</div><div>{{customService}}</div></div>
{{/if}}
        
        <div class="row"><div class="label">Phone:</div><div>{{phone}}</div></div>
        <div class="row"><div class="label">Email:</div><div>{{email}}</div></div>
        <div class="row"><div class="label">Area:</div><div>{{area}}</div></div>
        <div class="row"><div class="label">Address:</div><div>{{address}}</div></div>
        {{#if message}}
        <div class="row"><div class="label">Note:</div><div>{{message}}</div></div>
        {{/if}}
      </div>

      <div class="info" style="margin-top: 20px;">
        <p>We will contact you shortly to confirm your booking and assign a service provider.</p>
        <p>If you did not request this service, please ignore this email.</p>
      </div>

      <div class="footer">
        &copy; 2025 BookMyService. All rights reserved.<br />
        This is an automated email. Please do not reply.
      </div>
    </div>
  </body>
</html>
`

let html = template
  .replace(/{{name}}/g, values.name)
  .replace(/{{date}}/g, values.date)
  .replace(/{{time}}/g, values.time)
  .replace(/{{email}}/g, values.email)
  .replace(/{{phone}}/g, values.phone)
  .replace(/{{address}}/g, values.address)
  .replace(/{{area}}/g, values.area)
  .replace(/{{service}}/g, values.service)
  .replace(/{{customService}}/g, values.customService || "")
  .replace(/{{message}}/g, values.message || "")
  .replace(/{{#if customService}}[\s\S]*?{{\/if}}/g, values.customService ? 
    `<div class="row"><div class="label">Custom Service:</div><div>${values.customService}</div></div>` : "")
  .replace(/{{#if message}}[\s\S]*?{{\/if}}/g, values.message ? 
    `<div class="row"><div class="label">Note:</div><div>${values.message}</div></div>` : "");




        if(!admin || !superAdmin){
         return next(errorHandler(404, "Admin not found"))
        }
          await sendEmail(admin.email,`A new booking has been made by ${req.body.name}`,html);
           await sendEmail(superAdmin.email,`A new booking has been made by ${req.body.name}`,html)

        return res.status(201).json({ success: true, message: "Booking created successfully", booking});
        
    } catch (error) {
        next(errorHandler(500, error.message))
    }
}

const getArea = async(req,res,next) =>{
    try {
        const admins = await User.find({ role: "admin", area: { $ne: null } }).select("area");
        const area = admins.map((admin) => admin.area);
        return res.status(200).json({ success: true, message: "Area fetched successfully", area});
        
    } catch (error) {
        next(errorHandler(500, error.message))
    }
}

const getAreabooking =async(req,res,next) =>{
    try {
        let {id,role} =req.user;
        const user = await User.findById(id);
        if(role !== "admin") return next(errorHandler(403, "You are not authorized to perform this action"))
        const area = user.area;
        const bookings = await Booking.find({ area: area }).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, message: "Area fetched successfully", bookings});
    } catch (error) {
        next(errorHandler(500, error.message))
    }
}


const getAllAreaBooking =async(req,res,next) =>{
    try {
        let {id} = req.user
        const user = await User.findById(id);
        if(user.role !== "superAdmin") return next(errorHandler(403, "You are not authorized to perform this action"))
        const bookings = await Booking.find().sort({ createdAt: -1 });
        return res.status(200).json({ success: true, message: "Area fetched successfully", bookings});
    } catch (error) {
        next(errorHandler(500, error.message))
    }
}
export default {createBooking,getArea,getAreabooking,getAllAreaBooking}