import * as repo from "./rol.repository";
import { RolDTO, CrearRolDTO, EditarRolDTO } from "./rol.dto";

export const listarRoles = async (): Promise<RolDTO[]> => {
  return await repo.getAllRoles();
};

export const obtenerRol = async (rol_id: number): Promise<RolDTO> => {
  const rol = await repo.findRolById(rol_id);
  if (!rol) throw new Error("Rol no encontrado");
  return rol;
};

export const crearRol = async (data: CrearRolDTO): Promise<RolDTO> => {
  return await repo.createRol(data);
};

export const actualizarRol = async (rol_id: number, data: EditarRolDTO): Promise<RolDTO> => {
  return await repo.updateRol(rol_id, data);
};

export const eliminarRol = async (rol_id: number): Promise<void> => {
  await repo.deleteRol(rol_id);
};
