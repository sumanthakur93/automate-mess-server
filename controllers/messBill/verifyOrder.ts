import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { RZP_SECRET } from "../../config";
import crypto from "crypto";
import db from "../../db";
import CustomErrorHandler from "../../services/CustomErrorHandler";

export const verifyOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const sch = z
    .object({
      razorpay_order_id: z.string(),
      razorpay_payment_id: z.string(),
      razorpay_signature: z.string(),
      amount: z.number(),
    })
    .strict();
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
    } = sch.parse(req.body);
    const expectedSignature = crypto
      .createHmac("sha256", RZP_SECRET as string)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");
    if (expectedSignature !== razorpay_signature) {
      return next(new Error("Invalid signature"));
    }
    await db.transaction.create({
      data: {
        amount,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        rollNumber: req.user?.rollNumber as string,
      },
    });
    const data = await db.mess_Bill.findFirst({
      where: {
        rollNumber: req.user?.rollNumber,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 1,
      select: {
        rollNumber: true,
        month: true,
        year: true,
      },
    });
    if (!data) {
      return next(CustomErrorHandler.serverError());
    }
    data;
    await db.mess_Bill.update({
      where: {
        rollNumber_month_year: { ...data },
      },
      data: {
        balance: 0,
      },
    });
    return res.status(200).json({ payment: "success"})
  } catch (err) {
    return next(err);
  }
};
