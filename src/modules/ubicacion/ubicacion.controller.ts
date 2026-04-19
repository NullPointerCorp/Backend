import { Request, Response } from "express";
import * as service from "./ubicacion.service";

export const listarEstados = async (req: Request, res: Response) => {
  return res.json(await service.listarEstados());
};

export const listarCiudadesPorEstado = async (req: Request, res: Response) => {
  return res.json(await service.listarCiudadesPorEstado(Number(req.params.estado_id)));
};
