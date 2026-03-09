import { Request, Response } from "express";
import * as service from "./almacen.service";

export const listarAlmacenes = async (req: Request, res: Response) => {
  try {
    const almacenes = await service.listarAlmacenes();
    return res.json(almacenes);
  } catch (error) {
    return res.status(500).json({ message: "Error al listar almacenes" });
  }
};

export const obtenerAlmacen = async (req: Request, res: Response) => {
  try {
    const almacen = await service.obtenerAlmacen(Number(req.params.id));
    return res.json(almacen);
  } catch (error: any) {
    if (error.message === "Almacén no encontrado") {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: "Error interno" });
  }
};

export const crearAlmacen = async (req: Request, res: Response) => {
  try {
    const nuevoAlmacen = await service.crearAlmacen(req.body);
    return res.status(201).json(nuevoAlmacen);
  } catch (error: any) {
    return res.status(500).json({ message: "Error al crear almacén" });
  }
};

export const actualizarAlmacen = async (req: Request, res: Response) => {
  try {
    const almacen = await service.actualizarAlmacen(Number(req.params.id), req.body);
    return res.json(almacen);
  } catch (error: any) {
    if (error.message === "Almacén no encontrado") {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: "Error interno" });
  }
};

export const eliminarAlmacen = async (req: Request, res: Response) => {
  try {
    await service.eliminarAlmacen(Number(req.params.id));
    return res.json({ message: "Almacén eliminado correctamente" });
  } catch (error: any) {
    if (error.message === 'No se puede eliminar el almacén porque tiene registros asociados') {
      return res.status(409).json({ message: error.message });
    }
    return res.status(404).json({ message: "Almacén no encontrado" });
  }
};