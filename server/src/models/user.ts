import { Schema, model } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import { IUser } from "../types/userTypes";
import jwt from "jsonwebtoken";

const userSchema: Schema<IUser> = new Schema({
    name: {
        type: String,
        required: [true, "Please provide your name"],
        maxLength: [50, "Your name cannot exceed 50 characters"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Please provide your email"],
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: 6,
    },
}, { timestamps: true });


userSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) return next();

    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds); // Hash password
    next();
});


userSchema.methods.isPasswordValidated = async function (userLoginPassword: string) {
    return await bcrypt.compare(userLoginPassword, this.password);
}


userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_EXPIRY
    })
}



export const User = model<IUser>("User", userSchema);
