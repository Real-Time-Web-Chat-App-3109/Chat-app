import jwt from "jsonwebtoken";
import { User } from "../Models/user.model.js";
import dotenv from "dotenv";
dotenv.config();

// authentication
export const auth=async (req,res,next)=>{

        const token=req.cookies?.jwt; 

        if(!token){
            return res.status(401).json({
                success:false,
                message:"token not found."
            }) 
        }


        //decoding jwt token
        try{
            const decode=jwt.verify(token,process.env.JWT_SECRET);

            if(!decode) return res.status(404).json({success:false,message:"not a valid token."});

            let userCredentials = await User.findById(decode?.userId);

            if(!userCredentials) return res.status(404).json({success:false,message:"not a valid token."});

            req.user=userCredentials;

            return next();

        } catch(err){

            return res.status(401).json({
                success:false,
                message:"error while decoding."
            })
        }       
}