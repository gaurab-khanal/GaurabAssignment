import { Router } from "express";
import { createTask, editTask } from "../controllers/task.controllers";
import { verifyJwt } from "../middleware/auth.middleware";


const router = Router();

router.post("/add", verifyJwt,createTask);
router.patch("/edit/:id", verifyJwt,editTask);

export default router;