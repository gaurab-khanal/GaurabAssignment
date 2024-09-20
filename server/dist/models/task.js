"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const mongoose_1 = require("mongoose");
const taskTypes_1 = require("../types/taskTypes");
const taskSchema = new mongoose_1.Schema({
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
        enum: Object.values(taskTypes_1.Status),
        default: taskTypes_1.Status.ToDo
    },
    priority: {
        type: String,
        enum: Object.values(taskTypes_1.Priority),
        default: taskTypes_1.Priority.Low
    },
    dueDate: {
        type: Date,
        validate: {
            validator: function (value) {
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });
taskSchema.methods.softDelete = async function () {
    this.isDeleted = true;
    await this.save();
};
taskSchema.methods.updateStatus = async function (status) {
    this.status = status;
    await this.save();
};
exports.Task = (0, mongoose_1.model)("Task", taskSchema);
