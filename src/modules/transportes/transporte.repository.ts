import { pool } from '../../config/database'
import { CrearTransporteDTO, ActualizarTransporteDTO } from './transporte.dto'

export const getAllTransportes = async () => {
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
  `)
  return rows as any[]
}

export const findTransporteByNumeroSerie = async (numero_serie: string) => {
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
    WHERE t.numero_serie = ?
  `, [numero_serie])
  const list = rows as any[]
  return list.length ? list[0] : null
}

export const createTransporte = async (data: CrearTransporteDTO) => {
  await pool.query(
    `INSERT INTO transportes (numero_serie, empleado_id, subtipo_id, capacidad_carga, unidad_medida, placa)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [data.numero_serie, data.empleado_id, data.subtipo_id, data.capacidad_carga, data.unidad_medida, data.placa ?? null]
  )
  return await findTransporteByNumeroSerie(data.numero_serie)
}

export const updateTransporte = async (numero_serie: string, data: ActualizarTransporteDTO) => {
  const keys = Object.keys(data)
  if (keys.length === 0) return
  const setSql = keys.map((k) => `${k} = ?`).join(', ')
  const values = keys.map((k) => (data as any)[k])
  await pool.query(
    `UPDATE transportes SET ${setSql} WHERE numero_serie = ?`,
    [...values, numero_serie]
  )
  return await findTransporteByNumeroSerie(numero_serie)
}

export const deleteTransporte = async (numero_serie: string) => {
  try {
    const [result] = await pool.query(
      `DELETE FROM transportes WHERE numero_serie = ?`,
      [numero_serie]
    )
    return result
  } catch (error: any) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      throw new Error('No se puede eliminar el transporte porque tiene registros asociados')
    }
    throw error
  }
}

export const getAllTiposTransporte = async () => {
  const [rows] = await pool.query(`SELECT tipo_id, nombre_tipo FROM tipo_transporte ORDER BY nombre_tipo`)
  return rows as any[]
}

export const getAllSubtiposTransporte = async () => {
  const [rows] = await pool.query(`SELECT subtipo_id, tipo_id, nombre_subtipo FROM subtipo_transporte ORDER BY nombre_subtipo`)
  return rows as any[]
}
