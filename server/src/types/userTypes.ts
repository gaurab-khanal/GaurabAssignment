import { Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    getJwtToken: () => string;
    isPasswordValidated: (userLoginPassword: string) => Promise<boolean>;
}