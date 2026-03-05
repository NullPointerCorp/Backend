import { pool } from "../../config/database";

export const getAllEmpleados = async () => {
  const [rows] = await pool.query(`
    SELECT empleado_id, nombre, correo, rol_id, sucursal_id, is_locked, last_login_at
    FROM empleados
  `);
  return rows;
};

export const getSupervisores = async () => {
  const [rows] = await pool.query(
    `SELECT empleado_id, nombre, apellido_paterno
     FROM empleados
     WHERE rol_id = 2
     ORDER BY nombre`
  )
  return rows as any[]
}

export const getTransportistas = async () => {
  const [rows] = await pool.query(
    `SELECT empleado_id, nombre, apellido_paterno
     FROM empleados
     WHERE rol_id = 4
     ORDER BY nombre`
  )
  return rows as any[]
}

export const findEmpleadoById = async (empleadoId: number) => {
  const [rows] = await pool.query(
    `SELECT * FROM empleados WHERE empleado_id = ? LIMIT 1`,
    [empleadoId]
  );
  const list = rows as any[];
  return list.length ? list[0] : null;
};

export const findEmpleadoByCorreo = async (correo: string) => {
  const [rows] = await pool.query(
    `SELECT * FROM empleados WHERE correo = ? LIMIT 1`,
    [correo]
  );
  const list = rows as any[];
  return list.length ? list[0] : null;
};

export const findEmpleadoByFirebaseUid = async (uid: string) => {
  const [rows] = await pool.query(
    `SELECT e.empleado_id, e.nombre, e.correo, e.is_locked, r.id_rol, r.nombre_rol AS rol
      FROM empleados e
      INNER JOIN roles r ON e.rol_id = r.id_rol
      WHERE e.firebase_uid = ?
      LIMIT 1`,
    [uid]
  );
  const list = rows as any[];
  return list.length ? list[0] : null;
};

export const insertEmpleado = async (data: {
  nombre: string;
  correo: string;
  rol_id: number;
  sucursal_id: number | null;
  firebase_uid: string;
}) => {
  const [result] = await pool.query(
    `INSERT INTO empleados (nombre, correo, rol_id, sucursal_id, firebase_uid)
      VALUES (?, ?, ?, ?, ?)`,
    [data.nombre, data.correo, data.rol_id, data.sucursal_id, data.firebase_uid]
  );
  const r: any = result;
  return { empleado_id: r.insertId, firebase_uid: data.firebase_uid };
};

export const updateEmpleado = async (empleadoId: number, patch: any) => {
  // patch armado dinámicamente
  const keys = Object.keys(patch);
  if (keys.length === 0) return;

  const setSql = keys.map((k) => `${k} = ?`).join(", ");
  const values = keys.map((k) => patch[k]);

  await pool.query(
    `UPDATE empleados SET ${setSql} WHERE empleado_id = ?`,
    [...values, empleadoId]
  );
};

export const deleteEmpleado = async (empleadoId: number) => {
  await pool.query(`DELETE FROM empleados WHERE empleado_id = ?`, [empleadoId]);
};

/**
 * Seguridad login: buscar estado de bloqueo por correo (neutral)
 */
export const getEmpleadoSecurityByCorreo = async (correo: string) => {
  const [rows] = await pool.query(
    `SELECT empleado_id, is_locked, locked_until, failed_login_attempts
      FROM empleados
      WHERE correo = ?
      LIMIT 1`,
    [correo],
  );

  const list = rows as any[];
  if (list.length === 0) {
    return {
      exists: false,
      empleado_id: null,
      is_locked: false,
      locked_until: null,
      failed_login_attempts: 0,
    };
  }

  const e = list[0];
  return {
    exists: true,
    empleado_id: e.empleado_id,
    is_locked: Boolean(e.is_locked),
    locked_until: e.locked_until,
    failed_login_attempts: Number(e.failed_login_attempts ?? 0),
  };
};

export const recordLoginFailedByCorreo = async (
  correo: string,
  maxAttempts = 3,
  lockMinutes = 15,
) => {
  const [rows] = await pool.query(
    `SELECT empleado_id, failed_login_attempts
      FROM empleados
      WHERE correo = ?
      LIMIT 1`,
    [correo],
  );

  const list = rows as any[];
  if (list.length === 0) return;

  const empleado_id = Number(list[0].empleado_id);
  const current = Number(list[0].failed_login_attempts ?? 0);
  const nextAttempts = current + 1;

  if (nextAttempts >= maxAttempts) {
    await pool.query(
      `UPDATE empleados
      SET failed_login_attempts = ?,
        last_failed_login_at = NOW(),
        locked_until = DATE_ADD(NOW(), INTERVAL ? MINUTE),
        lock_reason = 'Too many failed login attempts'
      WHERE empleado_id = ?`,
      [nextAttempts, lockMinutes, empleado_id],
    );
  } else {
    await pool.query(
      `UPDATE empleados
      SET failed_login_attempts = ?,
          last_failed_login_at = NOW()
      WHERE empleado_id = ?`,
      [nextAttempts, empleado_id],
    );
  }
};

export const recordLoginSuccessByFirebaseUid = async (uid: string) => {
  await pool.query(
    `UPDATE empleados
    SET failed_login_attempts = 0,
        locked_until = NULL,
        lock_reason = NULL,
        last_login_at = NOW()
    WHERE firebase_uid = ?`,
    [uid],
  );
};