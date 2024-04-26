import { Request, Response, NextFunction } from "express";
import db from "../../db";

export const getTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await db.transaction.findMany({
      where: {
        rollNumber: {
          equals: req.user?.rollNumber,
        },
      },
    });
    return res.status(200).json(data);
  } catch (err) {
    return next(err);
  }
};
