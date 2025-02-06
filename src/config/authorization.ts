import {NextFunction, Request,Response} from "express";
import jwt from "jsonwebtoken";

export const checkToken=(req:Request,res:Response,next:NextFunction)=>{
    const authHeader=req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        res.status(201).json({message:"Token Not Found in header"});
      }
      console.log(authHeader);
      const token = authHeader!.split(' ')[1];
  
      console.log("tokennn ",token);
    
      try {
        const decoded= jwt.verify(token, "jsomwebtoken");
        req.body.UserID=decoded;
        next();
      } catch (error) {
          res.status(400).json({message:"Token Not Found"});
      }
}