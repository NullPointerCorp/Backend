import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { listarSucursalesPorCiudad, listarSucursales, obtenerSucursal, crearSucursal, actualizarSucursal, eliminarSucursal } from "./sucursal.controller";

const router = Router();

router.get("/", authMiddleware, listarSucursales);
router.get("/por-ciudad", authMiddleware, listarSucursalesPorCiudad);
router.get("/:id", authMiddleware, obtenerSucursal);
router.post("/nuevo", authMiddleware, crearSucursal);
router.put("/:id", authMiddleware, actualizarSucursal);
router.delete("/:id", authMiddleware, eliminarSucursal);

export default router;