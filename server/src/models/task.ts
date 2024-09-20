import { Schema, model } from "mongoose";
import { ITask, Priority, Status } from "../types/taskTypes";

const taskSchema: Schema<ITask> = new Schema({
    title: {
        type: String,
        required: [true, "Please provide a title"],
        trim: true,
        maxLength: [100, "Title cannot exceed 100 characters"]
    },
    description: {
        type: String,
        trim: true,
        maxLength: [500, "Description cannot exceed 500 characters"]
    },
    status: {
        type: String,
        enum: Object.values(Status),
        default: Status.ToDo
    },
    priority: {
        type: String,
        enum: Object.values(Priority),
        default: Priority.Low
    },
    dueDate: {
        type: Date,
        validate: {
            validator: function (value: Date) {
                return value > new Date(); // Ensure the due date is in the future
            },
            message: "Due date must be a future date"
        }
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

taskSchema.methods.softDelete = async function () {
    this.isDeleted = true;
    await this.save();
}

taskSchema.methods.updateStatus = async function (status: Status) {
    this.status = status;
    await this.save();
}

export const Task = model<ITask>("Task", taskSchema);