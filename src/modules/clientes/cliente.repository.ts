import { pool } from "../../config/database";
import { ClienteDTO, CrearClienteDTO } from "./cliente.dto";
import { ResultSetHeader } from 'mysql2/promise';

export const buscarCorreoExistente = async (correo: string): Promise<ClienteDTO | null> => {
  const [rows] = await pool.query(`SELECT cliente_id FROM clientes WHERE correo = ?`, [correo]);
  const list = rows as ClienteDTO[];
  return list.length ? list[0] : null;
}

export const getAllClientes = async (): Promise<ClienteDTO[]> => {
  const [rows] = await pool.query(`SELECT * FROM clientes`);
  return rows as ClienteDTO[];
}

export const findClienteById = async (cliente_id: number): Promise<ClienteDTO | null> => {
  const [rows] = await pool.query(`SELECT * FROM clientes WHERE cliente_id = ?`, [cliente_id]);
  const list = rows as ClienteDTO[];
  return list.length ? list[0] : null;
};

export const createCliente = async (data: CrearClienteDTO): Promise<ClienteDTO> => {
  const [result] = await pool.query<ResultSetHeader>(`INSERT INTO clientes SET ?`, [data]);
  return await findClienteById(result.insertId) as ClienteDTO;
};

export const updateCliente = async (cliente_id: number, data: Partial<CrearClienteDTO>): Promise<ClienteDTO> => {
  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE clientes SET ? WHERE cliente_id = ?`, [data, cliente_id]
  );
  if ((result as any).affectedRows === 0) throw new Error("Cliente no encontrado");
  return await findClienteById(cliente_id) as ClienteDTO;
};

export const deleteCliente = async (cliente_id: number): Promise<void> => {
  try {
    await pool.query(`DELETE FROM clientes WHERE cliente_id = ?`, [cliente_id]);
  } catch (error: any) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      throw new Error('No se puede eliminar el cliente porque tiene registros asociados');
    }
    throw error;
  }
};

export const findClienteByCorreo = async (correo: string): Promise<ClienteDTO | null> => {
  const [rows] = await pool.query(
    `SELECT * FROM clientes WHERE correo = ?`, [correo]
  );
  const list = rows as ClienteDTO[];
  return list.length ? list[0] : null;
};