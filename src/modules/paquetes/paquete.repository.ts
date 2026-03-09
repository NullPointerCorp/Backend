import { pool } from "../../config/database";
import { PaqueteDTO, CrearPaqueteDTO } from "./paquete.dto";
import { ResultSetHeader } from "mysql2/promise";

export const getAllPaquetes = async (): Promise<PaqueteDTO[]> => {
  const [rows] = await pool.query(`
    SELECT p.folio, p.cliente_id,
           CONCAT(c.nombre, ' ', c.apellido_paterno) AS nombre_cliente,
           p.tamano, p.forma, p.precio, p.peso
    FROM paquetes p
    LEFT JOIN clientes c ON p.cliente_id = c.cliente_id
  `);
  return rows as PaqueteDTO[];
};

export const findPaqueteByFolio = async (folio: number): Promise<PaqueteDTO | null> => {
  const [rows] = await pool.query(`
    SELECT p.folio, p.cliente_id,
           CONCAT(c.nombre, ' ', c.apellido_paterno) AS nombre_cliente,
           p.tamano, p.forma, p.precio, p.peso
    FROM paquetes p
    LEFT JOIN clientes c ON p.cliente_id = c.cliente_id
    WHERE p.folio = ?
  `, [folio]);
  const list = rows as PaqueteDTO[];
  return list.length ? list[0] : null;
};

export const createPaquete = async (data: CrearPaqueteDTO): Promise<PaqueteDTO> => {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO paquetes (cliente_id, tamano, forma, precio, peso) VALUES (?, ?, ?, ?, ?)`,
    [data.cliente_id, data.tamano, data.forma, data.precio, data.peso]
  );
  return await findPaqueteByFolio(result.insertId) as PaqueteDTO;
};

export const updatePaquete = async (folio: number, data: Partial<CrearPaqueteDTO>): Promise<PaqueteDTO> => {
  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE paquetes SET cliente_id = ?, tamano = ?, forma = ?, precio = ?, peso = ? WHERE folio = ?`,
    [data.cliente_id, data.tamano, data.forma, data.precio, data.peso, folio]
  );
  if ((result as any).affectedRows === 0) throw new Error("Paquete no encontrado");
  return await findPaqueteByFolio(folio) as PaqueteDTO;
};

export const deletePaquete = async (folio: number): Promise<void> => {
  try {
    await pool.query(`DELETE FROM paquetes WHERE folio = ?`, [folio]);
  } catch (error: any) {
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      throw new Error("No se puede eliminar el paquete porque tiene registros asociados");
    }
    throw error;
  }
};