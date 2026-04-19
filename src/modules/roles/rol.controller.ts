import { Request, Response } from "express";
import * as service from "./rol.service";

export const listarRoles = async (req: Request, res: Response) => {
  try {
    const roles = await service.listarRoles();
    return res.json(roles);
  } catch (error) {
    return res.status(500).json({ message: "Error al listar los roles" });
  }
};

export const obtenerRol = async (req: Request, res: Response) => {
  try {
    const rol = await service.obtenerRol(Number(req.params.id));
    return res.json(rol);
  } catch (error: any) {
    if (error.message === "Rol no encontrado") {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: "Error interno" });
  }
};

export const crearRol = async (req: Request, res: Response) => {
  try {
    const nuevoRol = await service.crearRol(req.body);
    return res.status(201).json(nuevoRol);
  } catch (error: any) {
    return res.status(500).json({ message: "Error al crear rol" });
  }
};

export const actualizarRol = async (req: Request, res: Response) => {
  try {
    const rol = await service.actualizarRol(Number(req.params.id), req.body);
    return res.json(rol);
  } catch (error: any) {
    if (error.message === "Rol no encontrado") {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: "Error interno" });
  }
};

export const eliminarRol = async (req: Request, res: Response) => {
  try {
    await service.eliminarRol(Number(req.params.id));
    return res.json({ message: "Rol eliminado correctamente" });
  } catch (error: any) {
    if (error.message === 'No se puede eliminar el rol porque tiene registros asociados') {
      return res.status(409).json({ message: error.message });
    }
    return res.status(404).json({ message: "Rol no encontrado" });
  }
};
