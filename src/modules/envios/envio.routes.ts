import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { listarEnviosEmpleado, listarEnviosSucursal, listarEnvios, obtenerEnvio, crearEnvio, actualizarEnvio, cancelarEnvio } from "./envio.controller";

const router = Router();

router.get("/sucursal/:sucursal_id", authMiddleware, listarEnviosSucursal);
router.get("/empleado/:empleado_id", authMiddleware, listarEnviosEmpleado);
router.get("/", authMiddleware, listarEnvios);
router.get("/:id", authMiddleware, obtenerEnvio);
router.post("/nuevo", authMiddleware, crearEnvio);
router.put("/:id/cancelar", authMiddleware, cancelarEnvio);
router.put("/:id", authMiddleware, actualizarEnvio);

export default router;
