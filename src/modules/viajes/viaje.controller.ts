import { Request, Response } from "express";
import { TipoFiltroViaje } from "./viaje.dto";
import * as service from "./viaje.service";

const getTipoFiltro = (value: unknown): TipoFiltroViaje => {
  return value === "entradas" || value === "todos" ? value : "salidas";
};

export const listarViajes = async (req: Request, res: Response) => {
  const firebaseUid = (req as any).firebaseUid;
  const tipo = getTipoFiltro(req.query.tipo);
  return res.json(await service.listarViajes(firebaseUid, tipo));
};

export const obtenerCatalogos = async (req: Request, res: Response) => {
  const firebaseUid = (req as any).firebaseUid;
  return res.json(await service.obtenerCatalogos(firebaseUid));
};

export const crearViaje = async (req: Request, res: Response) => {
  const firebaseUid = (req as any).firebaseUid;
  return res.status(201).json(await service.crearViaje(firebaseUid, req.body));
};
