import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { crearViaje, listarViajes, obtenerCatalogos } from "./viaje.controller";

const router = Router();

router.get("/", authMiddleware, listarViajes);
router.get("/catalogos", authMiddleware, obtenerCatalogos);
router.post("/nuevo", authMiddleware, crearViaje);

export default router;
