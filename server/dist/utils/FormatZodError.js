"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatZodError = void 0;
const formatZodError = (error) => {
    let errors = {};
    error.errors?.map((issue) => {
        errors[issue.path?.[0]] = issue.message;
    });
    return {
        success: false,
        message: "Validation Error",
        errors: errors,
        data: null
    };
};
exports.formatZodError = formatZodError;
