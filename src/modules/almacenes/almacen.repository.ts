import { pool } from "../../config/database";
import { AlmacenDTO, CrearAlmacenDTO } from "./almacen.dto";
import { ResultSetHeader } from 'mysql2/promise';

export const getAllAlmacenes = async (): Promise<AlmacenDTO[]> => {
  try {
    const [rows] = await pool.query(`
      SELECT a.almacen_id, a.sucursal_id, s.nombre_sucursal, a.nombre_almacen, a.descripcion
      FROM almacenes a
      LEFT JOIN sucursales s ON a.sucursal_id = s.sucursal_id
    `);
    return rows as AlmacenDTO[];
  } catch (error: any) {
    console.error("Error al obtener almacenes:", error);
    throw new Error("Error al obtener la lista de almacenes");
  }
};

export const findAlmacenById = async (almacen_id: number): Promise<AlmacenDTO | null> => {
  try {
    const [rows] = await pool.query(`
      SELECT a.almacen_id, a.sucursal_id, s.nombre_sucursal, a.nombre_almacen, a.descripcion
      FROM almacenes a
      LEFT JOIN sucursales s ON a.sucursal_id = s.sucursal_id
      WHERE a.almacen_id = ?
    `, [almacen_id]);
    const list = rows as AlmacenDTO[];
    return list.length ? list[0] : null;
  } catch (error: any) {
    console.error("Error al buscar almacén por ID:", error);
    throw new Error("Error al buscar el almacén");
  }
};

export const createAlmacen = async (data: CrearAlmacenDTO): Promise<AlmacenDTO> => {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO almacenes (sucursal_id, nombre_almacen, descripcion) VALUES (?, ?, ?)`,
      [data.sucursal_id, data.nombre_almacen, data.descripcion ?? null]
    );
    return await findAlmacenById(result.insertId) as AlmacenDTO;
  } catch (error: any) {
    console.error("Error al crear almacén:", error);
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      throw new Error("La sucursal seleccionada no existe");
    }
    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error("Ya existe un almacén con esos datos");
    }
    throw new Error("Error al crear el almacén");
  }
};

export const updateAlmacen = async (
  almacen_id: number,
  data: Partial<CrearAlmacenDTO>
): Promise<AlmacenDTO> => {
  try {
    const keys = Object.keys(data);
    if (keys.length === 0) throw new Error("No hay datos para actualizar");

    const setSql = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k => (data as any)[k]);

    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE almacenes SET ${setSql} WHERE almacen_id = ?`,
      [...values, almacen_id]
    );

    if (result.affectedRows === 0) throw new Error("Almacén no encontrado");

    return await findAlmacenById(almacen_id) as AlmacenDTO;
  } catch (error: any) {
    if (error.message === "Almacén no encontrado" || error.message === "No hay datos para actualizar") {
      throw error;
    }
    console.error("Error al actualizar almacén:", error);
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      throw new Error("La sucursal seleccionada no existe");
    }
    throw new Error("Error al actualizar el almacén");
  }
};

export const deleteAlmacen = async (almacen_id: number): Promise<void> => {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      `DELETE FROM almacenes WHERE almacen_id = ?`,
      [almacen_id]
    );
    if (result.affectedRows === 0) throw new Error("Almacén no encontrado");
  } catch (error: any) {
    if (error.message === "Almacén no encontrado") throw error;
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      throw new Error("No se puede eliminar el almacén porque tiene registros asociados");
    }
    console.error("Error al eliminar almacén:", error);
    throw new Error("Error al eliminar el almacén");
  }
};
