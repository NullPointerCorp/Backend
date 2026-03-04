import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { getSession, prelogin, loginFailed } from "./auth.controller";

const router = Router();

// verificar bloqueo antes de intentar login
router.post("/prelogin", prelogin);

// registrar intento fallido
router.post("/login-failed", loginFailed);

// obtener sesión del usuario autenticado
router.get("/me", authMiddleware, getSession);

export default router;