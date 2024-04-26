import { NextFunction, Request, Response } from "express";
import CustomErrorHandler from "../services/CustomErrorHandler";
import jwt from "jsonwebtoken"
import { JWT_ACCESS_TOKEN } from "../config";
import { z } from "zod"

const adminAuth = (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken;
    if(!accessToken){
        return next(CustomErrorHandler.unAuthorized())
    }
    jwt.verify(accessToken,JWT_ACCESS_TOKEN as string, async (err: any, data: any) => {
        if(err){
            return next(new Error(err))
        }
        const sch = z.object({
            adminId: z.number().int()
        })
        const results = sch.safeParse(data)
        if(!results.success){
            return next(CustomErrorHandler.serverError());
        }
        req.admin = results.data
        next();
    })
}

export default adminAuth