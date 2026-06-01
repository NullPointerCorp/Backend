import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { actualizarViaje, cancelarViaje, confirmarRegreso, crearViaje, eliminarViaje, finalizarViaje, iniciarRegreso, iniciarViaje, listarViajes, listarViajesTransportista, obtenerCatalogos, transportesDisponibles } from "./viaje.controller";

const router = Router();

router.get("/transportista/:empleado_id", authMiddleware, listarViajesTransportista);
router.get("/", authMiddleware, listarViajes);
router.get("/catalogos", authMiddleware, obtenerCatalogos);
router.get("/transportes-disponibles", authMiddleware, transportesDisponibles);
router.post("/nuevo", authMiddleware, crearViaje);
router.put("/:viaje_id", authMiddleware, actualizarViaje);
router.delete("/:viaje_id", authMiddleware, eliminarViaje);
router.patch("/:viaje_id/cancelar", authMiddleware, cancelarViaje);
router.patch("/:viaje_id/iniciar", authMiddleware, iniciarViaje);
router.patch("/:viaje_id/finalizar", authMiddleware, finalizarViaje);
router.patch("/:viaje_id/regresar", authMiddleware, iniciarRegreso);
router.patch("/:viaje_id/confirmar-regreso", authMiddleware, confirmarRegreso);

export default router;
