import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { listarPaquetes, obtenerTipoPaquete, crearTipoPaquete, actualizarTipoPaquete, eliminarTipoPaquete } from "./tipoPaquete.controller";

const router = Router();

router.get("/", authMiddleware, listarPaquetes);
router.get("/:folio", authMiddleware, obtenerTipoPaquete);
router.post("/nuevo", authMiddleware, crearTipoPaquete);
router.put("/:folio", authMiddleware, actualizarTipoPaquete);
router.delete("/:folio", authMiddleware, eliminarTipoPaquete);

export default router;
