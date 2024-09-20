import z from "zod";
import { Priority, Status } from "../types/taskTypes";

export const taskSchema = z.object({
    title: z.string({ message: "Title cannot be empty" }).max(100, { message: "Title cannot exceed 100 characters" }),
    description: z.string().max(500, { message: "Description cannot exceed 500 characters" }).optional(),
    status: z.nativeEnum(Status, { message: "Invalid status" }),
    priority: z.nativeEnum(Priority, { message: "Invalid priority" }),
    dueDate: z.coerce.date().optional().refine((value) => {

        return !value || value > new Date()

    }, {
        message: "Due date must be a future date",
        path: ["dueDate"],
    }),
})