import { Request, Response, NextFunction } from "express";
import Razorpay from "razorpay";
import { RZP_KEY_ID, RZP_SECRET } from "../../config"
import { z } from "zod"

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    const sch = z.object({
        amount: z.number(),
        currency: z.string()
    }).strict()
    try {
        const { amount, currency } = sch.parse(req.body)
        const instance = new Razorpay({
            key_id: RZP_KEY_ID as string,
            key_secret: RZP_SECRET as string,
        });
        const options = { amount, currency }
        const order = await instance.orders.create(options)
        return res.status(200).json(order)
    } catch (err) {
        return next(err)
    }

}