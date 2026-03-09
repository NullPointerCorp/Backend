import * as repo from "./paquete.repository";
import { PaqueteDTO, CrearPaqueteDTO } from "./paquete.dto";

export const listarPaquetes = async (): Promise<PaqueteDTO[]> => {
  return await repo.getAllPaquetes();
};

export const obtenerPaquete = async (folio: number): Promise<PaqueteDTO> => {
  const paquete = await repo.findPaqueteByFolio(folio);
  if (!paquete) throw new Error("Paquete no encontrado");
  return paquete;
};

export const crearPaquete = async (data: CrearPaqueteDTO): Promise<PaqueteDTO> => {
  return await repo.createPaquete(data);
};

export const actualizarPaquete = async (folio: number, data: Partial<CrearPaqueteDTO>): Promise<PaqueteDTO> => {
  return await repo.updatePaquete(folio, data);
};

export const eliminarPaquete = async (folio: number): Promise<void> => {
  await repo.deletePaquete(folio);
};