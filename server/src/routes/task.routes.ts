import { Router } from "express";
import { createTask, deleteTask, editTask, getTasks } from "../controllers/task.controllers";
import { verifyJwt } from "../middleware/auth.middleware";


const router = Router();

router.post("/add", verifyJwt,createTask);
router.patch("/edit/:id", verifyJwt,editTask);
router.delete("/delete/:id", verifyJwt,deleteTask);
router.get("/", verifyJwt,getTasks);

export default router;