import * as repo from "./transporte.repository";
import { CrearTransporteDTO, ActualizarTransporteDTO } from "./transporte.dto";
import { NotFoundError } from "../../errors/http-errors";

export const listarTransportes = async () => {
  return await repo.getAllTransportes();
};

export const obtenerTransporte = async (numero_serie: string) => {
  const transporte = await repo.findTransporteByNumeroSerie(numero_serie);
  if (!transporte) throw new NotFoundError("Transporte no encontrado");
  return transporte;
};

export const crearTransporte = async (data: CrearTransporteDTO) => {
  return await repo.createTransporte(data);
};

export const actualizarTransporte = async (
  numero_serie: string,
  data: ActualizarTransporteDTO
) => {
  return await repo.updateTransporte(numero_serie, data);
};

export const eliminarTransporte = async (numero_serie: string) => {
  return await repo.deleteTransporte(numero_serie);
};

export const listarTipos = async () => {
  return await repo.getAllTiposTransporte();
};

export const listarSubtipos = async () => {
  return await repo.getAllSubtiposTransporte();
};
