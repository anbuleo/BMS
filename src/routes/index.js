import express from 'express';
import userRouter from './userRoute.js';
import bookingRouter from './bookingRoute.js'

const router = express.Router();


router.use('/user',userRouter);
router.use('/booking',useRouter);



export default router