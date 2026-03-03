import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { getSession } from "./auth.controller";

const router = Router();

router.get("/me", authMiddleware, getSession);

export default router;