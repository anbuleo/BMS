import User from "../models/userModel.js";
import { errorHandler } from "../utils/errorHandler.js";
import jwt from "jsonwebtoken"
import { generateOTP } from "../utils/generateOtp.js";
import { sendEmail } from "../utils/sendEmail.js";


const logIn = async (req, res,next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user){
            let otp = generateOTP()
           const user =  await User.create({ ...req.body });
           let token = jwt.sign({ id: user._id,role: user.role }, process.env.JWT_SECRET, {
                 expiresIn: process.env.JWT_EXP,
           })
          await sendEmail(req.body.email,"Hai Welcome to Book my Services",otp)
            return res.status(201).json({ success: true, message: "User created successfully", otp, user,token});
        }else{
            let token = jwt.sign({ id: user._id,role: user.role }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXP,
          })
           await sendEmail(req.body.email,"Hai Welcome to Book my Services",otp)
            return res.status(200).json({ success: true, message: "User logged in successfully", user,token});
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