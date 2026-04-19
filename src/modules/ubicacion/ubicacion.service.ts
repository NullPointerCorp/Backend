import * as repo from "./ubicacion.repository";

export const listarEstados = async () => {
  return await repo.getAllEstados();
};

export const listarCiudadesPorEstado = async (estado_id: number) => {
  return await repo.getCiudadesByEstado(estado_id);
};
