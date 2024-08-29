import { signup } from '../controllers/AuthController';
import express from 'express';

const router = express.Router()
router.post("/signup", signup);

export  {router as authRouter};