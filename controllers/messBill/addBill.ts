import { Request, Response, NextFunction } from "express";
import db from "../../db";
import { z } from "zod";

export const addBill = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const sch = z
    .object({
      rollNumber: z.string(),
      month: z.number().int().min(1).max(12),
      year: z.number().int(),
      amount: z.number(),
    })
    .strict();
  try {
    const { rollNumber, month, year, amount } = sch.parse(req.body);
    const recentMessBill = await db.mess_Bill.findFirst({
      where: { rollNumber: { equals: rollNumber } },
      orderBy: { createdAt: "desc" },
      select: { balance: true },
    });
    // if (!recentMessBill) {
    //   return next(new Error("404 not found"));
    // }
    await db.mess_Bill.create({
      data: {
        amount,
        balance: amount + (recentMessBill ? recentMessBill.balance : 0),
        month,
        year,
        rollNumber,
        studentId: rollNumber,
      },
    });
    return res.status(200).json({ msg: 'success' });
  } catch (err) {
    return next(err);
  }
};
