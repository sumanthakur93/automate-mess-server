import { Request, Response, NextFunction } from "express";
import { z } from "zod"
import db from "../../db"
import bcrypt from "bcrypt"
import CustomErrorHandler from "../../services/CustomErrorHandler";
import jwt from "jsonwebtoken"
import { JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN, EXPIRY, ADMIN_KEY } from "../../config"

const sch = z.object({
    email: z.string().email(),
    password: z.string(),
    adminKey: z.string() 
}).strict()

export const adminLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password, adminKey } = sch.parse(req.body)
        if(adminKey !== ADMIN_KEY){
            return next(new Error("Admin Key not valid"));
        }
        const data = await db.admin.findFirst({
            where: {
                email: {
                    equals: email
                }
            },
            select: { 
                password: true,
                name: true,
                email: true,
                profilePhotoId: true,
                roles: true,
                adminId: true
            }
        })
        if(!data?.password)return next(CustomErrorHandler.notFound())
        const { password: dbPass } = data
        const match = await bcrypt.compare(password, dbPass)
        if(!match)return next(CustomErrorHandler.wrongCredentials())
        const payload = { adminId: data.adminId }
        const accessToken = jwt.sign(payload, JWT_ACCESS_TOKEN as string, { expiresIn: EXPIRY["1h"] })
        const refreshToken = jwt.sign(payload, JWT_REFRESH_TOKEN as string, { expiresIn: EXPIRY["7d"] })
        await db.refresh_Token.create({
            data: { token: refreshToken }
        })
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
        }).json({ msg: "login success"})
    } catch (err) {
        return next(err);
    }
}