import { Request, Response, NextFunction } from "express";
import { z } from "zod"
import db from "../../db";

export const updateProfilePhotoIdAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const schema = z.object({
        profilePhotoId: z.string()
    }).strict()
    try {
        const { profilePhotoId } = schema.parse(req.body)
        // await db.admin.update({
        //     where: {
        //         adminId
        //     },
        //     data: {
        //         profilePhotoId
        //     }
        // })
        return res.status(200).json({ msg: "Success"})
    } catch (err) {
        return next(err)
    }
}