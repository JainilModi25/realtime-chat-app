import { verifyToken } from 'middlewares/AuthMiddleware';
import { getUserInfo, login, signup } from '../controllers/AuthController';
import express from 'express';

const router = express.Router()
router.post("/signup", signup);
router.post("/login", login);
router.get("/user-info", verifyToken, getUserInfo)

export  {router as authRouter};