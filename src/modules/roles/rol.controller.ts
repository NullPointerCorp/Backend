import { Request, Response } from "express";
import * as service from "./rol.service";

export const listarRoles = async (req: Request, res: Response) => {
  return res.json(await service.listarRoles());
};

export const obtenerRol = async (req: Request, res: Response) => {
  return res.json(await service.obtenerRol(Number(req.params.id)));
};

export const crearRol = async (req: Request, res: Response) => {
  return res.status(201).json(await service.crearRol(req.body));
};

export const actualizarRol = async (req: Request, res: Response) => {
  return res.json(await service.actualizarRol(Number(req.params.id), req.body));
};

export const eliminarRol = async (req: Request, res: Response) => {
  await service.eliminarRol(Number(req.params.id));
  return res.json({ message: "Rol eliminado correctamente" });
};
