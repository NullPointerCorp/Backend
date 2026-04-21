import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { listarEnvios, obtenerEnvio, crearEnvio, actualizarEnvio } from "./envio.controller";

const router = Router();

router.get("/", authMiddleware, listarEnvios);
router.get("/:id", authMiddleware, obtenerEnvio);
router.post("/nuevo", authMiddleware, crearEnvio);
router.put("/:id", authMiddleware, actualizarEnvio);

export default router;
