"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
require("dotenv/config");
const app = (0, express_1.default)();
const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || ["http://localhost:3000"];
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true,
}));
app.use(express_1.default.json({ limit: "16kb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "16kb" }));
app.use((0, cookie_parser_1.default)());
app.get('/healthcheck', (req, res) => {
    res.send('Hello World');
});
// route imports
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const zod_1 = require("zod");
const FormatZodError_1 = require("./utils/FormatZodError");
const ApiError_1 = require("./utils/ApiError");
// route declarations
app.use("/api/v1/auth", user_routes_1.default);
// error handler
app.use((err, req, res, next) => {
    if (err instanceof zod_1.ZodError) {
        const formattedError = (0, FormatZodError_1.formatZodError)(err);
        return res.status(422).json({
            success: formattedError.success,
            message: formattedError.message,
            errors: formattedError.errors,
            data: formattedError.data,
        });
    }
    else if (err instanceof ApiError_1.ApiError) {
        res.status(err.statusCode).json({
            success: err.success,
            message: err.message,
            errors: err.errors,
            data: err.data,
        });
    }
});
exports.default = app;
