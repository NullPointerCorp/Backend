import { Request, Response } from "express";
import * as service from "./envio.service"

export const listarEnvios = async (req: Request, res: Response) => {
  return res.json(await service.listarEnvios());
};

export const obtenerEnvio = async (req: Request, res: Response) => {
  return res.json(await service.obtenerEnvio(Number(req.params.id)));
};

export const crearEnvio = async (req: Request, res: Response) => {
  const firebaseUid = (req as any).firebaseUid;
  return res.status(201).json(await service.crearEnvio(req.body, firebaseUid));
};

export const actualizarEnvio = async (req: Request, res: Response) => {
  await service.actualizarEnvio(Number(req.params.id), req.body);
  return res.json({ message: "Envío actualizado correctamente" });
};
