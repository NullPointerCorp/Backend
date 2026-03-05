import { Request, Response } from "express";
import * as service from "./cliente.service";

export const listarClientes = async (req: Request, res: Response) => {
  try {
    const clientes = await service.listarClientes();
    return res.json(clientes);
  } catch (error) {
    return res.status(500).json({ message: "Error al listar clientes" });
  }
};

export const obtenerCliente = async (req: Request, res: Response) => {
  try {
    const cliente = await service.obtenerCliente(Number(req.params.id));
    return res.json(cliente);
  } catch (error: any) {
    if (error.message === "Cliente no encontrado") {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: "Error interno" });
  }
};

export const crearCliente = async (req: Request, res: Response) => {
  try {
    const nuevoCliente = await service.crearCliente(req.body);
    return res.status(201).json(nuevoCliente);
  } catch (error: any) {
    if (error.message === "Correo ya registrado") {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Error al crear cliente" });
  }
};

export const actualizarCliente = async (req: Request, res: Response) => {
  try {
    const cliente = await service.actualizarCliente(Number(req.params.id), req.body);
    return res.json(cliente);
  } catch (error: any) {
    if (error.message === "Cliente no encontrado") {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: "Error interno" });
  }
};

export const eliminarCliente = async (req: Request, res: Response) => {
  try {
    await service.eliminarCliente(Number(req.params.id));
    return res.json({ message: "Cliente eliminado correctamente" });
  } catch (error: any) {
    if (error.message === 'No se puede eliminar el cliente porque tiene registros asociados') {
      return res.status(409).json({ message: error.message });
    }
    return res.status(404).json({ message: "Cliente no encontrado" });
  }
};