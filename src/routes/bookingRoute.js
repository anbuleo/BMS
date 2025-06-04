import express from "express";
import bookingController from "../controllers/booking.controller.js";
import { verifyUser } from "../utils/verifyUser.js";


const router = express.Router()

router.post('/create',verifyUser,bookingController.createBooking)
router.get('/getarea',bookingController.getArea)
router.get('/getbookingbyadmin',verifyUser,bookingController.getAreabooking)
router.get('/getallbooking',verifyUser,bookingController.getAllAreaBooking)


export default router