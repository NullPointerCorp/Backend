import { Request, Response } from "express";
import * as service from "./cliente.service";

export const listarClientes = async (req: Request, res: Response) => {
  try {
    const clientes = await service.listarClientes();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ message: "Error al listar clientes" });
  }
};

export const obtenerCliente = async (req: Request, res: Response) => {
  try {
    const cliente = await service.obtenerCliente(Number(req.params.id));
    res.json(cliente);
  } catch (error) {
    res.status(404).json({ message: "Cliente no encontrado" });
  }
};

export const crearCliente = async (req: Request, res: Response) => {
  try {
    await service.crearCliente(req.body);
    res.status(201).json({ message: "Cliente creado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al crear cliente" });
  }
};

export const actualizarCliente = async (req: Request, res: Response) => {
  try {
    await service.actualizarCliente(Number(req.params.id), req.body);
    res.json({ message: "Cliente actualizado correctamente" });
  } catch (error) {
    res.status(404).json({ message: "Cliente no encontrado" });
  }
};

export const eliminarCliente = async (req: Request, res: Response) => {
  try {
    await service.eliminarCliente(Number(req.params.id));
    res.json({ message: "Cliente eliminado correctamente" });
  } catch (error) {
    res.status(404).json({ message: "Cliente no encontrado" });
  }
};
