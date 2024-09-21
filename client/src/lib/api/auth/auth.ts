import { loginSchema } from "@/schema/Auth";
import axiosInstance from "../axiosInstance";
import { z } from "zod";

type LoginFormValue = z.infer<typeof loginSchema>;

export const loginApi = async (data:LoginFormValue) => {
    const response = await axiosInstance.post("/auth/login", data);
    return response;
};