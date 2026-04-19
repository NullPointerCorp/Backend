import { Request, Response } from "express";
import * as service from "./sucursal.service";

export const listarSucursales = async (req: Request, res: Response) => {
  return res.json(await service.listarSucursales());
};

export const obtenerSucursal = async (req: Request, res: Response) => {
  return res.json(await service.obtenerSucursal(Number(req.params.id)));
};

export const crearSucursal = async (req: Request, res: Response) => {
  return res.status(201).json(await service.crearSucursal(req.body));
};

export const actualizarSucursal = async (req: Request, res: Response) => {
  return res.json(await service.actualizarSucursal(Number(req.params.id), req.body));
};

export const eliminarSucursal = async (req: Request, res: Response) => {
  await service.eliminarSucursal(Number(req.params.id));
  return res.json({ message: "Sucursal eliminada correctamente" });
};

export const listarSucursalesPorCiudad = async (req: Request, res: Response) => {
  const sucursales = await service.getSucursalesByCiudad(Number(req.query.ciudad_id));
  return res.json(sucursales);
};
