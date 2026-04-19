import { pool } from "../../config/database";
import { CrearSucursalDTO, ActualizarSucursalDTO } from "./sucursal.dto";
import { ResultSetHeader } from "mysql2/promise";

export const getAllSucursales = async () => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        s.sucursal_id,
        s.nombre_sucursal,
        est.nombre_estado,
        c.nombre_ciudad,
        s.colonia,
        s.codigo_postal,
        s.calle,
        s.numero_exterior,
        s.numero_interior,
        s.longitud,
        s.latitud,
        s.supervisor_de_sucursal AS empleado_id_supervisor,
        CONCAT(COALESCE(e.nombre, ''), ' ', COALESCE(e.apellido_paterno, '')) AS nombre_supervisor
      FROM sucursales s
      LEFT JOIN ciudades c ON s.ciudad_id = c.ciudad_id
      LEFT JOIN estados est ON c.estado_id = est.estado_id
      LEFT JOIN empleados e ON s.supervisor_de_sucursal = e.empleado_id
      ORDER BY s.sucursal_id
    `);
    return rows as any[];
  } catch (error: any) {
    console.error("Error al obtener sucursales:", error);
    throw new Error("Error al obtener la lista de sucursales");
  }
};

export const findSucursalById = async (sucursal_id: number) => {
  try {
    const [rows] = await pool.query(
      `SELECT s.sucursal_id, s.nombre_sucursal, s.ciudad_id, c.nombre_ciudad,
              est.nombre_estado,
              s.colonia, s.codigo_postal, s.calle, s.numero_exterior,
              s.numero_interior, s.longitud, s.latitud,
              s.supervisor_de_sucursal AS empleado_id_supervisor,
              CONCAT(e.nombre, ' ', e.apellido_paterno) AS nombre_supervisor
       FROM sucursales s
       LEFT JOIN ciudades c ON s.ciudad_id = c.ciudad_id
       LEFT JOIN estados est ON c.estado_id = est.estado_id
       LEFT JOIN empleados e ON s.supervisor_de_sucursal = e.empleado_id
       WHERE s.sucursal_id = ?`,
      [sucursal_id]
    );
    const list = rows as any[];
    return list.length ? list[0] : null;
  } catch (error: any) {
    console.error("Error al buscar sucursal por ID:", error);
    throw new Error("Error al buscar la sucursal");
  }
};

export const createSucursal = async (data: CrearSucursalDTO) => {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO sucursales (
        nombre_sucursal, ciudad_id, colonia, codigo_postal, calle,
        numero_exterior, numero_interior, longitud, latitud, supervisor_de_sucursal
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.nombre_sucursal,
        data.ciudad_id,
        data.colonia,
        data.codigo_postal,
        data.calle,
        data.numero_exterior,
        data.numero_interior ?? null,
        data.longitud ?? null,
        data.latitud ?? null,
        data.empleado_id_supervisor ?? null,
      ]
    );
    return await findSucursalById(result.insertId);
  } catch (error: any) {
    console.error("Error al crear sucursal:", error);
    if (error.code === "ER_DUP_ENTRY") {
      throw new Error("Ya existe una sucursal con ese nombre");
    }
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      throw new Error("La ciudad o el supervisor seleccionado no existe");
    }
    throw new Error("Error al crear la sucursal");
  }
};

export const updateSucursal = async (
  sucursal_id: number,
  data: ActualizarSucursalDTO
) => {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE sucursales SET 
        nombre_sucursal = ?,
        ciudad_id = ?,
        colonia = ?,
        codigo_postal = ?,
        calle = ?,
        numero_exterior = ?,
        numero_interior = ?,
        longitud = ?,
        latitud = ?,
        supervisor_de_sucursal = ?
       WHERE sucursal_id = ?`,
      [
        data.nombre_sucursal,
        data.ciudad_id ?? null,
        data.colonia,
        data.codigo_postal,
        data.calle,
        data.numero_exterior,
        data.numero_interior ?? null,
        data.longitud ?? null,
        data.latitud ?? null,
        data.empleado_id_supervisor ?? null,
        sucursal_id,
      ]
    );

    if (result.affectedRows === 0) throw new Error("Sucursal no encontrada");

    return await findSucursalById(sucursal_id);
  } catch (error: any) {
    if (error.message === "Sucursal no encontrada") throw error;
    console.error("Error al actualizar sucursal:", error);
    if (error.code === "ER_DUP_ENTRY") {
      throw new Error("Ya existe una sucursal con ese nombre");
    }
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      throw new Error("La ciudad o el supervisor seleccionado no existe");
    }
    throw new Error("Error al actualizar la sucursal");
  }
};

export const deleteSucursal = async (sucursal_id: number) => {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      `DELETE FROM sucursales WHERE sucursal_id = ?`,
      [sucursal_id]
    );
    if (result.affectedRows === 0) throw new Error("Sucursal no encontrada");
    return result;
  } catch (error: any) {
    if (error.message === "Sucursal no encontrada") throw error;
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      throw new Error("No se puede eliminar la sucursal porque tiene registros asociados");
    }
    console.error("Error al eliminar sucursal:", error);
    throw new Error("Error al eliminar la sucursal");
  }
};

export const getSucursalesByCiudad = async (ciudad_id: number) => {
  try {
    const [rows] = await pool.query(
      `SELECT s.sucursal_id, s.nombre_sucursal
       FROM sucursales s
       WHERE s.ciudad_id = ?
       ORDER BY s.nombre_sucursal`,
      [ciudad_id]
    );
    return rows as any[];
  } catch (error: any) {
    console.error("Error al obtener sucursales por ciudad:", error);
    throw new Error("Error al obtener las sucursales de la ciudad");
  }
};
