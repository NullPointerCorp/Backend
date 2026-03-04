import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { listarSucursales, obtenerSucursal, crearSucursal, actualizarSucursal, eliminarSucursal } from "./sucursal.controller";

const router = Router();

router.get("/", authMiddleware, listarSucursales);
router.get("/:id", authMiddleware, obtenerSucursal);
router.post("/nuevo", authMiddleware, crearSucursal);
router.put("/:id", authMiddleware, actualizarSucursal);
router.delete("/:id", authMiddleware, eliminarSucursal);

export default router;