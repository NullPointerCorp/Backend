import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { getSession, prelogin, loginFailed } from "./auth.controller";

const router = Router();

router.post("/prelogin", prelogin);
router.post("/login-failed", loginFailed);
router.get("/me", authMiddleware, getSession);
export default router;