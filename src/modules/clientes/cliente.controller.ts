import { Request, Response } from "express";
import * as service from "./cliente.service";
import { crearClienteSchema, actualizarClienteSchema } from "./cliente.schema";
import { BadRequestError, NotFoundError } from "../../errors/http-errors";

const parseErrors = (issues: any[]) =>
  issues.reduce((acc: Record<string, string>, issue: any) => {
    acc[issue.path.join(".")] = issue.message;
    return acc;
  }, {});

export const listarClientes = async (req: Request, res: Response) => {
  return res.json(await service.listarClientes());
};

export const obtenerCliente = async (req: Request, res: Response) => {
  return res.json(await service.obtenerCliente(Number(req.params.id)));
};

export const crearCliente = async (req: Request, res: Response) => {
  const result = crearClienteSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Datos inválidos",
      errors: parseErrors(result.error.issues),
    });
  }
  return res.status(201).json(await service.crearCliente(result.data));
};

export const actualizarCliente = async (req: Request, res: Response) => {
  const result = actualizarClienteSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Datos inválidos",
      errors: parseErrors(result.error.issues),
    });
  }
  return res.json(await service.actualizarCliente(Number(req.params.id), result.data));
};

export const eliminarCliente = async (req: Request, res: Response) => {
  await service.eliminarCliente(Number(req.params.id));
  return res.json({ message: "Cliente eliminado correctamente" });
};

export const buscarPorCorreo = async (req: Request, res: Response) => {
  const cliente = await service.buscarClientePorCorreo(String(req.params.correo));
  if (!cliente) throw new NotFoundError("Cliente no encontrado");
  return res.json(cliente);
};
