import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { listarEstados, listarCiudadesPorEstado } from "./ubicacion.controller";
import { listarGerentes } from "../empleados/empleado.controller";

const router = Router();

router.get("/estados", authMiddleware, listarEstados);
router.get("/ciudades/:estado_id", authMiddleware, listarCiudadesPorEstado);

export default router;