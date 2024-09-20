"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = exports.logout = exports.login = exports.signup = void 0;
const AsyncHandler_1 = require("../utils/AsyncHandler");
const auth_validation_1 = require("../validation/auth.validation");
const user_1 = require("../models/user");
const ApiError_1 = require("../utils/ApiError");
const sendCookieToken_1 = require("../utils/sendCookieToken");
const ApiResponse_1 = require("../utils/ApiResponse");
const signup = (0, AsyncHandler_1.asyncHandler)(async (req, res) => {
    const body = req.body;
    // validate data using zod
    const validatedData = auth_validation_1.signupSchema.parse(body);
    // check if user already exists
    const userExists = await user_1.User.findOne({ email: validatedData.email.toLowerCase() });
    if (userExists) {
        throw new ApiError_1.ApiError(409, "User already exists");
    }
    // register user
    const user = await user_1.User.create({
        name: validatedData.name,
        email: validatedData.email.toLowerCase(),
        password: validatedData.password,
    });
    (0, sendCookieToken_1.sendCookieToken)(res, user, "User registered successfully", 201);
});
exports.signup = signup;
const login = (0, AsyncHandler_1.asyncHandler)(async (req, res) => {
    const body = req.body;
    // validate data using zod
    const validatedData = auth_validation_1.loginSchema.parse(body);
    // check if user exists
    const userExists = await user_1.User.findOne({ email: validatedData.email.toLowerCase() });
    if (!userExists) {
        throw new ApiError_1.ApiError(404, "User doesnot exists");
    }
    // check if password is correct
    const passwordMatch = await userExists.isPasswordValidated(validatedData.password);
    if (!passwordMatch) {
        throw new ApiError_1.ApiError(401, "Password donot match");
    }
    (0, sendCookieToken_1.sendCookieToken)(res, userExists, "User logged in successfully", 200);
});
exports.login = login;
const logout = (0, AsyncHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user) {
        return new ApiError_1.ApiError(401, "User not logged in");
    }
    const CookieOptions = {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
    };
    return res.status(200)
        .clearCookie("token", CookieOptions)
        .json(new ApiResponse_1.ApiResponse(200, {}, "User logged out successfully."));
});
exports.logout = logout;
const checkAuth = (0, AsyncHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user) {
        return res.status(401).json(new ApiError_1.ApiError(401, "Unauthriozed request."));
    }
    return res.status(200)
        .json(new ApiResponse_1.ApiResponse(200, {}, "User is authenticated."));
});
exports.checkAuth = checkAuth;
