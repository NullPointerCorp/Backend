import { pool } from "../../config/database";
import { CrearTransporteDTO, ActualizarTransporteDTO } from "./transporte.dto";
import { ResultSetHeader } from "mysql2/promise";

export const getAllTransportes = async () => {
  try {
    const [rows] = await pool.query(`
      SELECT
        t.numero_serie,
        t.empleado_id,
        e.nombre AS transportista,
        tt.tipo_id,
        tt.nombre_tipo AS tipo_transporte,
        st.subtipo_id,
        st.nombre_subtipo AS subtipo_transporte,
        t.capacidad_carga,
        t.unidad_medida,
        t.placa
      FROM transportes t
      INNER JOIN empleados e ON t.empleado_id = e.empleado_id
      INNER JOIN subtipo_transporte st ON t.subtipo_id = st.subtipo_id
      INNER JOIN tipo_transporte tt ON st.tipo_id = tt.tipo_id
      ORDER BY t.numero_serie
    `);
    return rows as any[];
  } catch (error: any) {
    console.error("Error al obtener transportes:", error);
    throw new Error("Error al obtener la lista de transportes");
  }
};

export const findTransporteByNumeroSerie = async (numero_serie: string) => {
  try {
    const [rows] = await pool.query(
      `SELECT
        t.numero_serie,
        t.empleado_id,
        e.nombre AS transportista,
        tt.tipo_id,
        tt.nombre_tipo AS tipo_transporte,
        st.subtipo_id,
        st.nombre_subtipo AS subtipo_transporte,
        t.capacidad_carga,
        t.unidad_medida,
        t.placa
       FROM transportes t
       INNER JOIN empleados e ON t.empleado_id = e.empleado_id
       INNER JOIN subtipo_transporte st ON t.subtipo_id = st.subtipo_id
       INNER JOIN tipo_transporte tt ON st.tipo_id = tt.tipo_id
       WHERE t.numero_serie = ?`,
      [numero_serie]
    );
    const list = rows as any[];
    return list.length ? list[0] : null;
  } catch (error: any) {
    console.error("Error al buscar transporte por número de serie:", error);
    throw new Error("Error al buscar el transporte");
  }
};

export const createTransporte = async (data: CrearTransporteDTO) => {
  try {
    await pool.query(
      `INSERT INTO transportes (numero_serie, empleado_id, subtipo_id, capacidad_carga, unidad_medida, placa)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.numero_serie,
        data.empleado_id,
        data.subtipo_id,
        data.capacidad_carga,
        data.unidad_medida,
        data.placa ?? null,
      ]
    );
    return await findTransporteByNumeroSerie(data.numero_serie);
  } catch (error: any) {
    console.error("Error al crear transporte:", error);
    if (error.code === "ER_DUP_ENTRY") {
      throw new Error("Ya existe un transporte con ese número de serie o placa");
    }
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      throw new Error("El empleado o subtipo seleccionado no existe");
    }
    throw new Error("Error al crear el transporte");
  }
};

export const updateTransporte = async (
  numero_serie: string,
  data: ActualizarTransporteDTO
) => {
  try {
    const keys = Object.keys(data);
    if (keys.length === 0) return;

    const setSql = keys.map((k) => `${k} = ?`).join(", ");
    const values = keys.map((k) => (data as any)[k]);

    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE transportes SET ${setSql} WHERE numero_serie = ?`,
      [...values, numero_serie]
    );

    if (result.affectedRows === 0) throw new Error("Transporte no encontrado");

    return await findTransporteByNumeroSerie(numero_serie);
  } catch (error: any) {
    if (error.message === "Transporte no encontrado") throw error;
    console.error("Error al actualizar transporte:", error);
    if (error.code === "ER_DUP_ENTRY") {
      throw new Error("Ya existe un transporte con ese número de serie o placa");
    }
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      throw new Error("El empleado o subtipo seleccionado no existe");
    }
    throw new Error("Error al actualizar el transporte");
  }
};

export const deleteTransporte = async (numero_serie: string) => {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      `DELETE FROM transportes WHERE numero_serie = ?`,
      [numero_serie]
    );
    if (result.affectedRows === 0) throw new Error("Transporte no encontrado");
    return result;
  } catch (error: any) {
    if (error.message === "Transporte no encontrado") throw error;
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      throw new Error("No se puede eliminar el transporte porque tiene registros asociados");
    }
    console.error("Error al eliminar transporte:", error);
    throw new Error("Error al eliminar el transporte");
  }
};

export const getAllTiposTransporte = async () => {
  try {
    const [rows] = await pool.query(
      `SELECT tipo_id, nombre_tipo FROM tipo_transporte ORDER BY nombre_tipo`
    );
    return rows as any[];
  } catch (error: any) {
    console.error("Error al obtener tipos de transporte:", error);
    throw new Error("Error al obtener los tipos de transporte");
  }
};

export const getAllSubtiposTransporte = async () => {
  try {
    const [rows] = await pool.query(
      `SELECT subtipo_id, tipo_id, nombre_subtipo FROM subtipo_transporte ORDER BY nombre_subtipo`
    );
    return rows as any[];
  } catch (error: any) {
    console.error("Error al obtener subtipos de transporte:", error);
    throw new Error("Error al obtener los subtipos de transporte");
  }
};
