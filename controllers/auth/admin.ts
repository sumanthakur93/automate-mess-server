import { Request, Response, NextFunction } from "express";
import db from "../../db"

export const admin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await db.admin.findFirst({
            where: {
                adminId: {
                    equals: req.admin?.adminId as number
                }
            },
            select: {
                name: true,
                email: true,
                roles: true,
                profilePhotoId: true,
                adminId: true
            }
        })
        return res.status(200).json(data)
    } catch (err) {
        return next(err);
    }
}