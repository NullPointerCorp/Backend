import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { listarRoles } from "./rol.controller";

const router = Router();

router.get("/", authMiddleware, listarRoles);

export default router;