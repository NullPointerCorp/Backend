import { Request, Response } from "express";
import * as service from "./cliente.service";
import { crearClienteSchema, actualizarClienteSchema } from "./cliente.schema";

const parseErrors = (issues: any[]) =>
  issues.reduce((acc: Record<string, string>, issue: any) => {
    acc[issue.path.join(".")] = issue.message;
    return acc;
  }, {});

export const listarClientes = async (req: Request, res: Response) => {
  try {
    return res.json(await service.listarClientes());
  } catch (error) {
    return res.status(500).json({ message: "Error al listar clientes" });
  }
};

export const obtenerCliente = async (req: Request, res: Response) => {
  try {
    return res.json(await service.obtenerCliente(Number(req.params.id)));
  } catch (error: any) {
    if (error.message === "Cliente no encontrado") {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: "Error interno" });
  }
};

export const crearCliente = async (req: Request, res: Response) => {
  const result = crearClienteSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: "Datos inválidos", errors: parseErrors(result.error.issues) });
  }
  try {
    return res.status(201).json(await service.crearCliente(result.data));
  } catch (error: any) {
    if (error.message === "Correo ya registrado") {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Error al crear cliente" });
  }
};

export const actualizarCliente = async (req: Request, res: Response) => {
  const result = actualizarClienteSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: "Datos inválidos", errors: parseErrors(result.error.issues) });
  }
  try {
    return res.json(await service.actualizarCliente(Number(req.params.id), result.data));
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
    if (error.message === "No se puede eliminar el cliente porque tiene registros asociados") {
      return res.status(409).json({ message: error.message });
    }
    return res.status(404).json({ message: "Cliente no encontrado" });
  }
};

export const buscarPorCorreo = async (req: Request, res: Response) => {
  try {
    const cliente = await service.buscarClientePorCorreo(String(req.query.correo));
    if (!cliente) return res.status(404).json({ message: "Cliente no encontrado" });
    return res.json(cliente);
  } catch (error) {
    return res.status(500).json({ message: "Error interno" });
  }
};
