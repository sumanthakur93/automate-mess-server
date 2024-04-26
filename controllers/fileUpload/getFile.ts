import { Request, Response, NextFunction } from "express"
import path from "path"

export const getFile = async (req: Request, res: Response, next: NextFunction) => {
    const fileName = req.params.fileName
    if(!fileName){
        return next(new Error(`Invalid file`))
    }
    res.sendFile(path.join(__dirname,`../../uploads/${fileName}`))
}