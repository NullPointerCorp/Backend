import { pool } from "../../config/database";
import { CrearRolDTO, EditarRolDTO, RolDTO } from "./rol.dto";
import { ResultSetHeader } from 'mysql2/promise';

export const getAllRoles = async (): Promise<RolDTO[]> => {
  try {
    const [rows] = await pool.query(
      `SELECT rol_id, rol_nombre, descripcion
       FROM roles
       ORDER BY rol_id`
    );
    return rows as RolDTO[];
  } catch (error: any) {
    console.error("Error al obtener roles:", error);
    throw new Error("Error al obtener la lista de roles");
  }
};

export const findRolById = async (rol_id: number): Promise<RolDTO | null> => {
  try {
    const [rows] = await pool.query(
      `SELECT rol_id, rol_nombre, descripcion
       FROM roles
       WHERE rol_id = ?`,
      [rol_id]
    );
    const list = rows as RolDTO[];
    return list.length ? list[0] : null;
  } catch (error: any) {
    console.error("Error al buscar rol por ID:", error);
    throw new Error("Error al buscar el rol");
  }
};

export const createRol = async (data: CrearRolDTO): Promise<RolDTO> => {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO roles (rol_nombre, descripcion) VALUES (?, ?)`,
      [data.rol_nombre, data.descripcion ?? null]
    );
    return await findRolById(result.insertId) as RolDTO;
  } catch (error: any) {
    console.error("Error al crear rol:", error);
    if (error.code === "ER_DUP_ENTRY") {
      throw new Error("Ya existe un rol con ese nombre");
    }
    throw new Error("Error al crear el rol");
  }
};

export const updateRol = async (
  rol_id: number,
  data: EditarRolDTO
): Promise<RolDTO> => {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE roles SET 
        rol_nombre = ?,
        descripcion = ?
       WHERE rol_id = ?`,
      [
        data.rol_nombre,
        data.descripcion ?? null,
        rol_id,
      ]
    );

    if (result.affectedRows === 0) throw new Error("Rol no encontrado");

    return await findRolById(rol_id) as RolDTO;
  } catch (error: any) {
    if (error.message === "Rol no encontrado") throw error;
    console.error("Error al actualizar rol:", error);
    if (error.code === "ER_DUP_ENTRY") {
      throw new Error("Ya existe un rol con ese nombre");
    }
    throw new Error("Error al actualizar el rol");
  }
};

export const deleteRol = async (rol_id: number): Promise<void> => {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      `DELETE FROM roles WHERE rol_id = ?`,
      [rol_id]
    );
    if (result.affectedRows === 0) throw new Error("Rol no encontrado");
  } catch (error: any) {
    if (error.message === "Rol no encontrado") throw error;
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      throw new Error("No se puede eliminar el rol porque tiene registros asociados");
    }
    console.error("Error al eliminar rol:", error);
    throw new Error("Error al eliminar el rol");
  }
};
