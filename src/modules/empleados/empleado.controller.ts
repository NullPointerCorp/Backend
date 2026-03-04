import { Request, Response } from "express";
import { getAllEmpleados, getGerentes } from "./empleado.repository";
import { crearEmpleadoService, editarEmpleadoService, eliminarEmpleadoService } from "./empleado.service";

export const listarEmpleados = async (req: Request, res: Response) => {
  try {
    const empleados = await getAllEmpleados();
    return res.json(empleados);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno" });
  }
};

export const listarGerentes = async (req: Request, res: Response) => {
  try {
    const gerentes = await getGerentes();
    res.json(gerentes);
  } catch (error) {
    res.status(500).json({ message: "Error al listar gerentes" })
  }
}

export const crearEmpleado = async (req: Request, res: Response) => {
  try {
    const { nombre, correo, rol_id, sucursal_id } = req.body ?? {};

    if (!nombre || !correo || !rol_id) {
      return res.status(400).json({ message: "nombre, correo y rol_id son obligatorios" });
    }

    const result = await crearEmpleadoService({
      nombre: String(nombre),
      correo: String(correo),
      rol_id: Number(rol_id),
      sucursal_id: sucursal_id != null ? Number(sucursal_id) : null,
    });

    if ("error" in result) {
      return res.status(400).json({ message: result.error });
    }

    return res.status(201).json(result);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Error creando empleado", detail: String(error?.message ?? error) });
  }
};

export const editarEmpleado = async (req: Request, res: Response) => {
  try {
    const empleadoId = Number(req.params.id);
    if (!empleadoId) return res.status(400).json({ message: "id inválido" });

    const result = await editarEmpleadoService(empleadoId, req.body ?? {});
    if ("error" in result) return res.status(404).json({ message: result.error });

    return res.json({ ok: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno" });
  }
};

export const eliminarEmpleado = async (req: Request, res: Response) => {
  try {
    const empleadoId = Number(req.params.id);
    if (!empleadoId) return res.status(400).json({ message: "id inválido" });

    const result = await eliminarEmpleadoService(empleadoId);
    if ("error" in result) return res.status(404).json({ message: result.error });

    return res.json({ ok: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno" });
  }
};