import { pool } from "../../config/database";
import { CrearClienteDTO } from "./cliente.dto";
import { ResultSetHeader } from 'mysql2/promise';

export const buscarCorreoExistente = async (correo: string) => {
  const [rows] = await pool.query(`SELECT * FROM clientes WHERE correo = ?`, [correo]);
  return (rows as any)[0];
}

export const getAllClientes = async () => {
  const [rows] = await pool.query(`SELECT * FROM clientes`);
  return (rows as any);
}

export const findClienteById = async (cliente_id: number) => {
  const [rows] = await pool.query(`SELECT * FROM clientes WHERE cliente_id = ?`, [cliente_id]);
  return (rows as any)[0];
};

export const createCliente = async (data: CrearClienteDTO) => {
  const existing = await buscarCorreoExistente(data.correo);
  if (existing) throw new Error("Correo ya registrado");

  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO clientes SET ?`,
    [data]
  );

  const insertId = result.insertId;

  const [rows] = await pool.query(`SELECT * FROM clientes WHERE cliente_id = ?`, [insertId]);

  return (rows as any)[0];
};

export const updateCliente = async (cliente_id: number, data: Partial<CrearClienteDTO>) => {
  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE clientes SET ? WHERE cliente_id = ?`,
    [data, cliente_id]
  );
  return result;
};

export const deleteCliente = async (cliente_id: number) => {
  try {
    const [result] = await pool.query(`DELETE FROM clientes WHERE cliente_id = ?`, [cliente_id]);
    return result;
  } catch (error: any) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      throw new Error('No se puede eliminar el cliente porque tiene registros asociados')
    }
    throw error
  }
};