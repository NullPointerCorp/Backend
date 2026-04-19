import { Request, Response } from "express";
import {
  getAllEmpleados,
  getEmpleadoById,
  getRolesCatalogo,
  getSucursalesCatalogo,
  getSupervisores,
  getTransportistas,
} from "./empleado.repository";
import {
  crearEmpleadoService,
  editarEmpleadoService,
  eliminarEmpleadoService,
} from "./empleado.service";
import { NotFoundError, BadRequestError } from "../../errors/http-errors";

export const listarEmpleados = async (req: Request, res: Response) => {
  const empleados = await getAllEmpleados();
  return res.json(empleados);
};

export const obtenerEmpleado = async (req: Request, res: Response) => {
  const empleado = await getEmpleadoById(Number(req.params.id));
  if (!empleado) throw new NotFoundError("Empleado no encontrado");
  return res.json(empleado);
};

export const listarRoles = async (req: Request, res: Response) => {
  return res.json(await getRolesCatalogo());
};

export const listarSucursalesCatalogo = async (req: Request, res: Response) => {
  return res.json(await getSucursalesCatalogo());
};

export const listarSupervisores = async (req: Request, res: Response) => {
  return res.json(await getSupervisores());
};

export const listarTransportistas = async (req: Request, res: Response) => {
  return res.json(await getTransportistas());
};

export const crearEmpleado = async (req: Request, res: Response) => {
  const { estado_id, ...body } = req.body ?? {};
  const result = await crearEmpleadoService(body);
  return res.status(201).json(result);
};

export const editarEmpleado = async (req: Request, res: Response) => {
  const empleadoId = Number(req.params.id);
  if (!empleadoId) throw new BadRequestError("ID inválido");

  const { estado_id, ...body } = req.body ?? {};
  const result = await editarEmpleadoService(empleadoId, body);
  return res.json(result);
};

export const eliminarEmpleado = async (req: Request, res: Response) => {
  const empleadoId = Number(req.params.id);
  if (!empleadoId) throw new BadRequestError("ID inválido");

  const result = await eliminarEmpleadoService(empleadoId);
  return res.json(result);
};
