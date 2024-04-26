import { Request, Response, NextFunction } from "express";
import db from "../../db"

export const me = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const student = await db.student.findFirst({
            where: {
                rollNumber: {
                    equals: req.user?.rollNumber
                }
            },
            select: {
                name: true,
                email: true,
                roles: true,
                profilePhotoId: true,
                verified: true,
                rollNumber: true
            }
        })
        return res.status(200).json(student)
    } catch (err) {
        return next(err);
    }
}