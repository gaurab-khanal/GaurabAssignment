"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = __importDefault(require("./app.js"));
const db_js_1 = __importDefault(require("./db/db.js"));
const PORT = process.env.PORT || 5000;
(0, db_js_1.default)().then(() => {
    app_js_1.default.listen(PORT, () => {
        console.log(`Server is running at PORT: ${process.env.PORT || 8000}`);
    });
})
    .catch((error) => {
    console.log("Error connecting to database", error);
});
