import { loginSchema, signupSchema } from "@/schema/Auth";
import axiosInstance from "../axiosInstance";
import { z } from "zod";

type LoginFormValue = z.infer<typeof loginSchema>;
type SignupFormValue = z.infer<typeof signupSchema>;

export const loginApi = async (data:LoginFormValue) => {
    const response = await axiosInstance.post("/auth/login", data);
    return response;
};

export const signupApi = async (data:SignupFormValue) => {
    const response = await axiosInstance.post("/auth/signup", data);
    return response;
};

export const checkAuthApi = async () => {
    const response = await axiosInstance.get("/auth/check-auth");
    return response;
};