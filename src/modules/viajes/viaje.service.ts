import { BadRequestError, ForbiddenError, NotFoundError } from "../../errors/http-errors";
import { CrearViajeDTO, TipoFiltroViaje } from "./viaje.dto";
import { asignarEnviosEnEsperaAViaje } from "../envios/envio.service";
import * as repo from "./viaje.repository";

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

export const crearViaje = async (firebaseUid: string, data: CrearViajeDTO) => {
  const actor = await getActor(firebaseUid);

  if (!data.numero_serie) throw new BadRequestError("El transporte es obligatorio");
  if (!data.sucursal_destino_id) throw new BadRequestError("La sucursal destino es obligatoria");
  if (!data.fecha_salida) throw new BadRequestError("La fecha de salida es obligatoria");

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

  const viaje = await repo.createViaje(data, sucursalOrigenId);
  if (!viaje) throw new NotFoundError("Viaje no encontrado");
  await asignarEnviosEnEsperaAViaje(viaje.viaje_id);
  return viaje;
};
