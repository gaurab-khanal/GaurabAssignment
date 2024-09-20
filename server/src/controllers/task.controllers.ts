import mongoose from "mongoose";
import { Task } from "../models/task";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/AsyncHandler";
import { filterSortTaskSchema, taskSchema } from "../validation/task.validation";
import e, { Request, Response } from "express";
import { priorityOrder, statusOrder } from "../constants";

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

const deleteTask = asyncHandler(async (req: Request, res: Response) => {

    if (!req.user) {
        throw new ApiError(401, "Unauthorized");
    }

    const taskId: string = req.params.id;

    if (!(mongoose.Types.ObjectId.isValid(taskId))) {
        throw new ApiError(404, "Task ID is missing or invalid");
    }

    const task = await Task.findOne({ _id: taskId, isDeleted: false, user: req.user._id });

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    await task.softDelete();

    return res.status(200)
        .json(
            new ApiResponse(200, task, "Task deleted successfully")
        )

});

const getTasks = asyncHandler(async (req: Request, res: Response) => {

    if (!req.user) {
        throw new ApiError(401, "Unauthorized");
    }

    const { status, priority, dueDateStart, dueDateEnd, sortBy, sortOrder = "asc", page = 1, limit = 2 } = req.query;

    const object = {
        status,
        priority,
        dueDateStart,
        dueDateEnd,
        sortBy,
        sortOrder,
    }

    // validate data using zod
    filterSortTaskSchema.parse(object);

    // filter object
    const filter: any = {
        isDeleted: false,
        user: req.user._id
    };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    // useful to fetch task based on dueDate between two dates
    if (dueDateStart || dueDateEnd) {
        filter.dueDate = {};

        if (dueDateStart) filter.dueDate.$gte = new Date(dueDateStart as string);
        if (dueDateEnd) filter.dueDate.$lte = new Date(dueDateEnd as string);

    }

    // sort object

    let sort: any = {};

    if (sortBy && sortOrder) {
        sort[sortBy as string] = sortOrder === "asc" ? 1 : -1;
    } else {
        sort.createdAt = -1; // default sort createdAt in descending order
    }

    // pagination
    const skip = (Number(page) - 1) * Number(limit);


    const tasks = await Task.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .collation({ locale: 'en', strength: 2 });;


    // sorting by priority or status manually sorting based on priority or status order mentioned in constants.ts
    if (sortBy === 'priority' || sortBy === 'status') {
        tasks.sort((a, b) => {
            let compareValue;

            if (sortBy === 'priority') {
                compareValue = priorityOrder[a.priority] - priorityOrder[b.priority];
            } else {
                compareValue = statusOrder[a.status] - statusOrder[b.status];
            }

            // sorting order
            compareValue = sortOrder === 'asc' ? compareValue : -compareValue;

            // if compareValue is 0 then sort based on createdAt date
            if (compareValue !== 0) {
                return compareValue;
            }

            return (a.createdAt.getTime() || 0) - (b.createdAt.getTime() || 0);

        })
    }

    // calculate pagination infos

    const totalTask = await Task.countDocuments(filter);
    const totalPages = Math.ceil(totalTask / Number(limit));
    const hasNextPage = Number(page) < totalPages;
    const hasPrevPage = Number(page) > 1;

    const paginationInfo = {
        totalTask,
        totalPages,
        hasNextPage,
        hasPrevPage,
        currentPage: Number(page),
        limit: Number(limit)
    }


    return res.status(200)
        .json(
            new ApiResponse(200, {
                tasks,
                ...paginationInfo
            }, "Tasks retrieved successfully")
        )

});

export { createTask, editTask, deleteTask, getTasks };