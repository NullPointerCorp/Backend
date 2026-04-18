import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { crearEmpleadoSchema, editarEmpleadoSchema, empleadoIdParamSchema } from "./empleado.schema";
import {
  crearEmpleado,
  editarEmpleado,
  eliminarEmpleado,
  listarEmpleados,
  listarRoles,
  listarSucursalesCatalogo,
  listarSupervisores,
  obtenerEmpleado,
  listarTransportistas,
} from "./empleado.controller";

const router = Router();

router.get("/", authMiddleware, listarEmpleados);
router.get("/roles", authMiddleware, listarRoles);
router.get("/sucursales", authMiddleware, listarSucursalesCatalogo);
router.get("/supervisores", authMiddleware, listarSupervisores);
router.get('/transportistas', authMiddleware, listarTransportistas);
router.get("/:id", authMiddleware, validate(empleadoIdParamSchema, "params"), obtenerEmpleado);


router.post("/", authMiddleware, validate(crearEmpleadoSchema, "body"), crearEmpleado);

router.put(
  "/:id",
  authMiddleware,
  validate(empleadoIdParamSchema, "params"),
  validate(editarEmpleadoSchema, "body"),
  editarEmpleado,
);

router.delete("/:id", authMiddleware, validate(empleadoIdParamSchema, "params"), eliminarEmpleado);

export default router;
