import * as repo from "./almacen.repository";
import { AlmacenDTO, CrearAlmacenDTO } from "./almacen.dto";

export const listarAlmacenes = async (): Promise<AlmacenDTO[]> => {
  return await repo.getAllAlmacenes();
};

export const obtenerAlmacen = async (almacen_id: number): Promise<AlmacenDTO> => {
  const almacen = await repo.findAlmacenById(almacen_id);
  if (!almacen) throw new Error("Almacén no encontrado");
  return almacen;
};

export const crearAlmacen = async (data: CrearAlmacenDTO): Promise<AlmacenDTO> => {
  return await repo.createAlmacen(data);
};

export const actualizarAlmacen = async (almacen_id: number, data: Partial<CrearAlmacenDTO>): Promise<AlmacenDTO> => {
  return await repo.updateAlmacen(almacen_id, data);
};

export const eliminarAlmacen = async (almacen_id: number): Promise<void> => {
  await repo.deleteAlmacen(almacen_id);
};
