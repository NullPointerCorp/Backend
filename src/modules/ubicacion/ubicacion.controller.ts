import { Request, Response } from "express";
import { getAllEstados, getCiudadesByEstado } from "./ubicacion.repository";

export const listarEstados = async (req: Request, res: Response) => {
  try {
    const estados = await getAllEstados();
    res.json(estados);
  } catch (error) {
    res.status(500).json({ message: "Error al listar estados" });
  }
};

export const listarCiudadesPorEstado = async (req: Request, res: Response) => {
  try {
    const ciudades = await getCiudadesByEstado(Number(req.params.estado_id));
    res.json(ciudades);
  } catch (error) {
    res.status(500).json({ message: "Error al listar ciudades" });
  }
};