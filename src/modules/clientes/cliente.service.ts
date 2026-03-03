import * as repo from "./cliente.repository";
import { CrearClienteDTO } from "./cliente.dto";

export const listarClientes = async() => {
  const clientes = await repo.getAllClientes();
  if (!clientes) throw new Error("Sin clientes registrados");
  return clientes;
}

export const obtenerCliente = async (id: number) => {
  const cliente = await repo.findClienteById(id);
  if (!cliente) throw new Error("Cliente no encontrado");
  return cliente;
};

export const crearCliente = async (data: CrearClienteDTO) => {
  return await repo.createCliente(data);
};

export const actualizarCliente = async (id: number, data: Partial<CrearClienteDTO>) => {
  return await repo.updateCliente(id, data);
};

export const eliminarCliente = async (id: number) => {
  return await repo.deleteCliente(id);
};