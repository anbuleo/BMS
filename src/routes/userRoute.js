import express from "express";
import userController from "../controllers/user.controller.js";
import { verifyUser } from "../utils/verifyUser.js";


const router = express.Router();


router.post('/logIn',userController.logIn)
router.post('/editRole',verifyUser,userController.editRole)

export default router