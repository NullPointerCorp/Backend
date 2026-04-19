import { pool } from "../../config/database";
import { CrearRolDTO, EditarRolDTO, RolDTO } from "./rol.dto";
import { ResultSetHeader } from "mysql2/promise";
import { NotFoundError } from "../../errors/http-errors";

export const getAllRoles = async (): Promise<RolDTO[]> => {
  const [rows] = await pool.query(
    `SELECT rol_id, rol_nombre, descripcion
     FROM roles
     ORDER BY rol_id`
  );
  return rows as RolDTO[];
};

export const findRolById = async (rol_id: number): Promise<RolDTO | null> => {
  const [rows] = await pool.query(
    `SELECT rol_id, rol_nombre, descripcion
     FROM roles
     WHERE rol_id = ?`,
    [rol_id]
  );
  const list = rows as RolDTO[];
  return list.length ? list[0] : null;
};

export const createRol = async (data: CrearRolDTO): Promise<RolDTO> => {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO roles (rol_nombre, descripcion) VALUES (?, ?)`,
    [data.rol_nombre, data.descripcion ?? null]
  );
  return await findRolById(result.insertId) as RolDTO;
};

export const updateRol = async (
  rol_id: number,
  data: EditarRolDTO
): Promise<RolDTO> => {
  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE roles SET rol_nombre = ?, descripcion = ? WHERE rol_id = ?`,
    [data.rol_nombre, data.descripcion ?? null, rol_id]
  );

  if (result.affectedRows === 0) {
    throw new NotFoundError("Rol no encontrado");
  }

  return await findRolById(rol_id) as RolDTO;
};

export const deleteRol = async (rol_id: number): Promise<void> => {
  const [result] = await pool.query<ResultSetHeader>(
    `DELETE FROM roles WHERE rol_id = ?`,
    [rol_id]
  );
  if (result.affectedRows === 0) {
    throw new NotFoundError("Rol no encontrado");
  }
};
