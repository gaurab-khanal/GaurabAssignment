import mongoose from "mongoose";
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

const editTask = asyncHandler(async (req: Request, res: Response) => {

    if (!req.user) {
        throw new ApiError(401, "Unauthorized");
    }

    const taskId: any = req.params.id;
    
    if (!(mongoose.Types.ObjectId.isValid(taskId))) {
        throw new ApiError(404, "Task ID is missing or invalid");
    }

    const body = req.body;

    // validate data using zod
    const validatedData = taskSchema.parse(body);

    const task = await Task.findById({ _id: taskId });
    console.log("Task updated successfully");

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    task.title = validatedData.title;
    task.description = validatedData.description;
    task.status = validatedData.status;
    task.priority = validatedData.priority;
    task.dueDate = validatedData.dueDate;
    

    await task.save();

    return res.status(200)
        .json(
            new ApiResponse(200, task, "Task updated successfully")
        )

});

export { createTask, editTask };