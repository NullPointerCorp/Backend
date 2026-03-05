import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { listarClientes, obtenerCliente, crearCliente, actualizarCliente, eliminarCliente, buscarPorCorreo } from "./cliente.controller";
const router = Router();

router.get("/", authMiddleware, listarClientes);
router.get("/buscar", authMiddleware, buscarPorCorreo);
router.get("/:id", authMiddleware, obtenerCliente);
router.post("/nuevo", authMiddleware, crearCliente);
router.put("/:id", authMiddleware, actualizarCliente);
router.delete("/:id", authMiddleware, eliminarCliente);

export default router;