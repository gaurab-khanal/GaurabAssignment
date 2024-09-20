import { ApiError } from "../utils/ApiError.js";
import{ Request, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/user.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

export const verifyJwt = asyncHandler(async (req: Request, _, next:NextFunction) => {

    const token =
        req.cookies?.token ||
        req.header("Authorization")?.replace("Bearer ", "") ||
        req.body?.token;

    if (!token) {
        throw new ApiError(401, "Unauthorized request");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const user = await User.findById(decoded.id);

    if (!user) {
        throw new ApiError(401, "Invalid Token");
    }

    req.user = user;

    next();

});