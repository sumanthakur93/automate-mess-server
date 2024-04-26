import { Request, Response, NextFunction } from "express";
import { z } from "zod"
import db from "../../db"
import bcrypt from "bcrypt"
import CustomErrorHandler from "../../services/CustomErrorHandler";
import jwt from "jsonwebtoken"
import { JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN, EXPIRY } from "../../config"

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req?.cookies?.refreshToken
    if (!refreshToken) {
        return next(CustomErrorHandler.notFound());
    }
    // find refreshToken
    try {
        const token = await db.refresh_Token.findFirst({
            where: {
                token: {
                    equals: refreshToken
                }
            }
        })
        if (!token) {
            return next(CustomErrorHandler.notFound());
        }
    } catch (err) {
        return next(err)
    }

    jwt.verify(refreshToken, JWT_REFRESH_TOKEN as string, async (err: any,data: any) => {
        if(err){
            return next(new Error(err))
        }
        const sch = z.object({
            rollNumber: z.string()
        })
        const results = sch.safeParse(data)
        if(!results.success){
            return next(CustomErrorHandler.serverError());
        }
        const payload = results.data
        const accessToken = jwt.sign(payload, JWT_ACCESS_TOKEN as string, { expiresIn: EXPIRY["1h"] })
        const refreshToken = jwt.sign(payload, JWT_REFRESH_TOKEN as string, { expiresIn: EXPIRY["7d"] })
        try {
            await db.refresh_Token.create({
                data: { token: refreshToken }
            })
        } catch (err) {
            return next(err)
        }
        return res.status(200).cookie("accessToken", accessToken, { 
            expires: new Date(new Date().getTime() + 60 * 60 * 1000),
            sameSite: "strict",
            httpOnly: true,
        }).cookie("isAccessToken", true, {
            expires: new Date(new Date().getTime() + 60 * 60 * 1000),
        }).cookie("refreshToken",refreshToken,{
            expires: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
            sameSite: "strict",
            httpOnly: true,
        }).cookie("isRefreshToken",true,{
            expires: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
        }).json({ msg: "refresh token generated"})
    })
}

