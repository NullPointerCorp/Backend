import { Request, Response } from "express";
import * as service from "./tipoPaquete.service";

export const listarPaquetes = async (req: Request, res: Response) => {
  return res.json(await service.listarPaquetes());
};

export const obtenerTipoPaquete = async (req: Request, res: Response) => {
  return res.json(await service.obtenerTipoPaquete(Number(req.params.folio)));
};

export const crearTipoPaquete = async (req: Request, res: Response) => {
  return res.status(201).json(await service.crearTipoPaquete(req.body));
};

export const actualizarTipoPaquete = async (req: Request, res: Response) => {
  return res.json(await service.actualizarTipoPaquete(Number(req.params.folio), req.body));
};

export const eliminarTipoPaquete = async (req: Request, res: Response) => {
  await service.eliminarTipoPaquete(Number(req.params.folio));
  return res.json({ message: "Paquete eliminado correctamente" });
};
