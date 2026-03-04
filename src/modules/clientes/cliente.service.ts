import * as repo from "./cliente.repository";
import { CrearClienteDTO } from "./cliente.dto";

export const listarClientes = async () => {
  return await repo.getAllClientes();
};

export const obtenerCliente = async (cliente_id: number) => {
  const cliente = await repo.findClienteById(cliente_id);
  if (!cliente) throw new Error("Cliente no encontrado");
  return cliente;
};

export const crearCliente = async (data: CrearClienteDTO) => {
  return await repo.createCliente(data);
};

export const actualizarCliente = async (cliente_id: number, data: Partial<CrearClienteDTO>) => {
  const result: any = await repo.updateCliente(cliente_id, data);
  if ((result.affectedRows ?? 0) === 0) throw new Error("Cliente no encontrado");
  return true;
};

export const eliminarCliente = async (cliente_id: number) => {
  return await repo.deleteCliente(cliente_id);
};