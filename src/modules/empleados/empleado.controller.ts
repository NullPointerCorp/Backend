import { Request, Response } from "express";
import { getAllEmpleados, getEmpleadoById, getRolesCatalogo, getSucursalesCatalogo, getSupervisores, getTransportistas } from "./empleado.repository";
import { crearEmpleadoService, editarEmpleadoService, eliminarEmpleadoService } from "./empleado.service";

const isDev = process.env.NODE_ENV !== "production";

const logDebug = (endpoint: string, payload: Record<string, unknown>) => {
  if (isDev) console.log(`[empleados] ${endpoint}`, payload);
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
    const empleados = await getAllEmpleados();
    return res.json({ ok: true, data: empleados });
  } catch (error: any) {
    logSqlError("GET /empleados", error);
    return res.status(500).json({ ok: false, message: "Error interno" });
  }
};

export const obtenerEmpleado = async (req: Request, res: Response) => {
  try {
    const empleado = await getEmpleadoById(Number(req.params.id));
    if (!empleado) return res.status(404).json({ ok: false, message: "Empleado no encontrado" });
    return res.json({ ok: true, data: empleado });
  } catch (error: any) {
    logSqlError("GET /empleados/:id", error);
    return res.status(500).json({ ok: false, message: "Error interno" });
  }
};

export const listarRoles = async (req: Request, res: Response) => {
  try {
    const roles = await getRolesCatalogo();
    return res.json({ ok: true, data: roles }); 
  } catch (error: any) {
    logSqlError("GET /empleados/roles", error);
    return res.status(500).json({ ok: false, message: "Error al listar roles" });
  }
};

export const listarSucursalesCatalogo = async (req: Request, res: Response) => {
  try {
    const sucursales = await getSucursalesCatalogo();
    return res.json({ ok: true, data: sucursales }); 
  } catch (error: any) {
    logSqlError("GET /empleados/sucursales", error);
    return res.status(500).json({ ok: false, message: "Error al listar sucursales" });
  }
};

export const listarSupervisores = async (req: Request, res: Response) => {
  try {
    const supervisores = await getSupervisores()
    return res.json({ ok: true, data: supervisores }) 
  } catch (error: any) {
    logSqlError("GET /empleados/supervisores", error);
    return res.status(500).json({ ok: false, message: "Error al listar supervisores" });
  }
}

export const listarTransportistas = async (req: Request, res: Response) => {
  try {
    const transportistas = await getTransportistas()
    return res.json({ ok: true, data: transportistas })
  } catch (error: any) {
    logSqlError("GET /empleados/transportistas", error);
    return res.status(500).json({ ok: false, message: "Error al listar transportistas" });
  }
}

export const crearEmpleado = async (req: Request, res: Response) => {
  try {
    const { estado_id, ...body } = req.body ?? {};
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
    const result = await editarEmpleadoService(empleadoId, body);

    if ("error" in result) return res.status(400).json({ ok: false, message: result.error });
    return res.json(result);
  } catch (error: any) {
    logSqlError("PUT /empleados/:id", error);
    return res.status(500).json({ ok: false, message: "Error interno" });
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

    return res.json({ ok: true });
  } catch (error: any) {
    logSqlError("DELETE /empleados/:id", error);
    return res.status(500).json({ ok: false, message: "Error interno" });
  }
};
