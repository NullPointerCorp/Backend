import { Request, Response } from "express";
import * as service from "./transporte.service";

export const listarTransportes = async (req: Request, res: Response) => {
  return res.json(await service.listarTransportes());
};

export const obtenerTransporte = async (req: Request, res: Response) => {
  return res.json(await service.obtenerTransporte(String(req.params.numero_serie)));
};

export const crearTransporte = async (req: Request, res: Response) => {
  return res.status(201).json(await service.crearTransporte(req.body));
};

export const actualizarTransporte = async (req: Request, res: Response) => {
  return res.json(await service.actualizarTransporte(String(req.params.numero_serie), req.body));
};

export const eliminarTransporte = async (req: Request, res: Response) => {
  await service.eliminarTransporte(String(req.params.numero_serie));
  return res.json({ message: "Transporte eliminado correctamente" });
};

export const listarTipos = async (req: Request, res: Response) => {
  return res.json(await service.listarTipos());
};

export const listarSubtipos = async (req: Request, res: Response) => {
  return res.json(await service.listarSubtipos());
};
