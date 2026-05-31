import { pool } from "../../config/database";
import {
  EnvioDTO,
  CrearEnvioDTO,
  EditarEnvioDTO,
  EnvioConsultaDTO,
} from "./envio.dto";
import { ResultSetHeader } from "mysql2/promise";
import { NotFoundError } from "../../errors/http-errors";

export const getAllEnvios = async (): Promise<EnvioConsultaDTO[]> => {
  const [rows] = await pool.query(
    `SELECT envio_id, c.correo, e.descripcion, tp.tamanio, tp.forma, e.peso, CONCAT(em.nombre,' ',em.apellido_paterno) AS nombre_empleado, t.numero_serie, st.nombre_subtipo, v.fecha_salida, v.fecha_llegada, s_origen.nombre_sucursal AS origen, s_destino.nombre_sucursal AS destino, e.estado_envio
    FROM envios e
    LEFT JOIN viajes v on v.viaje_id = e.viaje_id
    LEFT JOIN transportes t on t.numero_serie = v.numero_serie
    INNER JOIN tipo_paquetes tp on tp.tipo_paquete_id = e.tipo_paquete_id
    INNER JOIN empleados em on em.empleado_id = e.empleado_id
    INNER JOIN sucursales s_origen on s_origen.sucursal_id = COALESCE(e.sucursal_origen_id, v.sucursal_origen_id)
    INNER JOIN sucursales s_destino on s_destino.sucursal_id = COALESCE(e.sucursal_destino_id, v.sucursal_destino_id)
    LEFT JOIN subtipo_transporte st on st.subtipo_id = t.subtipo_id
    INNER JOIN clientes c on c.cliente_id = e.cliente_id
    ORDER BY e.envio_id`,
  );
  return rows as EnvioConsultaDTO[];
};

export const getAllEnviosEmpleado = async (
  empleado_id: number,
): Promise<EnvioConsultaDTO[]> => {
  const [rows] = await pool.query(
    `SELECT envio_id, c.correo, e.descripcion, tp.tamanio, tp.forma, e.peso, CONCAT(em.nombre,' ',em.apellido_paterno) AS nombre_empleado, t.numero_serie, st.nombre_subtipo, v.fecha_salida, v.fecha_llegada, s_origen.nombre_sucursal AS origen, s_destino.nombre_sucursal AS destino, e.estado_envio
    FROM envios e
    LEFT JOIN viajes v on v.viaje_id = e.viaje_id
    LEFT JOIN transportes t on t.numero_serie = v.numero_serie
    INNER JOIN tipo_paquetes tp on tp.tipo_paquete_id = e.tipo_paquete_id
    INNER JOIN empleados em on em.empleado_id = e.empleado_id
    INNER JOIN sucursales s_origen on s_origen.sucursal_id = COALESCE(e.sucursal_origen_id, v.sucursal_origen_id)
    INNER JOIN sucursales s_destino on s_destino.sucursal_id = COALESCE(e.sucursal_destino_id, v.sucursal_destino_id)
    LEFT JOIN subtipo_transporte st on st.subtipo_id = t.subtipo_id
    INNER JOIN clientes c on c.cliente_id = e.cliente_id
    WHERE em.empleado_id = ?
    ORDER BY e.envio_id`,
    [empleado_id],
  );
  return rows as EnvioConsultaDTO[];
};

export const findEnviolById = async (
  envio_id: number,
): Promise<EnvioDTO | null> => {
  const [rows] = await pool.query(
    `SELECT
      e.envio_id,
      e.tipo_paquete_id,
      e.viaje_id,
      COALESCE(e.sucursal_origen_id, v.sucursal_origen_id) AS sucursal_origen_id,
      COALESCE(e.sucursal_destino_id, v.sucursal_destino_id) AS sucursal_destino_id,
      e.descripcion,
      e.estado_envio,
      e.peso,
      e.cliente_id,
      e.empleado_id
     FROM envios e
     LEFT JOIN viajes v ON v.viaje_id = e.viaje_id
     WHERE e.envio_id = ?`,
    [envio_id],
  );
  const list = rows as EnvioDTO[];
  return list.length ? list[0] : null;
};

export const getSucursalIdByFirebaseUid = async (
  uid: string,
): Promise<number | null> => {
  const [rows] = await pool.query(
    `SELECT sucursal_id FROM empleados WHERE firebase_uid = ? LIMIT 1`,
    [uid],
  );
  const list = rows as { sucursal_id: number }[];
  return list.length ? list[0].sucursal_id : null;
};

export const getEmpleadoIdByFirebaseUid = async (
  uid: string,
): Promise<number | null> => {
  const [rows] = await pool.query(
    `SELECT empleado_id FROM empleados WHERE firebase_uid = ? LIMIT 1`,
    [uid],
  );
  const list = rows as { empleado_id: number }[];
  return list.length ? list[0].empleado_id : null;
};

export const findViajeDisponible = async (
  origen_id: number,
  destino_id: number,
  peso: number,
) => {
  const [rows] = await pool.query(
    `SELECT
      v.viaje_id,
      v.numero_serie,
      v.fecha_salida,
      CASE
        WHEN t.unidad_medida = 'ton' THEN t.capacidad_carga * 1000
        WHEN t.unidad_medida = 'lb' THEN t.capacidad_carga * 0.453592
        ELSE t.capacidad_carga
      END AS capacidad_kg,
      COALESCE(SUM(CASE WHEN e.estado_envio <> 'cancelado' THEN e.peso ELSE 0 END), 0) AS peso_asignado
     FROM viajes v
     INNER JOIN transportes t ON t.numero_serie = v.numero_serie
     LEFT JOIN envios e ON e.viaje_id = v.viaje_id
     WHERE v.sucursal_origen_id = ?
       AND v.sucursal_destino_id = ?
       AND v.fecha_salida >= NOW()
     GROUP BY v.viaje_id, v.numero_serie, v.fecha_salida, t.capacidad_carga, t.unidad_medida
     HAVING (capacidad_kg - peso_asignado) >= ?
     ORDER BY v.fecha_salida ASC
     LIMIT 1`,
    [origen_id, destino_id, peso],
  );
  const list = rows as any[];
  return list.length ? list[0] : null;
};

export const createEnvio = async (
  data: CrearEnvioDTO & {
    viaje_id: number | null;
    empleado_id: number;
    sucursal_origen_id: number;
    sucursal_destino_id: number;
  },
): Promise<EnvioDTO> => {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO envios (
      tipo_paquete_id,
      cliente_id,
      empleado_id,
      viaje_id,
      sucursal_origen_id,
      sucursal_destino_id,
      descripcion,
      estado_envio,
      peso
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.tipo_paquete_id,
      data.cliente_id,
      data.empleado_id,
      data.viaje_id,
      data.sucursal_origen_id,
      data.sucursal_destino_id,
      data.descripcion || null,
      data.estado_envio || (data.viaje_id ? "registrado" : "en_espera"),
      data.peso,
    ],
  );
  return (await findEnviolById(result.insertId)) as EnvioDTO;
};

export const updateEnvio = async (
  envio_id: number,
  data: EditarEnvioDTO,
): Promise<EnvioDTO> => {
  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE envios SET tipo_paquete_id = ?, viaje_id = ?, sucursal_origen_id = ?, sucursal_destino_id = ?, descripcion = ?, estado_envio = ?, peso = ?, cliente_id = ?
     WHERE envio_id = ?`,
    [
      data.tipo_paquete_id,
      data.viaje_id,
      data.sucursal_origen_id,
      data.sucursal_destino_id,
      data.descripcion || null,
      data.estado_envio || "registrado",
      data.peso,
      data.cliente_id,
      envio_id,
    ],
  );

  if (result.affectedRows === 0) {
    throw new NotFoundError("Envío no encontrado");
  }

  return (await findEnviolById(envio_id)) as EnvioDTO;
};

export const cancelarEnvio = async (envio_id: number): Promise<void> => {
  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE envios SET estado_envio = 'cancelado' WHERE envio_id = ?`,
    [envio_id],
  );
  if (result.affectedRows === 0) {
    throw new NotFoundError("Envío no encontrado");
  }
};

export const getCapacidadDisponibleViaje = async (viajeId: number) => {
  const [rows] = await pool.query(
    `SELECT
      v.viaje_id,
      v.sucursal_origen_id,
      v.sucursal_destino_id,
      CASE
        WHEN t.unidad_medida = 'ton' THEN t.capacidad_carga * 1000
        WHEN t.unidad_medida = 'lb' THEN t.capacidad_carga * 0.453592
        ELSE t.capacidad_carga
      END AS capacidad_kg,
      COALESCE(SUM(CASE WHEN e.estado_envio <> 'cancelado' THEN e.peso ELSE 0 END), 0) AS peso_asignado
     FROM viajes v
     INNER JOIN transportes t ON t.numero_serie = v.numero_serie
     LEFT JOIN envios e ON e.viaje_id = v.viaje_id
     WHERE v.viaje_id = ?
     GROUP BY v.viaje_id, v.sucursal_origen_id, v.sucursal_destino_id, t.capacidad_carga, t.unidad_medida
     LIMIT 1`,
    [viajeId],
  );
  const list = rows as any[];
  return list.length ? list[0] : null;
};

export const getEnviosEnEsperaByRuta = async (
  origenId: number,
  destinoId: number,
) => {
  const [rows] = await pool.query(
    `SELECT envio_id, peso
     FROM envios
     WHERE estado_envio = 'en_espera'
       AND viaje_id IS NULL
       AND sucursal_origen_id = ?
       AND sucursal_destino_id = ?
     ORDER BY envio_id ASC`,
    [origenId, destinoId],
  );
  return rows as { envio_id: number; peso: number }[];
};

export const asignarEnvioAViaje = async (
  envioId: number,
  viajeId: number,
): Promise<boolean> => {
  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE envios
     SET viaje_id = ?, estado_envio = 'registrado'
     WHERE envio_id = ?
       AND viaje_id IS NULL
       AND estado_envio = 'en_espera'`,
    [viajeId, envioId],
  );
  return result.affectedRows > 0;
};
