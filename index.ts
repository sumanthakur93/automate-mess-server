import express, { Request, Response } from "express";
import cors from "cors";
import { FRONTEND_URL, PORT } from "./config";
import router from "./router";
import errorHandler from "./middleware/errorHandler";
import cookieParser from "cookie-parser"
import { IAdmin, IJWTPayload } from "./types";
import path from "path";

declare global {
    namespace Express {
      interface Request {
        user?: IJWTPayload;
        file?: Multer.File;
        admin?:IAdmin
      }
    }
}

const app = express();

app.use(express.json());
app.use(cookieParser())
app.use(express.static(path.join(__dirname,'/uploads')));
app.use(cors({
  credentials: true,
  origin: ['http://localhost:3000','http://localhost:5173',FRONTEND_URL as string]
}))
app.use(errorHandler)
app.get("/", (req: Request, res: Response) => {
    res.send("<h1> Hello World!! </h1>");
});
app.use("/api",router)

app.listen(PORT, () => {
    console.log(`listening on http://localhost:${PORT}`); 
});
  