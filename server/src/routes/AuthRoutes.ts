import { login, signup } from '../controllers/AuthController';
import express from 'express';

const router = express.Router()
router.post("/signup", signup);
router.post("/login", login);

export  {router as authRouter};