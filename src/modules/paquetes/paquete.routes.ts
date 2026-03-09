import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { listarPaquetes, obtenerPaquete, crearPaquete, actualizarPaquete, eliminarPaquete } from "./paquete.controller";

const router = Router();

router.get("/", authMiddleware, listarPaquetes);
router.get("/:folio", authMiddleware, obtenerPaquete);
router.post("/nuevo", authMiddleware, crearPaquete);
router.put("/:folio", authMiddleware, actualizarPaquete);
router.delete("/:folio", authMiddleware, eliminarPaquete);

export default router;