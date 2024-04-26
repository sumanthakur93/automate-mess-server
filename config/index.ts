import dotenv from "dotenv"
dotenv.config()

export const PORT = process.env.PORT || 5000
export const DEBUG = process.env.DEBUG
export const JWT_ACCESS_TOKEN = process.env.JWT_ACCESS_TOKEN
export const JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN
export const ADMIN_KEY = process.env.ADMIN_KEY
export const EXPIRY = {
    "1h": "1h",
    "7d": "7d",
}
export const FRONTEND_URL = process.env.FRONTEND_URL
export const RZP_KEY_ID = process.env.RZP_KEY_ID
export const RZP_SECRET = process.env.RZP_SECRET