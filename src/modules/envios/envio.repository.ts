import { pool } from "../../config/database";
import { EnvioDTO, CrearEnvioDTO, EditarEnvioDTO, EnvioConsultaDTO } from "./envio.dto";
import { ResultSetHeader } from "mysql2/promise";
import { NotFoundError } from "../../errors/http-errors";

export const getAllEnvios = async (): Promise<EnvioConsultaDTO[]> => {
  const [rows] = await pool.query(
    `SELECT envio_id, c.correo, e.descripcion, tp.tamanio, tp.forma, e.peso, CONCAT(em.nombre,' ',em.apellido_paterno) AS nombre_empleado, t.numero_serie, st.nombre_subtipo, e.fecha_salida, e.fecha_llegada, s_origen.nombre_sucursal AS origen, s_destino.nombre_sucursal AS destino, e.estado_envio
    FROM envios e
    INNER JOIN transportes t on t.numero_serie = e.numero_serie
    INNER JOIN tipo_paquetes tp on tp.tipo_paquete_id = e.tipo_paquete_id
    INNER JOIN empleados em on em.empleado_id = t.empleado_id
    LEFT JOIN sucursales s_origen on s_origen.sucursal_id = e.origen_id
    INNER JOIN sucursales s_destino on s_destino.sucursal_id = e.destino_id
    INNER JOIN subtipo_transporte st on st.subtipo_id = t.subtipo_id
    INNER JOIN clientes c on c.cliente_id = e.cliente_id
    ORDER BY envio_id`,
  );
  return rows as EnvioConsultaDTO[];
};

export const findEnviolById = async (
  envio_id: number,
): Promise<EnvioDTO | null> => {
  const [rows] = await pool.query(
    `SELECT envio_id, tipo_paquete_id, numero_serie, descripcion, fecha_salida, fecha_llegada, estado_envio, peso, origen_id, destino_id, cliente_id
     FROM envios
     WHERE envio_id = ?`,
    [envio_id],
  );
  const list = rows as EnvioDTO[];
  return list.length ? list[0] : null;
};

export const getSucursalIdByFirebaseUid = async (uid: string): Promise<number | null> => {
  const [rows] = await pool.query(
    `SELECT sucursal_id FROM empleados WHERE firebase_uid = ? LIMIT 1`,
    [uid]
  );
  const list = rows as { sucursal_id: number }[];
  return list.length ? list[0].sucursal_id : null;
};

export const createEnvio = async (data: CrearEnvioDTO): Promise<EnvioDTO> => {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO envios (tipo_paquete_id, numero_serie, descripcion, fecha_salida, fecha_llegada, estado_envio, peso, origen_id, destino_id, cliente_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.tipo_paquete_id,
      data.numero_serie,
      data.descripcion || null,
      data.fecha_salida || null,
      data.fecha_llegada || null,
      data.estado_envio || "registrado",
      data.peso,
      data.origen_id || null,
      data.destino_id,
      data.cliente_id,
    ],
  );
  return (await findEnviolById(result.insertId)) as EnvioDTO;
};

export const updateEnvio = async (
  envio_id: number,
  data: EditarEnvioDTO,
): Promise<EnvioDTO> => {
  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE envios SET tipo_paquete_id = ?, numero_serie = ?, descripcion = ?, fecha_salida = ?, fecha_llegada = ?, estado_envio = ?, peso = ?, origen_id = ?, destino_id = ?, cliente_id = ?
     WHERE envio_id = ?`,
    [
      data.tipo_paquete_id,
      data.numero_serie,
      data.descripcion || null,
      data.fecha_salida || null,
      data.fecha_llegada || null,
      data.estado_envio || "registrado",
      data.peso,
      data.origen_id || null,
      data.destino_id,
      data.cliente_id,
      envio_id,
    ],
  );

  if (result.affectedRows === 0) {
    throw new NotFoundError("Envío no encontrado");
  }

  return (await findEnviolById(envio_id)) as EnvioDTO;
};
