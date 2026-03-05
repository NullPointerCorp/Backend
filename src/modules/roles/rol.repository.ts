import { pool } from "../../config/database";

export const getAllRoles = async () => {
  const [rows] = await pool.query(
    `SELECT id_rol AS rol_id, nombre_rol AS nombre
     FROM roles
     ORDER BY nombre_rol`,
  );

  return rows as { rol_id: number; nombre: string }[];
};