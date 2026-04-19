import { Request, Response } from "express";
import * as service from "./tipoPaquete.service";

export const listarPaquetes = async (req: Request, res: Response) => {
  try {
    
    return res.json(await service.listarPaquetes());
  } catch (error) {
    return res.status(500).json({ message: "Error al listar paquetes" });
  }
};

export const obtenerTipoPaquete = async (req: Request, res: Response) => {
  try {
    return res.json(await service.obtenerTipoPaquete(Number(req.params.folio)));
  } catch (error: any) {
    if (error.message === "Paquete no encontrado") {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: "Error interno" });
  }
};

export const crearTipoPaquete = async (req: Request, res: Response) => {
  try {
    return res.status(201).json(await service.crearTipoPaquete(req.body));
  } catch (error: any) {
    return res.status(500).json({ message: "Error al crear paquete" });
  }
};

export const actualizarTipoPaquete = async (req: Request, res: Response) => {
  try {
    return res.json(await service.actualizarTipoPaquete(Number(req.params.folio), req.body));
  } catch (error: any) {
    if (error.message === "Paquete no encontrado") {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: "Error interno" });
  }
};

export const eliminarTipoPaquete = async (req: Request, res: Response) => {
  try {
    await service.eliminarTipoPaquete(Number(req.params.folio));
    return res.json({ message: "Paquete eliminado correctamente" });
  } catch (error: any) {
    if (error.message === "No se puede eliminar el paquete porque tiene registros asociados") {
      return res.status(409).json({ message: error.message });
    }
    return res.status(404).json({ message: "Paquete no encontrado" });
  }
};


