import mongoose, { Document } from "mongoose";

export enum Status {
    ToDo = 'To Do',
    InProgress = 'In Progress',
    Completed = 'Completed',
}

export enum Priority {
    Low = 'Low',
    Medium = 'Medium',
    High = 'High',
}

export interface ITask extends Document {
    title: string;
    description?: string;
    status: Status;
    priority: Priority;
    dueDate?: Date;
    createdAt: Date;
    updatedAt: Date;
    user: mongoose.Types.ObjectId;
    isDeleted: boolean;
}