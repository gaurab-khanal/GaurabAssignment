import rateLimit from "express-rate-limit";
import { ApiError } from "./ApiError";

export const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    limit: 500,               // Max 500 requests per hour
    standardHeaders: "draft-7",
    legacyHeaders: false,
    handler: () => {
        throw new ApiError(429, "Too many requests, please try again later.")
    }
});
