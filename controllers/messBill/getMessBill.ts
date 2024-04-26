import { Request, Response, NextFunction } from "express";
import db from "../../db";

export const getMessBill = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const messBill = await db.mess_Bill.findMany({
            where: {
                rollNumber: {
                    equals: req.user?.rollNumber
                }
            },
            orderBy: {
                createdAt: "desc"
            },
            select: {
                rollNumber: true,
                amount: true,
                balance: true,
                month: true,
                createdAt: true,
                year: true
            }
        })
        return res.status(200).json(messBill);
    } catch (err) {
        return next(err);
    }
}