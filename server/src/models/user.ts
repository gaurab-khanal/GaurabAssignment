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
        minlength: [3, "Name should be at least 3 character long.."],
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
        minlength: [6, "Password must be at least 6 character"],
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

userSchema.methods.toJSON = function () {
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
}

export const User = model<IUser>("User", userSchema);
