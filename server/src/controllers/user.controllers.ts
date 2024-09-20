import { asyncHandler } from "../utils/AsyncHandler";
import { CookieOptions, Request, Response } from "express";
import { loginSchema, signupSchema } from "../validation/auth.validation";
import { User } from "../models/user";
import { ApiError } from "../utils/ApiError";
import { sendCookieToken } from "../utils/sendCookieToken";
import { ApiResponse } from "../utils/ApiResponse";


const signup = asyncHandler(async (req: Request, res: Response) => {

    const body = req.body;

    // validate data using zod
    const validatedData = signupSchema.parse(body);

    // check if user already exists
    const userExists = await User.findOne({ email: validatedData.email.toLowerCase() });

    if (userExists) {
        throw new ApiError(409, "User already exists");
    }

    // register user
    const user = await User.create({
        name: validatedData.name,
        email: validatedData.email.toLowerCase(),
        password: validatedData.password,
    });

    sendCookieToken(res, user, "User registered successfully", 201);

})


const login = asyncHandler(async (req: Request, res: Response) => {

    const body = req.body;

    // validate data using zod
    const validatedData = loginSchema.parse(body);

    // check if user exists
    const userExists = await User.findOne({ email: validatedData.email.toLowerCase() });

    if (!userExists) {
        throw new ApiError(404, "User doesnot exists");
    }

    // check if password is correct
    const passwordMatch = await userExists.isPasswordValidated(validatedData.password);


    if (!passwordMatch) {
        throw new ApiError(401, "Password donot match");
    }

    sendCookieToken(res, userExists, "User logged in successfully", 200);

})

const logout = asyncHandler(async (req: Request, res: Response) => {

    if (!req.user) {
        return new ApiError(401, "User not logged in");
    }

    const CookieOptions: CookieOptions = {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
    };

    return res.status(200)
        .clearCookie("token", CookieOptions)
        .json(
            new ApiResponse(200, {}, "User logged out successfully.")
        )
        
});

const checkAuth = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json(new ApiError(401, "Unauthriozed request."));
    }
  
    return res.status(200)
      .json(
        new ApiResponse(200, {}, "User is authenticated.")
      )
  
  });

export { signup, login, logout , checkAuth};