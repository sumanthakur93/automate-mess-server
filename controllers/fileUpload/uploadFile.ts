import { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import db from "../../db";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 1000000 * 100,
  },
}).single("file");

export const uploadFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // if (!req.file) {
  //   return next(new Error("All fields are required"));
  // }
  upload(req, res, async (err) => {
    if (err) {
      return next(err);
    }
    try {
      const flag = req.body.flag;
      if(!flag){
        await db.document.create({
          data: {
            documentId: req.file?.filename as string,
            docType: req.file?.mimetype as string,
            rollNumber: req.user?.rollNumber as string,
          },
        });
      }
      return res.status(200).json({ fileId: req.file?.filename as string });
    } catch (err) {
      return next(err);
    }
  });
};
