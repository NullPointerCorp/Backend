import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { listarClientes, obtenerCliente, crearCliente, actualizarCliente, eliminarCliente } from "./cliente.controller";

const router = Router();

router.get("/", authMiddleware, listarClientes);
router.get("/:id", authMiddleware, obtenerCliente);
router.post("/nuevo", authMiddleware, crearCliente);
router.put("/:id", authMiddleware, actualizarCliente);
router.delete("/:id", authMiddleware, eliminarCliente);

export default router;