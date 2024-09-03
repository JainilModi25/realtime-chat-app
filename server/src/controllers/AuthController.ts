//whatever should happen when we signup, login is written here

import User from "../models/UserModel";
import {sign} from "jsonwebtoken";
import { Types } from "mongoose";
import { Request, Response, NextFunction } from "express";     //explicit types from express
import dotenv from 'dotenv';
import { compare } from "bcrypt";

dotenv.config();

const maxAge = 3*24*60*6*1000;     //3days validity of token(in milliseconds)
const jwt_key = process.env.JWT_SECRET_KEY;
console.log(jwt_key);
if(!jwt_key){
    throw new Error("JWT Key is not defined");
}

//used to create the jwt token using the sign function, with the json fields and the secret key. extra opn of age of cookie is added. 
//This will later be verified using verify(token, jwt_key).
//anybody can decode this jwt token, but the verification can be done only if we have the secret key jwt_key.
const createToken = (email: string, userId: Types.ObjectId | string | number) => {
    return sign({email, userId}, jwt_key, {expiresIn: maxAge})
}


export const signup = async(req: Request, res: Response, next: NextFunction) => {
    try{
        const {email, password} = req.body;

        //validation err handling
        if(!email || !password){
            res.status(400).json({error: "Email and password are required!"})
        }

        // Checking if the user already exists
        const existingUser: any = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: "User with this email already exists." });
        }

        //database err handling
        let user: any;
        try {
            user = await User.create({email, password});
            
        } catch (dbError) {
            console.error("Database Error:", dbError);
            return res.status(500).json({ error: "Failed to create user in the database." });
        }

        // JWT creation and setting the cookie
        const token = createToken(email, user.id);
        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge,
            secure: true,
            sameSite: "none"
        });

        return res.status(201).json({
            user:{
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup
                //skipped the firstname, lastname as they aren't required when we signup
            }
        })

    }catch(err: any){
        console.error("Internal server error:", err);
        return res.status(500).json({error: "Internal server error"});
    }
}

export const login = async(req: Request, res: Response, next: NextFunction) => {
    try{
        const {email, password} = req.body;

        //validation err handling
        if(!email || !password){
            res.status(400).json({error: "Email and password are required!"})
        }

        //database err handling
        let user: any;
        try {
            user = await User.findOne({email});
            if(!user){
                return res.status(404).json({error: "User with given details not found."})
            }
        } catch (dbError) {
            console.error("Database Error:", dbError);
            return res.status(500).json({ error: "Failed to create user in the database." });
        }

        const comparePass = await compare(password, user.password);
        if(!comparePass){
            return res.status(400).json({error: "Password is incorrect."})
        }
        // JWT creation and setting the cookie
        const token = createToken(email, user.id);
        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge,
            secure: true,
            sameSite: "none"
        });

        return res.status(200).json({
            user:{
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                color: user.color
                //skipped the firstname, lastname as they aren't required when we signup
            }
        })

    }catch(err: any){
        console.error("Internal server error:", err);
        return res.status(500).json({error: "Internal server error"});
    }
}

export const getUserInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.userId) {
        const userData = await User.findById(req.userId);
        if (userData) {
          return res.status(200).json({
            id: userData?.id,
            email: userData?.email,
            profileSetup: userData.profileSetup,
            firstName: userData.firstname,
            lastName: userData.lastname,
            image: userData.image,
            color: userData.color,
          });
        } else {
          return res.status(404).send("User with the given id not found.");
        }
      } else {
        return res.status(404).send("User id not found.");
      }
    } catch (error) {
      console.log({ error });
      return res.status(500).send("Internal Server Error");
    }
  };