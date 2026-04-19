import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { listarRoles, obtenerRol, crearRol, actualizarRol, eliminarRol } from "./rol.controller";

const router = Router();

router.get("/", authMiddleware, listarRoles);
router.get("/:id", authMiddleware, obtenerRol);
router.post("/nuevo", authMiddleware, crearRol);
router.put("/:id", authMiddleware, actualizarRol);
router.delete("/:id", authMiddleware, eliminarRol);

export default router;
