import { pool } from "../../config/database";
import { AlmacenDTO, CrearAlmacenDTO } from "./almacen.dto";
import { ResultSetHeader } from "mysql2/promise";
import { NotFoundError, BadRequestError } from "../../errors/http-errors";

export const getAllAlmacenes = async (): Promise<AlmacenDTO[]> => {
  const [rows] = await pool.query(`
    SELECT a.almacen_id, a.sucursal_id, s.nombre_sucursal, a.nombre_almacen, a.descripcion
    FROM almacenes a
    LEFT JOIN sucursales s ON a.sucursal_id = s.sucursal_id
  `);
  return rows as AlmacenDTO[];
};

export const findAlmacenById = async (almacen_id: number): Promise<AlmacenDTO | null> => {
  const [rows] = await pool.query(
    `SELECT a.almacen_id, a.sucursal_id, s.nombre_sucursal, a.nombre_almacen, a.descripcion
     FROM almacenes a
     LEFT JOIN sucursales s ON a.sucursal_id = s.sucursal_id
     WHERE a.almacen_id = ?`,
    [almacen_id]
  );
  const list = rows as AlmacenDTO[];
  return list.length ? list[0] : null;
};

export const createAlmacen = async (data: CrearAlmacenDTO): Promise<AlmacenDTO> => {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO almacenes (sucursal_id, nombre_almacen, descripcion) VALUES (?, ?, ?)`,
    [data.sucursal_id, data.nombre_almacen, data.descripcion ?? null]
  );
  return await findAlmacenById(result.insertId) as AlmacenDTO;
};

export const updateAlmacen = async (
  almacen_id: number,
  data: Partial<CrearAlmacenDTO>
): Promise<AlmacenDTO> => {
  const keys = Object.keys(data);
  if (keys.length === 0) {
    throw new BadRequestError("No hay datos para actualizar");
  }

  const setSql = keys.map(k => `${k} = ?`).join(", ");
  const values = keys.map(k => (data as any)[k]);

  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE almacenes SET ${setSql} WHERE almacen_id = ?`,
    [...values, almacen_id]
  );

  if (result.affectedRows === 0) {
    throw new NotFoundError("Almacén no encontrado");
  }

  return await findAlmacenById(almacen_id) as AlmacenDTO;
};

export const deleteAlmacen = async (almacen_id: number): Promise<void> => {
  const [result] = await pool.query<ResultSetHeader>(
    `DELETE FROM almacenes WHERE almacen_id = ?`,
    [almacen_id]
  );
  if (result.affectedRows === 0) {
    throw new NotFoundError("Almacén no encontrado");
  }
};
