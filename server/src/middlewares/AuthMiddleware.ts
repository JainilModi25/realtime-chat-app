import { Request, Response, NextFunction } from "express";
import jwt, {JwtPayload, VerifyErrors} from "jsonwebtoken";
import dotenv from "dotenv"

// Extend the Express Request interface to include the userId property
declare module 'express-serve-static-core' {
    interface Request {
      userId?: string;
      cookies: { [key: string]: string} | any; // Assuming you're using cookie-parser
    }
  }
  
  interface CustomJwtPayload extends JwtPayload {
    userId: string;
  }
  


dotenv.config();

const jwt_key = process.env.JWT_SECRET_KEY;
console.log(jwt_key);
if(!jwt_key){
    throw new Error("JWT Key is not defined");
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;
  if (!token) return res.status(401).send("You are not authenticated!");
  jwt.verify(token, jwt_key, (err: VerifyErrors | null, payload: JwtPayload | any) => {
      if (err) return res.status(403).send("Token is not valid!");
      
      // Type guard to ensure payload is of the correct type
    const customPayload = payload as CustomJwtPayload;
    if (customPayload && customPayload.userId) {
      req.userId = customPayload.userId;
    }
    
    next();
  });
};
