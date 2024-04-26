import { Request, Response, NextFunction } from "express";
import { z } from "zod"
import bcrypt from "bcrypt"
import db from "../../db";
import jwt from "jsonwebtoken"
import { JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN, EXPIRY, ADMIN_KEY } from "../../config"

const sch = z.object({
    name: z.string(),
    email: z.string(),
    adminKey: z.string(),
    password: z.string(),
})

export const adminRegister = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, adminKey, password } = sch.parse(req.body)
        if(adminKey !== ADMIN_KEY){
            return next(new Error("Admin Key not valid"));
        }
        const hashPassword = await bcrypt.hash(password,10)
        const payload = await db.admin.create({
            data: {
                email, name, password: hashPassword, roles: 'admin'
            },
            select: {
                adminId: true
            }
        })
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
        }).json({ msg: "register success"})
    } catch (err) {
        return next(err);
    }
}