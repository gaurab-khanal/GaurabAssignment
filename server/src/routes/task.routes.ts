import { Router } from "express";
import { createTask } from "../controllers/task.controllers";
import { verifyJwt } from "../middleware/auth.middleware";


const router = Router();

router.post("/addtask", verifyJwt,createTask);

export default router;