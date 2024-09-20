import z from "zod";
import { Priority, SortBy, SortOrder, Status } from "../types/taskTypes";

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

export const filterSortTaskSchema = z.object({
    status: z.nativeEnum(Status).optional(),
    priority: z.nativeEnum(Priority).optional(),
    dueDateStart: z.coerce.date().optional(),
    dueDateEnd: z.coerce.date().optional(),
    sortBy: z.nativeEnum(SortBy).optional(),
    order: z.nativeEnum(SortOrder).optional(),
}).refine((data) => {
    if (data.dueDateStart && data.dueDateEnd) {
        return data.dueDateStart < data.dueDateEnd
    }
    return true
}, {
    message: "Due date start must be less than due date end",
    path: ["dueDateStart", "dueDateEnd"]
})