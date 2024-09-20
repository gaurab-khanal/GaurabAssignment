import { ZodError } from "zod";

export const formatZodError = (error: ZodError) => {
    let errors: any = {}
    error.errors?.map((issue) => {
        errors[issue.path?.[0]] = issue.message;
    })

    return {
        success: false,
        message: "Validation Error",
        errors: errors,
        data: null
    }
};