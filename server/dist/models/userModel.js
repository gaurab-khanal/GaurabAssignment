"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const validator_1 = __importDefault(require("validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userSchema = new mongoose_1.Schema({
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
        validate: [validator_1.default.isEmail, "Please provide a valid email"],
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: 6,
    },
}, { timestamps: true });
userSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();
    const saltRounds = 10;
    this.password = await bcryptjs_1.default.hash(this.password, saltRounds); // Hash password
    next();
});
userSchema.methods.isPasswordValidated = async function (userLoginPassword) {
    return await bcryptjs_1.default.compare(userLoginPassword, this.password);
};
userSchema.methods.getJwtToken = function () {
    return jsonwebtoken_1.default.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY
    });
};
