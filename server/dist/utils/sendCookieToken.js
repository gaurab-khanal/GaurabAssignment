"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendCookieToken = void 0;
const ApiResponse_1 = require("./ApiResponse");
const sendCookieToken = (res, user, message, status) => {
    const token = user.getJwtToken();
    const cookieTime = parseInt(process.env.COOKIE_TIME);
    const options = {
        expires: new Date(Date.now() + cookieTime * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };
    const safeUser = user.toJSON();
    res.status(status).cookie("token", token, options).json(new ApiResponse_1.ApiResponse(status, safeUser, message));
};
exports.sendCookieToken = sendCookieToken;
