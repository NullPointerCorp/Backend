import { Request, Response } from "express";
import * as service from "./paquete.service";

export const listarPaquetes = async (req: Request, res: Response) => {
  try {
    
    return res.json(await service.listarPaquetes());
  } catch (error) {
    return res.status(500).json({ message: "Error al listar paquetes" });
  }
};

export const obtenerPaquete = async (req: Request, res: Response) => {
  try {
    return res.json(await service.obtenerPaquete(Number(req.params.folio)));
  } catch (error: any) {
    if (error.message === "Paquete no encontrado") {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: "Error interno" });
  }
};

export const crearPaquete = async (req: Request, res: Response) => {
  try {
    return res.status(201).json(await service.crearPaquete(req.body));
  } catch (error: any) {
    return res.status(500).json({ message: "Error al crear paquete" });
  }
};

export const actualizarPaquete = async (req: Request, res: Response) => {
  try {
    return res.json(await service.actualizarPaquete(Number(req.params.folio), req.body));
  } catch (error: any) {
    if (error.message === "Paquete no encontrado") {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: "Error interno" });
  }
};

export const eliminarPaquete = async (req: Request, res: Response) => {
  try {
    await service.eliminarPaquete(Number(req.params.folio));
    return res.json({ message: "Paquete eliminado correctamente" });
  } catch (error: any) {
    if (error.message === "No se puede eliminar el paquete porque tiene registros asociados") {
      return res.status(409).json({ message: error.message });
    }
    return res.status(404).json({ message: "Paquete no encontrado" });
  }
};


