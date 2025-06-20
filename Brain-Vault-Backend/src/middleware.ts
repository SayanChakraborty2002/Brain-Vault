import { Request, Response,NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"

export function userMiddleware(req:Request,res:Response,next:NextFunction){
    try{
        const token = req.headers["authorization"];
        if(!token){
            res.status(401).json({message:"token missing"}) ; return;
        }
        const decoded=jwt.verify(token , process.env.JWT_SECRET_KEY!) as JwtPayload ;
        if(typeof decoded !=="object" || !decoded.userId){
            res.status(401).json({message:"invalid token"}) ; return;
        }
        req.userId =decoded.userId;
        next();
    }
    catch(err){
        res.status(403).json({ message: "Token verification failed" });
        return;
    }
}