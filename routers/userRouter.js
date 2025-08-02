import express from "express";
import { createuser } from "../user controllers/userController.js";

const userRouter = express.Router();
userRouter.post("/",createuser)
userRouter.post("/login",loginUser)

export default userRouter;