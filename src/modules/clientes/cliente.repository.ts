import { pool } from "../../config/database";
import { ClienteDTO, CrearClienteDTO } from "./cliente.dto";
import { ResultSetHeader } from 'mysql2/promise';

export const buscarCorreoExistente = async (correo: string): Promise<ClienteDTO | null> => {
  try {
    const [rows] = await pool.query(
      `SELECT cliente_id FROM clientes WHERE correo = ?`,
      [correo]
    );
    const list = rows as ClienteDTO[];
    return list.length ? list[0] : null;
  } catch (error: any) {
    console.error("Error al buscar correo existente:", error);
    throw new Error("Error al verificar el correo");
  }
};

export const getAllClientes = async (): Promise<ClienteDTO[]> => {
  try {
    const [rows] = await pool.query(`SELECT * FROM clientes`);
    return rows as ClienteDTO[];
  } catch (error: any) {
    console.error("Error al obtener clientes:", error);
    throw new Error("Error al obtener la lista de clientes");
  }
};

export const findClienteById = async (cliente_id: number): Promise<ClienteDTO | null> => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM clientes WHERE cliente_id = ?`,
      [cliente_id]
    );
    const list = rows as ClienteDTO[];
    return list.length ? list[0] : null;
  } catch (error: any) {
    console.error("Error al buscar cliente por ID:", error);
    throw new Error("Error al buscar el cliente");
  }
};

export const findClienteByCorreo = async (correo: string): Promise<ClienteDTO | null> => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM clientes WHERE correo = ?`,
      [correo]
    );
    const list = rows as ClienteDTO[];
    return list.length ? list[0] : null;
  } catch (error: any) {
    console.error("Error al buscar cliente por correo:", error);
    throw new Error("Error al buscar el cliente");
  }
};

export const createCliente = async (data: CrearClienteDTO): Promise<ClienteDTO> => {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO clientes (nombre, apellido_paterno, apellido_materno, correo, telefono) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        data.nombre,
        data.apellido_paterno,
        data.apellido_materno ?? null,
        data.correo,
        data.telefono ?? null
      ]
    );
    return await findClienteById(result.insertId) as ClienteDTO;
  } catch (error: any) {
    console.error("Error al crear cliente:", error);
    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error("Ya existe un cliente con ese correo");
    }
    throw new Error("Error al crear el cliente");
  }
};

export const updateCliente = async (
  cliente_id: number,
  data: Partial<CrearClienteDTO>
): Promise<ClienteDTO> => {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE clientes 
       SET nombre = ?, apellido_paterno = ?, apellido_materno = ?, telefono = ? 
       WHERE cliente_id = ?`,
      [
        data.nombre,
        data.apellido_paterno,
        data.apellido_materno ?? null,
        data.telefono ?? null,
        cliente_id
      ]
    );

    if (result.affectedRows === 0) throw new Error("Cliente no encontrado");

    return await findClienteById(cliente_id) as ClienteDTO;
  } catch (error: any) {
    if (error.message === "Cliente no encontrado") throw error;
    console.error("Error al actualizar cliente:", error);
    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error("Ya existe un cliente con ese correo");
    }
    throw new Error("Error al actualizar el cliente");
  }
};

export const deleteCliente = async (cliente_id: number): Promise<void> => {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      `DELETE FROM clientes WHERE cliente_id = ?`,
      [cliente_id]
    );
    if (result.affectedRows === 0) throw new Error("Cliente no encontrado");
  } catch (error: any) {
    if (error.message === "Cliente no encontrado") throw error;
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      throw new Error("No se puede eliminar el cliente porque tiene registros asociados");
    }
    console.error("Error al eliminar cliente:", error);
    throw new Error("Error al eliminar el cliente");
  }
};
