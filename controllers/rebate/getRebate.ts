import { Request, Response, NextFunction } from "express";
import db from "../../db";

export const getRebate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await db.rebate.findMany({
            where: { rollNumber: { equals: req.user?.rollNumber }},
            select: { days: true, from: true, to: true, rebateId: true }
        })
        return res.status(200).json(data)
    } catch (err) {
        return next(err);
    }
}