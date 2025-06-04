import express from "express";
import userController from "../controllers/user.controller.js";
import { verifyUser } from "../utils/verifyUser.js";


const router = express.Router();


router.post('/login',userController.logIn)
router.post('/createrole',verifyUser,userController.editRole)

export default router