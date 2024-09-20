"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Priority = exports.Status = void 0;
var Status;
(function (Status) {
    Status["ToDo"] = "To Do";
    Status["InProgress"] = "In Progress";
    Status["Completed"] = "Completed";
})(Status || (exports.Status = Status = {}));
var Priority;
(function (Priority) {
    Priority["Low"] = "Low";
    Priority["Medium"] = "Medium";
    Priority["High"] = "High";
})(Priority || (exports.Priority = Priority = {}));
