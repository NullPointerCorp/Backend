import * as repo from "./envio.repository";
import { EnvioDTO, CrearEnvioDTO, EditarEnvioDTO, EnvioConsultaDTO } from "./envio.dto";
import { BadRequestError, NotFoundError } from "../../errors/http-errors";

const formatearEstadoEnvio = (estado: string): string => {
  return estado
    .split("_")
    .map((palabra) =>
      palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase()
    )
    .join(" ");
};

export const listarEnvios = async (): Promise<EnvioConsultaDTO[]> => {
  const envios = await repo.getAllEnvios();

  return envios.map((envio) => ({
    ...envio,
    estado_envio: formatearEstadoEnvio(envio.estado_envio),
  }));
};

export const listarEnviosEmpleado = async (empleado_id: number): Promise<EnvioConsultaDTO[]> => {
  const envios = await repo.getAllEnviosEmpleado(empleado_id);

  return envios.map((envio) => ({
    ...envio,
    estado_envio: formatearEstadoEnvio(envio.estado_envio),
  }));
};

export const listarEnviosSucursal = async (sucursal_id: number): Promise<EnvioConsultaDTO[]> => {
  const envios = await repo.getAllEnviosBySucursal(sucursal_id);
  return envios.map((envio) => ({
    ...envio,
    estado_envio: formatearEstadoEnvio(envio.estado_envio),
  }));
};

export const obtenerEnvio = async (envio_id: number): Promise<EnvioDTO> => {
  const envio = await repo.findEnviolById(envio_id);
  if (!envio) throw new NotFoundError("Envío no encontrado");
  return envio;
};

export const crearEnvio = async (data: CrearEnvioDTO, firebaseUid: string): Promise<EnvioDTO> => {
  const origen_id = await repo.getSucursalIdByFirebaseUid(firebaseUid);
  if (!origen_id) throw new NotFoundError("No se encontró la sucursal del empleado");
  const empleado_id = await repo.getEmpleadoIdByFirebaseUid(firebaseUid);
  if (!empleado_id) throw new NotFoundError("No se encontrÃ³ el empleado");

  if (!data.destino_id) throw new BadRequestError("La sucursal destino es obligatoria");
  if (!data.peso || Number(data.peso) <= 0) throw new BadRequestError("El peso debe ser mayor a 0");

  const viaje = await repo.findViajeDisponible(
    Number(origen_id),
    Number(data.destino_id),
    Number(data.peso),
  );

  return await repo.createEnvio({
    ...data,
    viaje_id: viaje?.viaje_id ?? null,
    empleado_id,
    sucursal_origen_id: Number(origen_id),
    sucursal_destino_id: Number(data.destino_id),
    estado_envio: viaje ? "registrado" : "en_espera",
  });
};

export const asignarEnviosEnEsperaAViaje = async (viajeId: number) => {
  const viaje = await repo.getCapacidadDisponibleViaje(viajeId);
  if (!viaje) return { asignados: 0 };

  let disponible = Number(viaje.capacidad_kg) - Number(viaje.peso_asignado);
  if (disponible <= 0) return { asignados: 0 };

  const enviosEnEspera = await repo.getEnviosEnEsperaByRuta(
    Number(viaje.sucursal_origen_id),
    Number(viaje.sucursal_destino_id),
  );

  let asignados = 0;
  for (const envio of enviosEnEspera) {
    const peso = Number(envio.peso);
    if (peso > disponible) continue;

    const asignado = await repo.asignarEnvioAViaje(envio.envio_id, viajeId);
    if (asignado) {
      disponible -= peso;
      asignados += 1;
    }
  }

  return { asignados };
};

export const actualizarEnvio = async (
  envio_id: number,
  data: EditarEnvioDTO
): Promise<EnvioDTO> => {
  return await repo.updateEnvio(envio_id, data);
};

export const cancelarEnvio = async (envio_id: number): Promise<void> => {
  const envio = await repo.findEnviolById(envio_id);
  if (!envio) throw new NotFoundError("Envío no encontrado");
  await repo.cancelarEnvio(envio_id);
};

