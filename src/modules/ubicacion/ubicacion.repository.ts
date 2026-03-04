import { pool } from "../../config/database";

export const getAllEstados = async () => {
  try {
    const [rows] = await pool.query(
      `SELECT estado_id, nombre_estado FROM estados ORDER BY nombre_estado`,
    );
    return rows as any[];
  } catch (error) {
    throw new Error("Error al listar estados");
  }
};

export const getCiudadesByEstado = async (estado_id: number) => {
  try {
    const [rows] = await pool.query(
      `SELECT ciudad_id, nombre_ciudad FROM ciudades WHERE estado_id = ? ORDER BY nombre_ciudad`,
      [estado_id],
    );
    return rows as any[];
  } catch (error) {
    throw new Error("Error al listar ciudades");
  }
};
