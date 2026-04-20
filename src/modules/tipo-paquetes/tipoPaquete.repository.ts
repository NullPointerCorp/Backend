import { pool } from "../../config/database";
import { PaqueteDTO, CrearPaqueteDTO } from "./tipoPaquete.dto";
import { ResultSetHeader } from "mysql2/promise";
import { NotFoundError } from "../../errors/http-errors";

export const getAllTipoPaquetes = async (): Promise<PaqueteDTO[]> => {
  const [rows] = await pool.query(`
    SELECT tipo_paquete_id, tamanio, forma, precio
    FROM tipo_paquetes
  `);
  return rows as PaqueteDTO[];
};

export const findTipoPaqueteByID = async (id: number): Promise<PaqueteDTO | null> => {
  const [rows] = await pool.query(
    `SELECT tipo_paquete_id, tamanio, forma, precio
     FROM tipo_paquetes
     WHERE tipo_paquete_id = ?`,
    [id]
  );
  const list = rows as PaqueteDTO[];
  return list.length ? list[0] : null;
};

export const createTipoPaquete = async (data: CrearPaqueteDTO): Promise<PaqueteDTO> => {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO tipo_paquetes (tamanio, forma, precio) VALUES (?, ?, ?)`,
    [data.tamanio, data.forma, data.precio]
  );
  return await findTipoPaqueteByID(result.insertId) as PaqueteDTO;
};

export const updateTipoPaquete = async (
  id: number,
  data: Partial<CrearPaqueteDTO>
): Promise<PaqueteDTO> => {
  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE tipo_paquetes
     SET tamanio = ?, forma = ?, precio = ?
     WHERE tipo_paquete_id = ?`,
    [data.tamanio, data.forma, data.precio, id]
  );

  if (result.affectedRows === 0) {
    throw new NotFoundError("Tipo de paquete no encontrado");
  }

  return await findTipoPaqueteByID(id) as PaqueteDTO;
};

export const deleteTipoPaquete = async (id: number): Promise<void> => {
  const [result] = await pool.query<ResultSetHeader>(
    `DELETE FROM tipo_paquetes WHERE tipo_paquete_id = ?`,
    [id]
  );
  if (result.affectedRows === 0) {
    throw new NotFoundError("Tipo de paquete no encontrado");
  }
};
