import * as repo from "./tipoPaquete.repository";
import { PaqueteDTO, CrearPaqueteDTO } from "./tipoPaquete.dto";

export const listarPaquetes = async (): Promise<PaqueteDTO[]> => {
  return await repo.getAllTipoPaquetes();
};

export const obtenerTipoPaquete = async (folio: number): Promise<PaqueteDTO> => {
  const paquete = await repo.findTipoPaqueteByFolio(folio);
  if (!paquete) throw new Error("Paquete no encontrado");
  return paquete;
};

export const crearTipoPaquete = async (data: CrearPaqueteDTO): Promise<PaqueteDTO> => {
  return await repo.createTipoPaquete(data);
};

export const actualizarTipoPaquete = async (folio: number, data: Partial<CrearPaqueteDTO>): Promise<PaqueteDTO> => {
  return await repo.updateTipoPaquete(folio, data);
};

export const eliminarTipoPaquete = async (folio: number): Promise<void> => {
  await repo.deleteTipoPaquete(folio);
};
