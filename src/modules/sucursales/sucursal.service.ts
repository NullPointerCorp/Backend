import * as repo from "./sucursal.repository";
import { CrearSucursalDTO, ActualizarSucursalDTO } from "./sucursal.dto";

export const listarSucursales = async () => {
  return await repo.getAllSucursales();
};

export const obtenerSucursal = async (sucursal_id: number) => {
  const sucursal = await repo.findSucursalById(sucursal_id);
  if (!sucursal) throw new Error("Sucursal no encontrada");
  return sucursal;
};

export const crearSucursal = async (data: CrearSucursalDTO) => {
  return await repo.createSucursal(data);
};

export const actualizarSucursal = async (sucursal_id: number, data: ActualizarSucursalDTO) => {
  return await repo.updateSucursal(sucursal_id, data);
};

export const eliminarSucursal = async (sucursal_id: number) => {
  return await repo.deleteSucursal(sucursal_id);
};

export const getSucursalesByCiudad = async (ciudad_id: number) => {
  return await repo.getSucursalesByCiudad(ciudad_id);
};