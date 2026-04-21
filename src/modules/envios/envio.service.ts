import * as repo from "./envio.repository";
import { EnvioDTO, CrearEnvioDTO, EditarEnvioDTO, EnvioConsultaDTO } from "./envio.dto";
import { NotFoundError } from "../../errors/http-errors";

export const listarEnvios = async (): Promise<EnvioConsultaDTO[]> => {
  return await repo.getAllEnvios();
};

export const obtenerEnvio = async (envio_id: number): Promise<EnvioDTO> => {
  const envio = await repo.findEnviolById(envio_id);
  if (!envio) throw new NotFoundError("Envío no encontrado");
  return envio;
};

export const crearEnvio = async (data: CrearEnvioDTO): Promise<EnvioDTO> => {
  return await repo.createEnvio(data);
};

export const actualizarEnvio = async (
  envio_id: number,
  data: EditarEnvioDTO
): Promise<EnvioDTO> => {
  return await repo.updateEnvio(envio_id, data);
};
