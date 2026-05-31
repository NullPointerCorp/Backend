import { ResultSetHeader } from "mysql2/promise";
import { pool } from "../../config/database";
import { CrearViajeDTO, TipoFiltroViaje, ViajeConsultaDTO } from "./viaje.dto";

export const findEmpleadoContextByFirebaseUid = async (uid: string) => {
  const [rows] = await pool.query(
    `SELECT
      e.empleado_id,
      e.sucursal_id,
      s.nombre_sucursal,
      r.rol_nombre AS rol
     FROM empleados e
     INNER JOIN roles r ON e.rol_id = r.rol_id
     LEFT JOIN sucursales s ON e.sucursal_id = s.sucursal_id
     WHERE e.firebase_uid = ?
     LIMIT 1`,
    [uid]
  );
  const list = rows as any[];
  return list.length ? list[0] : null;
};

const viajeSelect = `
  SELECT
    v.viaje_id,
    v.numero_serie,
    t.placa,
    COALESCE(CONCAT(e.nombre, ' ', e.apellido_paterno), 'Sin asignar') AS transportista,
    v.sucursal_origen_id,
    so.nombre_sucursal AS origen,
    v.sucursal_destino_id,
    sd.nombre_sucursal AS destino,
    v.fecha_salida,
    v.fecha_llegada
  FROM viajes v
  INNER JOIN transportes t ON t.numero_serie = v.numero_serie
  LEFT JOIN empleados e ON e.empleado_id = t.empleado_id
  INNER JOIN sucursales so ON so.sucursal_id = v.sucursal_origen_id
  INNER JOIN sucursales sd ON sd.sucursal_id = v.sucursal_destino_id
`;

export const getAllViajes = async (): Promise<ViajeConsultaDTO[]> => {
  const [rows] = await pool.query(`${viajeSelect} ORDER BY v.fecha_salida DESC`);
  return rows as ViajeConsultaDTO[];
};

export const getViajesBySucursal = async (
  sucursalId: number,
  tipo: TipoFiltroViaje
): Promise<ViajeConsultaDTO[]> => {
  const where =
    tipo === "entradas"
      ? "v.sucursal_destino_id = ?"
      : tipo === "todos"
        ? "(v.sucursal_origen_id = ? OR v.sucursal_destino_id = ?)"
        : "v.sucursal_origen_id = ?";

  const params = tipo === "todos" ? [sucursalId, sucursalId] : [sucursalId];

  const [rows] = await pool.query(
    `${viajeSelect} WHERE ${where} ORDER BY v.fecha_salida DESC`,
    params
  );
  return rows as ViajeConsultaDTO[];
};

export const findViajeById = async (viajeId: number): Promise<ViajeConsultaDTO | null> => {
  const [rows] = await pool.query(`${viajeSelect} WHERE v.viaje_id = ? LIMIT 1`, [viajeId]);
  const list = rows as ViajeConsultaDTO[];
  return list.length ? list[0] : null;
};

export const getSucursalesDestino = async (sucursalOrigenId: number) => {
  const [rows] = await pool.query(
    `SELECT sucursal_id, nombre_sucursal
     FROM sucursales
     WHERE sucursal_id <> ?
     ORDER BY nombre_sucursal`,
    [sucursalOrigenId]
  );
  return rows as any[];
};

export const getTransportesBySucursal = async (sucursalId: number) => {
  const [rows] = await pool.query(
    `SELECT
      numero_serie,
      placa,
      capacidad_carga,
      unidad_medida
     FROM transportes
     WHERE sucursal_id = ?
     ORDER BY numero_serie`,
    [sucursalId]
  );
  return rows as any[];
};

export const createViaje = async (
  data: CrearViajeDTO,
  sucursalOrigenId: number
): Promise<ViajeConsultaDTO> => {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO viajes (
      numero_serie,
      sucursal_origen_id,
      sucursal_destino_id,
      fecha_salida,
      fecha_llegada
    ) VALUES (?, ?, ?, ?, ?)`,
    [
      data.numero_serie,
      sucursalOrigenId,
      data.sucursal_destino_id,
      data.fecha_salida,
      data.fecha_llegada || null,
    ]
  );

  return (await findViajeById(result.insertId)) as ViajeConsultaDTO;
};
