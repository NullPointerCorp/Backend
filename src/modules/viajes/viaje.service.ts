import { BadRequestError, ForbiddenError, NotFoundError } from "../../errors/http-errors";
import { ActualizarViajeDTO, CrearViajeDTO, TipoFiltroViaje } from "./viaje.dto";
import { asignarEnviosEnEsperaAViaje } from "../envios/envio.service";
import * as repo from "./viaje.repository";
import * as envioRepo from "../envios/envio.repository";

const normalizeRole = (rol: string) => rol.trim().toLowerCase();

const getActor = async (firebaseUid: string) => {
  const actor = await repo.findEmpleadoContextByFirebaseUid(firebaseUid);
  if (!actor) throw new ForbiddenError("Empleado no autorizado");
  if (!actor.sucursal_id) throw new BadRequestError("El usuario no tiene sucursal asignada");

  const rol = normalizeRole(actor.rol);
  if (rol !== "administrador" && rol !== "supervisor") {
    throw new ForbiddenError("No tienes permisos para acceder a viajes");
  }

  return { ...actor, rol };
};

export const listarViajes = async (firebaseUid: string, tipo: TipoFiltroViaje) => {
  const actor = await getActor(firebaseUid);

  if (actor.rol === "administrador" && tipo == "todos") {
    return await repo.getAllViajes();
  }

  return await repo.getViajesBySucursal(Number(actor.sucursal_id), tipo);
};

export const obtenerCatalogos = async (firebaseUid: string) => {
  const actor = await getActor(firebaseUid);
  const sucursalId = Number(actor.sucursal_id);

  const [destinos, transportes] = await Promise.all([
    repo.getSucursalesDestino(sucursalId),
    repo.getTransportesBySucursal(sucursalId),
  ]);

  return {
    origen: {
      sucursal_id: sucursalId,
      nombre_sucursal: actor.nombre_sucursal,
    },
    destinos,
    transportes,
  };
};

export const obtenerTransportesDisponibles = async (
  firebaseUid: string,
  fechaSalida: string,
  fechaLlegada: string,
  excluirViajeId?: number
) => {
  const actor = await getActor(firebaseUid);
  return await repo.getTransportesDisponibles(
    Number(actor.sucursal_id),
    fechaSalida,
    fechaLlegada,
    excluirViajeId
  );
};

export const crearViaje = async (firebaseUid: string, data: CrearViajeDTO) => {
  const actor = await getActor(firebaseUid);

  if (!data.numero_serie) throw new BadRequestError("El transporte es obligatorio");
  if (!data.sucursal_destino_id) throw new BadRequestError("La sucursal destino es obligatoria");
  if (!data.fecha_salida) throw new BadRequestError("La fecha de salida es obligatoria");
  if (!data.fecha_llegada) throw new BadRequestError("La fecha de llegada es obligatoria");

  const salida = new Date(data.fecha_salida);
  const llegada = new Date(data.fecha_llegada);
  if (salida < new Date()) throw new BadRequestError("La fecha de salida no puede ser en el pasado");
  if (llegada <= salida) throw new BadRequestError("La fecha de llegada debe ser posterior a la fecha de salida");

  const sucursalOrigenId = Number(actor.sucursal_id);
  if (Number(data.sucursal_destino_id) === sucursalOrigenId) {
    throw new BadRequestError("El destino debe ser distinto al origen");
  }

  const transportes = await repo.getTransportesBySucursal(sucursalOrigenId);
  const transportePerteneceSucursal = transportes.some(
    (t) => t.numero_serie === data.numero_serie
  );

  if (!transportePerteneceSucursal) {
    throw new ForbiddenError("El transporte no pertenece a tu sucursal");
  }

  const traslapado = await repo.findViajeTranslapado(data.numero_serie, data.fecha_salida, data.fecha_llegada);
  if (traslapado) {
    throw new BadRequestError("El transporte ya tiene un viaje programado en ese rango de fechas");
  }

  const viaje = await repo.createViaje(data, sucursalOrigenId);
  if (!viaje) throw new NotFoundError("Viaje no encontrado");
  await asignarEnviosEnEsperaAViaje(viaje.viaje_id);
  return viaje;
};

export const actualizarViaje = async (firebaseUid: string, viajeId: number, data: ActualizarViajeDTO) => {
  const actor = await getActor(firebaseUid);

  const viaje = await repo.findViajeById(viajeId);
  if (!viaje) throw new NotFoundError("Viaje no encontrado");

  if (actor.rol === "supervisor" && viaje.sucursal_origen_id !== Number(actor.sucursal_id)) {
    throw new ForbiddenError("No tienes permiso para editar este viaje");
  }

  if (!data.numero_serie) throw new BadRequestError("El transporte es obligatorio");
  if (!data.fecha_salida) throw new BadRequestError("La fecha de salida es obligatoria");
  if (!data.fecha_llegada) throw new BadRequestError("La fecha de llegada es obligatoria");

  const transportes = await repo.getTransportesBySucursal(Number(viaje.sucursal_origen_id));
  if (!transportes.some((t) => t.numero_serie === data.numero_serie)) {
    throw new BadRequestError("El transporte no pertenece a la sucursal de origen del viaje");
  }

  const salida = new Date(data.fecha_salida);
  const llegada = new Date(data.fecha_llegada);
  if (salida < new Date()) throw new BadRequestError("La fecha de salida no puede ser en el pasado");
  if (llegada <= salida) {
    throw new BadRequestError("La fecha de llegada debe ser posterior a la fecha de salida");
  }

  const traslapado = await repo.findViajeTranslapado(data.numero_serie, data.fecha_salida, data.fecha_llegada, viajeId);
  if (traslapado) {
    throw new BadRequestError("El transporte ya tiene un viaje programado en ese rango de fechas");
  }

  return await repo.updateViaje(viajeId, data);
};

export const cancelarViaje = async (firebaseUid: string, viajeId: number) => {
  const actor = await getActor(firebaseUid);

  const viaje = await repo.findViajeById(viajeId);
  if (!viaje) throw new NotFoundError("Viaje no encontrado");

  if (actor.rol === "supervisor" && viaje.sucursal_origen_id !== Number(actor.sucursal_id)) {
    throw new ForbiddenError("No tienes permiso para cancelar este viaje");
  }

  if (viaje.estado !== "programado") {
    throw new BadRequestError("Solo se pueden cancelar viajes en estado 'programado'");
  }

  await envioRepo.liberarEnviosDeViaje(viajeId);
  return await repo.updateViajeEstado(viajeId, "cancelado");
};

// Endpoints para la app móvil del transportista
export const iniciarViaje = async (viajeId: number) => {
  const viaje = await repo.findViajeById(viajeId);
  if (!viaje) throw new NotFoundError("Viaje no encontrado");
  if (viaje.estado !== "programado") throw new BadRequestError("El viaje no está en estado 'programado'");
  await envioRepo.updateEnviosByViajeId(viajeId, "registrado", "en_camino");
  return await repo.updateViajeEstado(viajeId, "en_camino");
};

export const finalizarViaje = async (viajeId: number) => {
  const viaje = await repo.findViajeById(viajeId);
  if (!viaje) throw new NotFoundError("Viaje no encontrado");
  if (viaje.estado !== "en_camino") throw new BadRequestError("El viaje no está en estado 'en_camino'");
  await envioRepo.updateEnviosByViajeId(viajeId, "en_camino", "entregado");
  return await repo.updateViajeEstado(viajeId, "entregado");
};

export const iniciarRegreso = async (viajeId: number) => {
  const viaje = await repo.findViajeById(viajeId);
  if (!viaje) throw new NotFoundError("Viaje no encontrado");
  if (viaje.estado !== "entregado") throw new BadRequestError("El viaje no está en estado 'entregado'");
  return await repo.updateViajeEstado(viajeId, "regresando");
};

export const confirmarRegreso = async (viajeId: number) => {
  const viaje = await repo.findViajeById(viajeId);
  if (!viaje) throw new NotFoundError("Viaje no encontrado");
  if (viaje.estado !== "regresando") throw new BadRequestError("El viaje no está en estado 'regresando'");
  return await repo.updateViajeEstado(viajeId, "finalizado");
};
