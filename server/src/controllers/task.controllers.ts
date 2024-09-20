import { Task } from "../models/task";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/AsyncHandler";
import { taskSchema } from "../validation/task.validation";
import e, { Request, Response } from "express";

const createTask = asyncHandler(async (req: Request, res: Response) => {

    if (!req.user) {
        throw new ApiError(401, "Unauthorized");
    }

    const body = req.body;

    // validate data using zod
    const validatedData = taskSchema.parse(body);


    // create task
    const task = await Task.create({
        title: validatedData.title,
        description: validatedData.description,
        status: validatedData.status,
        priority: validatedData.priority,
        dueDate: validatedData.dueDate,
        user: req.user._id,
    });

    return res.status(201)
        .json(
            new ApiResponse(201, task, "Task added successfully")
        )

});

export { createTask };