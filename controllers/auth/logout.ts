import { NextFunction, Request, Response } from "express";

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  res
    .clearCookie("refreshToken")
    .clearCookie("accessToken")
    .clearCookie("isAccessToken")
    .clearCookie("isRefreshToken")
    .json({ msg: "logout success" });
};
