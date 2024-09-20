"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwt = void 0;
const ApiError_js_1 = require("../utils/ApiError.js");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_js_1 = require("../models/user.js");
const AsyncHandler_js_1 = require("../utils/AsyncHandler.js");
exports.verifyJwt = (0, AsyncHandler_js_1.asyncHandler)(async (req, _, next) => {
    const token = req.cookies?.token ||
        req.header("Authorization")?.replace("Bearer ", "") ||
        req.body?.token;
    if (!token) {
        throw new ApiError_js_1.ApiError(401, "Unauthorized request");
    }
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    const user = await user_js_1.User.findById(decoded.id);
    if (!user) {
        throw new ApiError_js_1.ApiError(401, "Invalid Token");
    }
    req.user = user;
    next();
});
