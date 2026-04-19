import { pool } from "../../config/database";
import { PaqueteDTO, CrearPaqueteDTO } from "./tipoPaquete.dto";
import { ResultSetHeader } from "mysql2/promise";
import { NotFoundError } from "../../errors/http-errors";

export const getAllTipoPaquetes = async (): Promise<PaqueteDTO[]> => {
  const [rows] = await pool.query(`
    SELECT p.folio, p.cliente_id,
           CONCAT(c.nombre, ' ', c.apellido_paterno) AS nombre_cliente,
           p.tamano, p.forma, p.precio
    FROM paquetes p
    LEFT JOIN clientes c ON p.cliente_id = c.cliente_id
  `);
  return rows as PaqueteDTO[];
};

export const findTipoPaqueteByFolio = async (folio: number): Promise<PaqueteDTO | null> => {
  const [rows] = await pool.query(
    `SELECT p.folio, p.cliente_id,
            CONCAT(c.nombre, ' ', c.apellido_paterno) AS nombre_cliente,
            p.tamano, p.forma, p.precio
     FROM paquetes p
     LEFT JOIN clientes c ON p.cliente_id = c.cliente_id
     WHERE p.folio = ?`,
    [folio]
  );
  const list = rows as PaqueteDTO[];
  return list.length ? list[0] : null;
};

export const createTipoPaquete = async (data: CrearPaqueteDTO): Promise<PaqueteDTO> => {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO paquetes (cliente_id, tamano, forma, precio) VALUES (?, ?, ?, ?)`,
    [data.cliente_id ?? null, data.tamano, data.forma, data.precio]
  );
  return await findTipoPaqueteByFolio(result.insertId) as PaqueteDTO;
};

export const updateTipoPaquete = async (
  folio: number,
  data: Partial<CrearPaqueteDTO>
): Promise<PaqueteDTO> => {
  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE paquetes 
     SET cliente_id = ?, tamano = ?, forma = ?, precio = ?
     WHERE folio = ?`,
    [data.cliente_id ?? null, data.tamano, data.forma, data.precio, folio]
  );

  if (result.affectedRows === 0) {
    throw new NotFoundError("Paquete no encontrado");
  }

  return await findTipoPaqueteByFolio(folio) as PaqueteDTO;
};

export const deleteTipoPaquete = async (folio: number): Promise<void> => {
  const [result] = await pool.query<ResultSetHeader>(
    `DELETE FROM paquetes WHERE folio = ?`,
    [folio]
  );
  if (result.affectedRows === 0) {
    throw new NotFoundError("Paquete no encontrado");
  }
};
