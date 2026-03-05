import * as repo from "./cliente.repository";
import { ClienteDTO, CrearClienteDTO } from "./cliente.dto";

export const listarClientes = async (): Promise<ClienteDTO[]> => {
  return await repo.getAllClientes();
};

export const obtenerCliente = async (cliente_id: number): Promise<ClienteDTO> => {
  const cliente = await repo.findClienteById(cliente_id);
  if (!cliente) throw new Error("Cliente no encontrado");
  return cliente;
};

export const crearCliente = async (data: CrearClienteDTO): Promise<ClienteDTO> => {
  const existente = await repo.buscarCorreoExistente(data.correo);
  if (existente) throw new Error("Correo ya registrado");
  return await repo.createCliente(data);
};

export const actualizarCliente = async (cliente_id: number, data: Partial<CrearClienteDTO>): Promise<ClienteDTO> => {
  return await repo.updateCliente(cliente_id, data);
};

export const eliminarCliente = async (cliente_id: number): Promise<void> => {
  await repo.deleteCliente(cliente_id);
};

export const buscarClientePorCorreo = async (correo: string): Promise<ClienteDTO | null> => {
  return await repo.findClienteByCorreo(correo);
};