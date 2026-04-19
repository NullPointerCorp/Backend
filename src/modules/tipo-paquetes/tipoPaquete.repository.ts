import { pool } from "../../config/database";
import { PaqueteDTO, CrearPaqueteDTO } from "./tipoPaquete.dto";
import { ResultSetHeader } from "mysql2/promise";

export const getAllTipoPaquetes = async (): Promise<PaqueteDTO[]> => {
  try {
    const [rows] = await pool.query(`
      SELECT p.folio, p.cliente_id,
             CONCAT(c.nombre, ' ', c.apellido_paterno) AS nombre_cliente,
             p.tamano, p.forma, p.precio, p.peso
      FROM paquetes p
      LEFT JOIN clientes c ON p.cliente_id = c.cliente_id
    `);
    return rows as PaqueteDTO[];
  } catch (error: any) {
    console.error("Error al obtener tipos de paquete:", error);
    throw new Error("Error al obtener la lista de tipos de paquete");
  }
};

export const findTipoPaqueteByFolio = async (folio: number): Promise<PaqueteDTO | null> => {
  try {
    const [rows] = await pool.query(
      `SELECT p.folio, p.cliente_id,
              CONCAT(c.nombre, ' ', c.apellido_paterno) AS nombre_cliente,
              p.tamano, p.forma, p.precio, p.peso
       FROM paquetes p
       LEFT JOIN clientes c ON p.cliente_id = c.cliente_id
       WHERE p.folio = ?`,
      [folio]
    );
    const list = rows as PaqueteDTO[];
    return list.length ? list[0] : null;
  } catch (error: any) {
    console.error("Error al buscar tipo de paquete por folio:", error);
    throw new Error("Error al buscar el tipo de paquete");
  }
};

export const createTipoPaquete = async (data: CrearPaqueteDTO): Promise<PaqueteDTO> => {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO paquetes (cliente_id, tamano, forma, precio, peso) VALUES (?, ?, ?, ?, ?)`,
      [null, data.tamano, data.forma, data.precio, null]
    );
    return await findTipoPaqueteByFolio(result.insertId) as PaqueteDTO;
  } catch (error: any) {
    console.error("Error al crear tipo de paquete:", error);
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      throw new Error("El cliente seleccionado no existe");
    }
    throw new Error("Error al crear el tipo de paquete");
  }
};

export const updateTipoPaquete = async (
  folio: number,
  data: Partial<CrearPaqueteDTO>
): Promise<PaqueteDTO> => {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE paquetes SET cliente_id = ?, tamano = ?, forma = ?, precio = ?, peso = ? WHERE folio = ?`,
      [data.cliente_id, data.tamano, data.forma, data.precio, data.peso, folio]
    );

    if (result.affectedRows === 0) throw new Error("Paquete no encontrado");

    return await findTipoPaqueteByFolio(folio) as PaqueteDTO;
  } catch (error: any) {
    if (error.message === "Paquete no encontrado") throw error;
    console.error("Error al actualizar tipo de paquete:", error);
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      throw new Error("El cliente seleccionado no existe");
    }
    throw new Error("Error al actualizar el tipo de paquete");
  }
};

export const deleteTipoPaquete = async (folio: number): Promise<void> => {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      `DELETE FROM paquetes WHERE folio = ?`,
      [folio]
    );
    if (result.affectedRows === 0) throw new Error("Paquete no encontrado");
  } catch (error: any) {
    if (error.message === "Paquete no encontrado") throw error;
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      throw new Error("No se puede eliminar el paquete porque tiene registros asociados");
    }
    console.error("Error al eliminar tipo de paquete:", error);
    throw new Error("Error al eliminar el tipo de paquete");
  }
};
