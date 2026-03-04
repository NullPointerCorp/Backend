import { pool } from "../../config/database";
import { CrearSucursalDTO, ActualizarSucursalDTO } from "./sucursal.dto";
import { ResultSetHeader } from "mysql2/promise";

export const getAllSucursales = async () => {
  const [rows] = await pool.query(`
    SELECT s.sucursal_id, s.nombre_sucursal, c.nombre_ciudad, s.colonia,
           s.codigo_postal, s.calle, s.numero_exterior, s.numero_interior,
           s.longitud, s.latitud
    FROM sucursales s
    LEFT JOIN ciudades c ON s.ciudad_id = c.ciudad_id
  `);
  return rows as any[];
};

export const findSucursalById = async (sucursal_id: number) => {
  const [rows] = await pool.query(`
    SELECT s.sucursal_id, s.nombre_sucursal, s.ciudad_id, c.nombre_ciudad,
           s.colonia, s.codigo_postal, s.calle, s.numero_exterior,
           s.numero_interior, s.longitud, s.latitud
    FROM sucursales s
    LEFT JOIN ciudades c ON s.ciudad_id = c.ciudad_id
    WHERE s.sucursal_id = ?
  `, [sucursal_id]);
  const list = rows as any[];
  return list.length ? list[0] : null;
};

export const createSucursal = async (data: CrearSucursalDTO) => {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO sucursales (nombre_sucursal, ciudad_id, colonia, codigo_postal, calle, numero_exterior, numero_interior, longitud, latitud)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [data.nombre_sucursal, data.ciudad_id, data.colonia, data.codigo_postal,
     data.calle, data.numero_exterior, data.numero_interior ?? null,
     data.longitud ?? null, data.latitud ?? null]
  );
  return await findSucursalById(result.insertId);
};

export const updateSucursal = async (sucursal_id: number, data: ActualizarSucursalDTO) => {
  const keys = Object.keys(data);
  if (keys.length === 0) return;
  const setSql = keys.map(k => `${k} = ?`).join(', ');
  const values = keys.map(k => (data as any)[k]);
  await pool.query(
    `UPDATE sucursales SET ${setSql} WHERE sucursal_id = ?`,
    [...values, sucursal_id]
  );
  return await findSucursalById(sucursal_id);
};

export const deleteSucursal = async (sucursal_id: number) => {
  try {
    const [result] = await pool.query(
      `DELETE FROM sucursales WHERE sucursal_id = ?`,
      [sucursal_id]
    );
    return result;
  } catch (error: any) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      throw new Error('No se puede eliminar la sucursal porque tiene registros asociados');
    }
    throw error;
  }
};