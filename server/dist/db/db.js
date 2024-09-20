"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const constants_1 = require("../constants");
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(`${process.env.MONGO_URI}/${constants_1.DB_NAME}`);
        console.log("MONGODB connected");
    }
    catch (error) {
        console.log("MONGODB connection error", error);
        process.exit(1);
    }
};
exports.default = connectDB;
