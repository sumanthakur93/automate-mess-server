import { Request, Response, NextFunction } from "express";
import { z } from "zod"
import db from "../../db"
import bcrypt from "bcrypt"
import CustomErrorHandler from "../../services/CustomErrorHandler";
import jwt from "jsonwebtoken"
import { JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN, EXPIRY } from "../../config"

const sch = z.object({
    rollNumber: z.string(),
    password: z.string()
}).strict()

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { rollNumber, password } = sch.parse(req.body)
        const data = await db.student.findFirst({
            where: {
                rollNumber: {
                    equals: rollNumber
                }
            }, 
            select: {
                password: true,
                name: true,
                email: true,
                rollNumber: true,
                profilePhotoId: true,
                roles: true
            }
        })
        if (!data?.password) return next(CustomErrorHandler.notFound())
        const { password: dbPass, rollNumber: dbRollNumber } = data
        const match = await bcrypt.compare(password, dbPass)
        if (!match) return next(CustomErrorHandler.wrongCredentials())
        const payload = { rollNumber: dbRollNumber }
        const accessToken = jwt.sign(payload, JWT_ACCESS_TOKEN as string, { expiresIn: EXPIRY["1h"] })
        const refreshToken = jwt.sign(payload, JWT_REFRESH_TOKEN as string, { expiresIn: EXPIRY["7d"] })
        await db.refresh_Token.create({
            data: { token: refreshToken }
        })
        return res.status(200).cookie("accessToken", accessToken, {
            expires: new Date(new Date().getTime() + 60 * 60 * 1000),
            sameSite: "none",
            httpOnly: true,
            secure: true,
        }).cookie("isAccessToken", true, {
            expires: new Date(new Date().getTime() + 60 * 60 * 1000),
            secure: true,
            sameSite: "none"
        }).cookie("refreshToken", refreshToken, {
            expires: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
            sameSite: "none",
            httpOnly: true,
            secure: true
        }).cookie("isRefreshToken", true, {
            expires: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
            secure: true,
            sameSite: "none"
        }).json({ msg: "login success" })
    } catch (err) {
        return next(err)
    }
}
