import { pool } from "../../config/database";

export const getAllEmpleados = async () => {
  const [rows] = await pool.query("SELECT * FROM empleados");
  return rows;
};

export const findEmpleadoByFirebaseUid = async (uid: string) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM empleados WHERE firebase_uid = ?",
      [uid],
    );

    const empleados = rows as any[];

    if (empleados.length === 0) {
      return null;
    }

    return empleados[0];
  } catch (error) {
    console.error("Error al buscar empleado por Firebase UID:", error);
    throw error;
  }
};
