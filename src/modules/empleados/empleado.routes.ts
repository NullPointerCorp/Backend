import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import {
  crearEmpleadoSchema,
  editarEmpleadoSchema,
  empleadoIdParamSchema,
} from "./empleado.schemas";
import {
  listarSupervisores,
  listarEmpleados,
  crearEmpleado,
  editarEmpleado,
  eliminarEmpleado,
} from "./empleado.controller";

const router = Router();

router.get("/", authMiddleware, listarEmpleados);
router.get("/supervisores", authMiddleware, listarSupervisores)

router.post(
  "/",
  authMiddleware,
  validate(crearEmpleadoSchema, "body"),
  crearEmpleado,
);

router.put(
  "/:id",
  authMiddleware,
  validate(empleadoIdParamSchema, "params"),
  validate(editarEmpleadoSchema, "body"),
  editarEmpleado,
);

router.delete(
  "/:id",
  authMiddleware,
  validate(empleadoIdParamSchema, "params"),
  eliminarEmpleado,
);

export default router;
