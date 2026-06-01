import { ResultSetHeader } from "mysql2/promise";
import { pool } from "../../config/database";
import { ActualizarViajeDTO, CrearViajeDTO, EstadoViaje, TipoFiltroViaje, ViajeConsultaDTO, ViajeTransportistaDTO } from "./viaje.dto";
import { NotFoundError } from "../../errors/http-errors";

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
    v.fecha_llegada,
    v.estado
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

export const getTransportesDisponibles = async (
  sucursalId: number,
  fechaSalida: string,
  fechaLlegada: string,
  excluirViajeId?: number
) => {
  const query = `
    SELECT numero_serie, placa, capacidad_carga, unidad_medida
    FROM transportes
    WHERE sucursal_id = ?
      AND numero_serie NOT IN (
        SELECT numero_serie FROM viajes
        WHERE estado NOT IN ('finalizado', 'cancelado')
          AND (
            (fecha_salida < ? AND fecha_llegada > ?)
            OR fecha_llegada <= NOW()
          )
          ${excluirViajeId ? "AND viaje_id <> ?" : ""}
      )
    ORDER BY numero_serie
  `;
  const params: any[] = [sucursalId, fechaLlegada, fechaSalida];
  if (excluirViajeId) params.push(excluirViajeId);
  const [rows] = await pool.query(query, params);
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
      fecha_llegada,
      estado
    ) VALUES (?, ?, ?, ?, ?, 'programado')`,
    [
      data.numero_serie,
      sucursalOrigenId,
      data.sucursal_destino_id,
      data.fecha_salida,
      data.fecha_llegada,
    ]
  );

  return (await findViajeById(result.insertId)) as ViajeConsultaDTO;
};

export const findViajeTranslapado = async (
  numeroSerie: string,
  fechaSalida: string,
  fechaLlegada: string,
  excluirViajeId?: number
): Promise<boolean> => {
  const query = `
    SELECT 1 FROM viajes
    WHERE numero_serie = ?
      AND estado NOT IN ('finalizado', 'cancelado')
      AND (
        (fecha_salida < ? AND fecha_llegada > ?)
        OR fecha_llegada <= NOW()
      )
      ${excluirViajeId ? "AND viaje_id <> ?" : ""}
    LIMIT 1
  `;
  const params: any[] = [numeroSerie, fechaLlegada, fechaSalida];
  if (excluirViajeId) params.push(excluirViajeId);

  const [rows] = await pool.query(query, params);
  return (rows as any[]).length > 0;
};

export const updateViaje = async (
  viajeId: number,
  data: ActualizarViajeDTO
): Promise<ViajeConsultaDTO> => {
  await pool.query(
    `UPDATE viajes SET numero_serie = ?, fecha_salida = ?, fecha_llegada = ? WHERE viaje_id = ?`,
    [data.numero_serie, data.fecha_salida, data.fecha_llegada || null, viajeId]
  );
  return (await findViajeById(viajeId)) as ViajeConsultaDTO;
};

export const updateViajeEstado = async (viajeId: number, estado: EstadoViaje): Promise<ViajeConsultaDTO> => {
  await pool.query(`UPDATE viajes SET estado = ? WHERE viaje_id = ?`, [estado, viajeId]);
  return (await findViajeById(viajeId)) as ViajeConsultaDTO;
};

export const deleteViaje = async (viajeId: number): Promise<void> => {
  const [result] = await pool.query<ResultSetHeader>(
    `DELETE FROM viajes WHERE viaje_id = ?`,
    [viajeId]
  );
  if (result.affectedRows === 0) throw new NotFoundError("Viaje no encontrado");
};

export const getViajeActivoByTransportista = async (empleado_id: number): Promise<boolean> => {
  const [rows] = await pool.query(
    `SELECT 1 FROM viajes v
     INNER JOIN transportes t ON t.numero_serie = v.numero_serie
     WHERE t.empleado_id = ?
     AND v.estado IN ('en_camino', 'entregado', 'regresando')
     LIMIT 1`,
    [empleado_id]
  );
  return (rows as any[]).length > 0;
};

export const getViajesTransportista = async (
  empleado_id: number
): Promise<ViajeTransportistaDTO[]> => {
  const [rows] = await pool.query(
    `SELECT 
      v.viaje_id,
      so.nombre_sucursal AS origen,
      sd.nombre_sucursal AS destino,
      v.fecha_salida,
      v.fecha_llegada,
      v.estado,
      COUNT(e.envio_id) AS total_envios
    FROM viajes v
    INNER JOIN transportes t ON t.numero_serie = v.numero_serie
    INNER JOIN sucursales so ON so.sucursal_id = v.sucursal_origen_id
    INNER JOIN sucursales sd ON sd.sucursal_id = v.sucursal_destino_id
    LEFT JOIN envios e ON e.viaje_id = v.viaje_id
    WHERE t.empleado_id = ?
    AND v.estado NOT IN ('cancelado')
    GROUP BY v.viaje_id, so.nombre_sucursal, sd.nombre_sucursal, v.fecha_salida, v.fecha_llegada, v.estado
    ORDER BY v.fecha_salida ASC`,
    [empleado_id]
  );
  return rows as ViajeTransportistaDTO[];
};