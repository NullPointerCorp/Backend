import { pool } from "../../config/database";
import { CrearSucursalDTO, ActualizarSucursalDTO } from "./sucursal.dto";
import { ResultSetHeader } from "mysql2/promise";
import { NotFoundError } from "../../errors/http-errors";

export const getAllSucursales = async () => {
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
};

export const findSucursalById = async (sucursal_id: number) => {
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
};

export const createSucursal = async (data: CrearSucursalDTO) => {
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
};

export const updateSucursal = async (
  sucursal_id: number,
  data: ActualizarSucursalDTO
) => {
  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE sucursales SET 
      nombre_sucursal = ?,
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

  if (result.affectedRows === 0) {
    throw new NotFoundError("Sucursal no encontrada");
  }

  return await findSucursalById(sucursal_id);
};

export const deleteSucursal = async (sucursal_id: number) => {
  const [result] = await pool.query<ResultSetHeader>(
    `DELETE FROM sucursales WHERE sucursal_id = ?`,
    [sucursal_id]
  );
  if (result.affectedRows === 0) {
    throw new NotFoundError("Sucursal no encontrada");
  }
  return result;
};

export const getSucursalesByCiudad = async (ciudad_id: number) => {
  const [rows] = await pool.query(
    `SELECT s.sucursal_id, s.nombre_sucursal
     FROM sucursales s
     WHERE s.ciudad_id = ?
     ORDER BY s.nombre_sucursal`,
    [ciudad_id]
  );
  return rows as any[];
};
