import Booking from "../models/bookModel.js";
import User from "../models/userModel.js";
import { errorHandler } from "../utils/errorHandler.js";
import { sendEmail } from "../utils/sendEmail.js";


const createBooking = async(req,res,next) =>{
    try {
       
        let {area} = req.body
        let values = req.body
        const booking = await Booking.create({...req.body,userId: req.user.id});
        const admin = await User.findOne({area: area})
        const superAdmin = await User.findOne({role: "superAdmin"})
        
        let message =`<div style="font-family: system-ui, sans-serif, Arial; font-size: 12px">
  <div>A message by ${
    values.name
  } has been received. Kindly respond at your earliest convenience.</div>
  <div
    style="
      margin-top: 20px;
      padding: 15px 0;
      border-width: 1px 0;
      border-style: dashed;
      border-color: lightgrey;
    "
  >
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
  <tr>
    <td style="vertical-align: top; padding: 10px;">
      <div
        style="
          padding: 6px 10px;
          margin: 0 10px;
          background-color: aliceblue;
          border-radius: 5px;
          font-size: 26px;
          text-align: center;
        "
        role="img"
      >
        &#x1F464;
      </div>
    </td>
    <td style="vertical-align: top; padding: 10px;">
      <div style="color: #2c3e50; font-size: 16px; font-weight: bold;">
        ${values.name}
      </div>
      <div style="color: #999999; font-size: 13px;">
        ${values.date} ${values.time}
      </div>
      <p style="font-size: 16px; margin-top: 8px;">
        <strong>Service:</strong> ${values.service}<br />
        <strong>${
          values.customService?.length > 0 ? "Custom Service:" : ""
        }</strong> ${
      values.customService.length > 0 ? values.customService : ""
    }<br />
        <strong>Phone Number:</strong> ${values.phone}<br />
        <strong>Email:</strong> ${values.email}<br />
        <strong>Area:</strong> ${values.area}<br />
        <strong>Address:</strong> ${values.address}<br />
        <strong>Message:</strong> ${values.message}
      </p>
    </td>
  </tr>
</table>

  </div>
</div>`

        if(!admin || !superAdmin){
         return next(errorHandler(404, "Admin not found"))
        }
          await sendEmail(admin.email,"New Booking",`A new booking has been made by ${req.body.name}`,message)
           await sendEmail(superAdmin.email,"New Booking",`A new booking has been made by ${req.body.name}`,message)

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