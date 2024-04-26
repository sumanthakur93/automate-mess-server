import type { ErrorRequestHandler } from "express"
import { DEBUG } from "../config"
import CustomErrorHandler from '../services/CustomErrorHandler'
import { ValidationError } from 'zod-validation-error'

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    let statusCode = 500;
    let data = {
        message: 'Internal server error',
        ...(DEBUG === 'true' && { originalError: err.message })
    }

    if (err instanceof ValidationError) {
        statusCode = 422;
        data = {
            message: err.message
        }
    }

    if (err instanceof CustomErrorHandler) {
        statusCode = err.status;
        data = {
            message: err.message
        }
    }

    return res.status(statusCode).json(data);
}

export default errorHandler

