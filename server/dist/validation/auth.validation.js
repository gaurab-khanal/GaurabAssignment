"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.signupSchema = void 0;
const zod_1 = require("zod");
exports.signupSchema = zod_1.z.object({
    name: zod_1.z.string({ message: "Please provide your name" }).min(3, {
        message: "Name should be at least 3 character long.."
    }).max(50, {
        message: "Your name cannot exceed 50 characters"
    }),
    email: zod_1.z.string({ message: "Please provide your email" })
        .email(),
    password: zod_1.z.string({ message: "Please provide a password" })
        .min(6, { message: "Password must be at least 6 character" }),
    confirmPassword: zod_1.z.string({ message: "confirm_password is required" })
        .min(6, { message: "Confirm Password must be at least 6 character" }),
})
    .refine((data) => data.password === data.confirmPassword, { message: "Confirm Password not match", path: ["confirmPassword"] });
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string({ message: "Please provide your email" }).email(),
    password: zod_1.z.string({ message: "Please provide a password" })
        .min(6, { message: "Password must be at least 6 character" })
});
