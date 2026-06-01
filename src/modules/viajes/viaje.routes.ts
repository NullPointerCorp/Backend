import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { actualizarViaje, cancelarViaje, confirmarRegreso, crearViaje, finalizarViaje, iniciarRegreso, iniciarViaje, listarViajes, obtenerCatalogos, transportesDisponibles } from "./viaje.controller";

const router = Router();

router.get("/", authMiddleware, listarViajes);
router.get("/catalogos", authMiddleware, obtenerCatalogos);
router.get("/transportes-disponibles", authMiddleware, transportesDisponibles);
router.post("/nuevo", authMiddleware, crearViaje);
router.put("/:viaje_id", authMiddleware, actualizarViaje);
router.patch("/:viaje_id/cancelar", authMiddleware, cancelarViaje);
router.patch("/:viaje_id/iniciar", authMiddleware, iniciarViaje);
router.patch("/:viaje_id/finalizar", authMiddleware, finalizarViaje);
router.patch("/:viaje_id/regresar", authMiddleware, iniciarRegreso);
router.patch("/:viaje_id/confirmar-regreso", authMiddleware, confirmarRegreso);

export default router;
