import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { listarAlmacenes, obtenerAlmacen, crearAlmacen, actualizarAlmacen, eliminarAlmacen } from "./almacen.controller";

const router = Router();

router.get("/", authMiddleware, listarAlmacenes);
router.get("/:id", authMiddleware, obtenerAlmacen);
router.post("/nuevo", authMiddleware, crearAlmacen);
router.put("/:id", authMiddleware, actualizarAlmacen);
router.delete("/:id", authMiddleware, eliminarAlmacen);

export default router;