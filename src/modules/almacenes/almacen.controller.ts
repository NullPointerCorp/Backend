import { Request, Response } from "express";
import * as service from "./almacen.service";

export const listarAlmacenes = async (req: Request, res: Response) => {
  return res.json(await service.listarAlmacenes());
};

export const obtenerAlmacen = async (req: Request, res: Response) => {
  return res.json(await service.obtenerAlmacen(Number(req.params.id)));
};

export const crearAlmacen = async (req: Request, res: Response) => {
  return res.status(201).json(await service.crearAlmacen(req.body));
};

export const actualizarAlmacen = async (req: Request, res: Response) => {
  return res.json(await service.actualizarAlmacen(Number(req.params.id), req.body));
};

export const eliminarAlmacen = async (req: Request, res: Response) => {
  await service.eliminarAlmacen(Number(req.params.id));
  return res.json({ message: "Almacén eliminado correctamente" });
};
