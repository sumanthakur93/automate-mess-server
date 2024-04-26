import { Request, Response, NextFunction } from "express";
import db from "../../db";

export const adminGetRebate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await db.rebate.findMany({
            orderBy: {
                from: "desc"
            }
        })
        return res.status(200).json(data)
    } catch (err) {
        return next(err);
    }
}