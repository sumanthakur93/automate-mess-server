import { Request, Response, NextFunction } from "express";
import db from "../../db";
import { z } from "zod"

const schema = z.object({
    rollNumber: z.string(),
    days: z.number().int(),
    from: z.string(),
    to: z.string(),
}).strict()

export const addRebate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload = schema.parse(req.body)
        await db.rebate.create({
            data: {...payload}
        })
        return res.status(200).json({ msg: "success"})
    } catch (err) {
        return next(err);
    }
}