import { Document } from "mongoose";
import { IUser } from "../types/userTypes";
import { Response } from "express";
import { ApiResponse } from "./ApiResponse";


export const sendCookieToken = (res: Response, user: IUser, message: string, status: number) => {

    const token = user.getJwtToken();
    const cookieTime = parseInt(process.env.COOKIE_TIME!);

    const options = {
        expires: new Date(
            Date.now() + cookieTime * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };

    const safeUser = user.toJSON();

    res.status(status).cookie("token", token, options).json(
        new ApiResponse(status, safeUser, message)
    );

};


