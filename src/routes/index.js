import express from 'express';
import useRouter from './userRoute.js';

const router = express.Router();


router.use('/user',useRouter);



export default router