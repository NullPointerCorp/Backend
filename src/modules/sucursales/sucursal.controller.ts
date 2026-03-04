import { Request, Response } from "express";
import * as service from "./sucursal.service";

export const listarSucursales = async (req: Request, res: Response) => {
  try {
    const sucursales = await service.listarSucursales();
    res.json(sucursales);
  } catch (error) {
    res.status(500).json({ message: "Error al listar sucursales" });
  }
};

export const obtenerSucursal = async (req: Request, res: Response) => {
  try {
    const sucursal = await service.obtenerSucursal(Number(req.params.id));
    res.json(sucursal);
  } catch (error) {
    res.status(404).json({ message: "Sucursal no encontrada" });
  }
};

export const crearSucursal = async (req: Request, res: Response) => {
  try {
    const nuevaSucursal = await service.crearSucursal(req.body);
    res.status(201).json(nuevaSucursal);
  } catch (error: any) {
    res.status(500).json({ message: "Error al crear sucursal" });
  }
};

export const actualizarSucursal = async (req: Request, res: Response) => {
  try {
    const sucursal = await service.actualizarSucursal(Number(req.params.id), req.body);
    res.json(sucursal);
  } catch (error: any) {
    res.status(404).json({ message: error.message || "Sucursal no encontrada" });
  }
};

export const eliminarSucursal = async (req: Request, res: Response) => {
  try {
    await service.eliminarSucursal(Number(req.params.id));
    res.json({ message: "Sucursal eliminada correctamente" });
  } catch (error: any) {
    if (error.message === 'No se puede eliminar la sucursal porque tiene registros asociados') {
      return res.status(409).json({ message: error.message });
    }
    res.status(404).json({ message: "Sucursal no encontrada" });
  }
};