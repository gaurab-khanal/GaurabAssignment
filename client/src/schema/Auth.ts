import { z } from "zod";

export const signupSchema = z.object({
    name: z.string(
        { message: "Please provide your name" }).min(3, {
            message: "Name should be at least 3 character long.."
        }).max(50, {
            message: "Your name cannot exceed 50 characters"
        }),
    email: z.string({ message: "Please provide your email" })
        .email(),
    password: z.string({ message: "Please provide a password" })
        .min(6, { message: "Password must be at least 6 character" }),
    confirmPassword: z.string({ message: "confirm_password is required" })
        .min(6, { message: "Confirm Password must be at least 6 character" }),
})
    .refine((data) => data.password === data.confirmPassword, { message: "Confirm Password not match", path: ["confirmPassword"] })


export const loginSchema = z.object({
    email: z.string({ message: "Please provide your email" }).email(),
    password: z.string({ message: "Please provide a password" })
        .min(6, { message: "Password must be at least 6 character" })
})