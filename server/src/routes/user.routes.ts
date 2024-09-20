import { Router } from "express";
import { checkAuth, login, logout, signup } from "../controllers/user.controllers";
import { verifyJwt } from "../middleware/auth.middleware";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", verifyJwt,logout);
router.get("/check-auth", verifyJwt,checkAuth);

export default router;