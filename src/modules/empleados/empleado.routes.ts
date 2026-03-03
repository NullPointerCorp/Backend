import { Router } from "express";
import { listarEmpleados } from "./empleado.controller";

const router = Router();

router.get("/", listarEmpleados);

export default router;