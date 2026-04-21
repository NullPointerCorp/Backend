import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { listarEnvios, obtenerEnvio, crearEnvio, actualizarEnvio, cancelarEnvio } from "./envio.controller";

const router = Router();

router.get("/", authMiddleware, listarEnvios);
router.get("/:id", authMiddleware, obtenerEnvio);
router.post("/nuevo", authMiddleware, crearEnvio);
router.put("/:id/cancelar", authMiddleware, cancelarEnvio);
router.put("/:id", authMiddleware, actualizarEnvio);

export default router;
