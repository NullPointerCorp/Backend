import { pool } from "../../config/database";
import { ClienteDTO, CrearClienteDTO } from "./cliente.dto";
import { ResultSetHeader } from "mysql2/promise";
import { NotFoundError } from "../../errors/http-errors";

export const buscarCorreoExistente = async (correo: string): Promise<ClienteDTO | null> => {
  const [rows] = await pool.query(
    `SELECT cliente_id FROM clientes WHERE correo = ?`,
    [correo]
  );
  const list = rows as ClienteDTO[];
  return list.length ? list[0] : null;
};

export const getAllClientes = async (): Promise<ClienteDTO[]> => {
  const [rows] = await pool.query(`SELECT * FROM clientes`);
  return rows as ClienteDTO[];
};

export const findClienteById = async (cliente_id: number): Promise<ClienteDTO | null> => {
  const [rows] = await pool.query(
    `SELECT * FROM clientes WHERE cliente_id = ?`,
    [cliente_id]
  );
  const list = rows as ClienteDTO[];
  return list.length ? list[0] : null;
};

export const findClienteByCorreo = async (correo: string): Promise<ClienteDTO | null> => {
  const [rows] = await pool.query(
    `SELECT * FROM clientes WHERE correo = ?`,
    [correo]
  );
  const list = rows as ClienteDTO[];
  return list.length ? list[0] : null;
};

export const createCliente = async (data: CrearClienteDTO): Promise<ClienteDTO> => {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO clientes (nombre, apellido_paterno, apellido_materno, correo, telefono) 
     VALUES (?, ?, ?, ?, ?)`,
    [
      data.nombre,
      data.apellido_paterno,
      data.apellido_materno ?? null,
      data.correo,
      data.telefono ?? null,
    ]
  );
  return await findClienteById(result.insertId) as ClienteDTO;
};

export const updateCliente = async (
  cliente_id: number,
  data: Partial<CrearClienteDTO>
): Promise<ClienteDTO> => {
  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE clientes 
     SET nombre = ?, apellido_paterno = ?, apellido_materno = ?, telefono = ? 
     WHERE cliente_id = ?`,
    [
      data.nombre,
      data.apellido_paterno,
      data.apellido_materno ?? null,
      data.telefono ?? null,
      cliente_id,
    ]
  );

  if (result.affectedRows === 0) {
    throw new NotFoundError("Cliente no encontrado");
  }

  return await findClienteById(cliente_id) as ClienteDTO;
};

export const deleteCliente = async (cliente_id: number): Promise<void> => {
  const [result] = await pool.query<ResultSetHeader>(
    `DELETE FROM clientes WHERE cliente_id = ?`,
    [cliente_id]
  );
  if (result.affectedRows === 0) {
    throw new NotFoundError("Cliente no encontrado");
  }
};
