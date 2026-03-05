import { Request, Response } from "express";
import { getAllEmpleados, getEmpleadoById, getRolesCatalogo, getSucursalesCatalogo, getSupervisores,} from "./empleado.repository";
import { crearEmpleadoService, editarEmpleadoService, eliminarEmpleadoService } from "./empleado.service";

const isDev = process.env.NODE_ENV !== "production";
const logDebug = (endpoint: string, payload: Record<string, unknown>) => {
  if (isDev) {
    console.log(`[empleados] ${endpoint}`, payload);
  }
};

const logSqlError = (endpoint: string, error: any) => {
  console.error(`[empleados] ${endpoint} error`, {
    message: error?.message,
    code: error?.code,
    errno: error?.errno,
    stack: isDev ? error?.stack : undefined,
  });
};

export const listarEmpleados = async (req: Request, res: Response) => {
  try {
    logDebug("GET /empleados", { params: req.params, query: req.query });
    const empleados = await getAllEmpleados();
    logDebug("GET /empleados result", { total: empleados.length });
    return res.json({ ok: true, data: empleados });
  } catch (error: any) {
    logSqlError("GET /empleados", error);
    return res.status(500).json({ ok: false, message: "Error interno" });
  }
};

export const obtenerEmpleado = async (req: Request, res: Response) => {
  try {
    const empleadoId = Number(req.params.id);
    logDebug("GET /empleados/:id", { empleadoId });

    const empleado = await getEmpleadoById(empleadoId);
    if (!empleado) {
      return res.status(404).json({ ok: false, message: "Empleado no encontrado" });
    }

    return res.json({ ok: true, data: empleado });
  } catch (error: any) {
    logSqlError("GET /empleados/:id", error);
    return res.status(500).json({ ok: false, message: "Error interno" });
  }
};

export const listarRoles = async (req: Request, res: Response) => {
  try {
    logDebug("GET /empleados/roles", {});
    const roles = await getRolesCatalogo();
    logDebug("GET /empleados/roles result", { total: roles.length });
    return res.json({ ok: true, data: roles });
  } catch (error: any) {
    logSqlError("GET /empleados/roles", error);
    return res.status(500).json({ ok: false, message: "Error al listar roles" });
  }
};

export const listarSucursalesCatalogo = async (req: Request, res: Response) => {
  try {
    logDebug("GET /empleados/sucursales", {});
    const sucursales = await getSucursalesCatalogo();
    logDebug("GET /empleados/sucursales result", { total: sucursales.length });
    return res.json({ ok: true, data: sucursales });
  } catch (error: any) {
    logSqlError("GET /empleados/sucursales", error);
    return res.status(500).json({ ok: false, message: "Error al listar sucursales" });
  }
};

export const listarSupervisores = async (req: Request, res: Response) => {
  try {
    const supervisores = await getSupervisores();
    return res.json({ ok: true, data: supervisores });
  } catch (error: any) {
    logSqlError("GET /empleados/supervisores", error);
    return res.status(500).json({ ok: false, message: "Error al listar supervisores" });
  }
};

export const crearEmpleado = async (req: Request, res: Response) => {
  try {
    const { estado_id, ...body } = req.body ?? {};
    if (estado_id !== undefined) {
      logDebug("POST /empleados estado_id recibido", { estado_id, note: "estado_id se ignora; se deriva por ciudad_id" });
    }

    const result = await crearEmpleadoService(body);

    if ("error" in result) return res.status(400).json({ ok: false, message: result.error });

    return res.status(201).json(result);
  } catch (error: any) {
    logSqlError("POST /empleados", error);
    return res.status(500).json({ ok: false, message: "Error interno al crear empleado" });
  }
};

export const editarEmpleado = async (req: Request, res: Response) => {
  try {
    const empleadoId = Number(req.params.id);
     if (!empleadoId) return res.status(400).json({ ok: false, message: "id inválido" });

    const { estado_id, ...body } = req.body ?? {};
    if (estado_id !== undefined) {
      logDebug("PUT /empleados/:id estado_id recibido", { estado_id, note: "estado_id se ignora; se deriva por ciudad_id" });
    }

    const result = await editarEmpleadoService(empleadoId, body);
    if ("error" in result) return res.status(400).json({ ok: false, message: result.error });

    return res.json(result);
  } catch (error: any) {
    logSqlError("PUT /empleados/:id", error);
    return res.status(500).json({ ok: false, message: "Error interno al actualizar empleado" });
  }
};

export const eliminarEmpleado = async (req: Request, res: Response) => {
  try {
    const empleadoId = Number(req.params.id);
    if (!empleadoId) return res.status(400).json({ ok: false, message: "id inválido" });

    const result = await eliminarEmpleadoService(empleadoId);
     if ("error" in result) {
      const status = result.code === "FK_CONSTRAINT" ? 409 : 404;
      return res.status(status).json({ ok: false, message: result.error });
    }

    return res.json({ ok: true, message: "Empleado eliminado correctamente." });
  } catch (error: any) {
    logSqlError("DELETE /empleados/:id", error);
    return res.status(500).json({ ok: false, message: "Error interno" });
  }
};