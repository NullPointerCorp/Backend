import { Request, Response } from "express";
import {
  getAllEmpleados,
  getEmpleadoById,
  getEmpleadosBySucursalId,
  getRolesCatalogo,
  getSucursalesCatalogo,
  getSupervisores,
  getTransportistas,
  getTransportistasBySupervisorUid,
  findEmpleadoByFirebaseUid,
} from "./empleado.repository";
import {
  crearEmpleadoService,
  editarEmpleadoService,
  eliminarEmpleadoService,
} from "./empleado.service";
import { NotFoundError, BadRequestError, ForbiddenError } from "../../errors/http-errors";

export const listarEmpleados = async (req: Request, res: Response) => {
  const firebaseUid = (req as any).firebaseUid;
  const caller = await findEmpleadoByFirebaseUid(firebaseUid);
  if (!caller) throw new ForbiddenError("No autorizado");

  if (caller.rol?.toLowerCase() === "jefe") {
    return res.json(await getAllEmpleados());
  }

  if (!caller.sucursal_id) return res.json([]);

  return res.json(await getEmpleadosBySucursalId(caller.sucursal_id));
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

export const listarTransportistasSucursalActual = async (req: Request, res: Response) => {
  const firebaseUid = (req as any).firebaseUid;
  return res.json(await getTransportistasBySupervisorUid(firebaseUid));
};

export const crearEmpleado = async (req: Request, res: Response) => {
  const firebaseUid = (req as any).firebaseUid;
  const { estado_id, ...body } = req.body ?? {};
  const result = await crearEmpleadoService(body, firebaseUid);
  return res.status(201).json(result);
};

export const editarEmpleado = async (req: Request, res: Response) => {
  const empleadoId = Number(req.params.id);
  if (!empleadoId) throw new BadRequestError("ID inválido");

  const firebaseUid = (req as any).firebaseUid;
  const { estado_id, ...body } = req.body ?? {};
  const result = await editarEmpleadoService(empleadoId, body, firebaseUid);
  return res.json(result);
};

export const eliminarEmpleado = async (req: Request, res: Response) => {
  const empleadoId = Number(req.params.id);
  if (!empleadoId) throw new BadRequestError("ID inválido");

  const firebaseUid = (req as any).firebaseUid;
  const result = await eliminarEmpleadoService(empleadoId, firebaseUid);
  return res.json(result);
};
