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

export const transportesDisponibles = async (req: Request, res: Response) => {
  const firebaseUid = (req as any).firebaseUid;
  const { fecha_salida, fecha_llegada, excluir_viaje_id } = req.query;
  return res.json(
    await service.obtenerTransportesDisponibles(
      firebaseUid,
      fecha_salida as string,
      fecha_llegada as string,
      excluir_viaje_id ? Number(excluir_viaje_id) : undefined
    )
  );
};

export const crearViaje = async (req: Request, res: Response) => {
  const firebaseUid = (req as any).firebaseUid;
  return res.status(201).json(await service.crearViaje(firebaseUid, req.body));
};

export const actualizarViaje = async (req: Request, res: Response) => {
  const firebaseUid = (req as any).firebaseUid;
  const viajeId = Number(req.params.viaje_id);
  return res.json(await service.actualizarViaje(firebaseUid, viajeId, req.body));
};

export const cancelarViaje = async (req: Request, res: Response) => {
  const firebaseUid = (req as any).firebaseUid;
  const viajeId = Number(req.params.viaje_id);
  return res.json(await service.cancelarViaje(firebaseUid, viajeId));
};

// Endpoints para app móvil
export const iniciarViaje = async (req: Request, res: Response) => {
  return res.json(await service.iniciarViaje(Number(req.params.viaje_id)));
};

export const finalizarViaje = async (req: Request, res: Response) => {
  return res.json(await service.finalizarViaje(Number(req.params.viaje_id)));
};

export const iniciarRegreso = async (req: Request, res: Response) => {
  return res.json(await service.iniciarRegreso(Number(req.params.viaje_id)));
};

export const confirmarRegreso = async (req: Request, res: Response) => {
  return res.json(await service.confirmarRegreso(Number(req.params.viaje_id)));
};
