import { ResultSetHeader } from "mysql2/promise";
import { pool } from "../../config/database";

export type EmpleadoListadoRow = {
  empleado_id: number;
  nombre: string;
  apellido_paterno: string | null;
  apellido_materno: string | null;
  telefono: string | null;
  correo: string;
  estado: string | null;
  ciudad_id: number | null;
  ciudad: string | null;
  colonia: string | null;
  codigo_postal: string | null;
  calle: string | null;
  numero_exterior: string | null;
  numero_interior: string | null;
  rol_id: number;
  rol_nombre: string;
  sucursal_id: number | null;
  sucursal_nombre: string | null;
  is_locked: number;
  last_login_at: string | null;
};

const empleadoSelect = `SELECT
  e.empleado_id,
  e.nombre,
  e.apellido_paterno,
  e.apellido_materno,
  e.telefono,
  e.correo,
  c.estado_id,
  est.nombre_estado AS estado,
  e.ciudad_id,
  c.nombre_ciudad AS ciudad,
  e.colonia,
  e.codigo_postal,
  e.calle,
  e.numero_exterior,
  e.numero_interior,
  e.rol_id,
  r.rol_nombre AS rol_nombre,
  e.sucursal_id,
  s.nombre_sucursal AS sucursal_nombre,
  e.is_locked,
  e.last_login_at
FROM empleados e
INNER JOIN roles r ON e.rol_id = r.rol_id
LEFT JOIN sucursales s ON e.sucursal_id = s.sucursal_id
LEFT JOIN ciudades c ON e.ciudad_id = c.ciudad_id
LEFT JOIN estados est ON c.estado_id = est.estado_id`;

export const getAllEmpleados = async () => {
  try {
    const [rows] = await pool.query(`${empleadoSelect} ORDER BY e.empleado_id ASC`);
    return rows as EmpleadoListadoRow[];
  } catch (error: any) {
    console.error("Error al obtener empleados:", error);
    throw new Error("Error al obtener la lista de empleados");
  }
};

export const getEmpleadoById = async (empleadoId: number) => {
  try {
    const [rows] = await pool.query(
      `${empleadoSelect} WHERE e.empleado_id = ? LIMIT 1`,
      [empleadoId]
    );
    const list = rows as EmpleadoListadoRow[];
    return list.length ? list[0] : null;
  } catch (error: any) {
    console.error("Error al buscar empleado por ID:", error);
    throw new Error("Error al buscar el empleado");
  }
};

export const getRolesCatalogo = async () => {
  try {
    const [rows] = await pool.query(
      `SELECT rol_id, rol_nombre
       FROM roles
       ORDER BY rol_nombre`
    );
    return rows as { rol_id: number; nombre: string }[];
  } catch (error: any) {
    console.error("Error al obtener catálogo de roles:", error);
    throw new Error("Error al obtener los roles");
  }
};

export const getSucursalesCatalogo = async () => {
  try {
    const [rows] = await pool.query(
      `SELECT sucursal_id, nombre_sucursal AS nombre
       FROM sucursales
       ORDER BY nombre_sucursal`
    );
    return rows as { sucursal_id: number; nombre: string }[];
  } catch (error: any) {
    console.error("Error al obtener catálogo de sucursales:", error);
    throw new Error("Error al obtener las sucursales");
  }
};

export const getSupervisores = async () => {
  try {
    const [rows] = await pool.query(
      `SELECT empleado_id, nombre, apellido_paterno
       FROM empleados
       WHERE rol_id = 2
       ORDER BY nombre`
    );
    return rows as any[];
  } catch (error: any) {
    console.error("Error al obtener supervisores:", error);
    throw new Error("Error al obtener los supervisores");
  }
};

export const getTransportistas = async () => {
  try {
    const [rows] = await pool.query(
      `SELECT empleado_id, nombre, apellido_paterno
       FROM empleados
       WHERE rol_id = 4
       ORDER BY nombre`
    );
    return rows as any[];
  } catch (error: any) {
    console.error("Error al obtener transportistas:", error);
    throw new Error("Error al obtener los transportistas");
  }
};

export const findEmpleadoById = async (empleadoId: number) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM empleados WHERE empleado_id = ? LIMIT 1`,
      [empleadoId]
    );
    const list = rows as any[];
    return list.length ? list[0] : null;
  } catch (error: any) {
    console.error("Error al buscar empleado (findById):", error);
    throw new Error("Error al buscar el empleado");
  }
};

export const findEmpleadoByCorreo = async (correo: string) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM empleados WHERE correo = ? LIMIT 1`,
      [correo]
    );
    const list = rows as any[];
    return list.length ? list[0] : null;
  } catch (error: any) {
    console.error("Error al buscar empleado por correo:", error);
    throw new Error("Error al buscar el empleado");
  }
};

export const findEmpleadoByFirebaseUid = async (uid: string) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
        e.empleado_id, 
        e.nombre, 
        e.correo, 
        e.is_locked, 
        r.rol_id, 
        r.rol_nombre AS rol
       FROM empleados e
       INNER JOIN roles r ON e.rol_id = r.rol_id
       WHERE e.firebase_uid = ?
       LIMIT 1`,
      [uid]
    );
    const list = rows as any[];
    return list.length ? list[0] : null;
  } catch (error: any) {
    console.error("Error al buscar empleado por Firebase UID:", error);
    throw new Error("Error al buscar el empleado");
  }
};

export const insertEmpleado = async (data: {
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string | null;
  telefono: string | null;
  correo: string;
  contrasena_hash: string;
  rol_id: number;
  sucursal_id: number | null;
  ciudad_id: number | null;
  colonia: string | null;
  codigo_postal: string | null;
  calle: string | null;
  numero_exterior: string | null;
  numero_interior: string | null;
  firebase_uid: string;
}) => {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO empleados (
        nombre, apellido_paterno, apellido_materno, telefono, correo, contrasena,
        rol_id, sucursal_id, ciudad_id, colonia, codigo_postal, calle, numero_exterior, numero_interior, firebase_uid
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.nombre,
        data.apellido_paterno,
        data.apellido_materno,
        data.telefono,
        data.correo,
        data.contrasena_hash,
        data.rol_id,
        data.sucursal_id,
        data.ciudad_id,
        data.colonia,
        data.codigo_postal,
        data.calle,
        data.numero_exterior,
        data.numero_interior,
        data.firebase_uid,
      ]
    );
    return { empleado_id: result.insertId, firebase_uid: data.firebase_uid };
  } catch (error: any) {
    console.error("Error al insertar empleado:", error);
    if (error.code === "ER_DUP_ENTRY") {
      throw new Error("Ya existe un empleado con ese correo");
    }
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      throw new Error("El rol, sucursal o ciudad seleccionada no existe");
    }
    throw new Error("Error al registrar el empleado");
  }
};

export const updateEmpleado = async (
  empleadoId: number,
  patch: Record<string, unknown>
) => {
  try {
    const keys = Object.keys(patch);
    if (keys.length === 0) return;

    const setSql = keys.map((k) => `${k} = ?`).join(", ");
    const values = keys.map((k) => patch[k]);

    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE empleados SET ${setSql} WHERE empleado_id = ?`,
      [...values, empleadoId]
    );

    if (result.affectedRows === 0) throw new Error("Empleado no encontrado");
  } catch (error: any) {
    if (error.message === "Empleado no encontrado") throw error;
    console.error("Error al actualizar empleado:", error);
    if (error.code === "ER_DUP_ENTRY") {
      throw new Error("Ya existe un empleado con ese correo");
    }
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      throw new Error("El rol, sucursal o ciudad seleccionada no existe");
    }
    throw new Error("Error al actualizar el empleado");
  }
};

export const deleteEmpleado = async (empleadoId: number) => {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      `DELETE FROM empleados WHERE empleado_id = ?`,
      [empleadoId]
    );
    if (result.affectedRows === 0) throw new Error("Empleado no encontrado");
    return result;
  } catch (error: any) {
    if (error.message === "Empleado no encontrado") throw error;
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      throw new Error("No se puede eliminar el empleado porque tiene registros asociados");
    }
    console.error("Error al eliminar empleado:", error);
    throw new Error("Error al eliminar el empleado");
  }
};

/**
 * Seguridad login: buscar estado de bloqueo por correo (neutral)
 */
export const getEmpleadoSecurityByCorreo = async (correo: string) => {
  try {
    const [rows] = await pool.query(
      `SELECT empleado_id, is_locked, locked_until, failed_login_attempts
       FROM empleados
       WHERE correo = ?
       LIMIT 1`,
      [correo]
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
  } catch (error: any) {
    console.error("Error al consultar seguridad de empleado:", error);
    throw new Error("Error al verificar el estado de la cuenta");
  }
};

export const recordLoginFailedByCorreo = async (
  correo: string,
  maxAttempts = 3,
  lockMinutes = 15
) => {
  try {
    const [rows] = await pool.query(
      `SELECT empleado_id, failed_login_attempts
       FROM empleados
       WHERE correo = ?
       LIMIT 1`,
      [correo]
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
        [nextAttempts, lockMinutes, empleado_id]
      );
    } else {
      await pool.query(
        `UPDATE empleados
         SET failed_login_attempts = ?,
             last_failed_login_at = NOW()
         WHERE empleado_id = ?`,
        [nextAttempts, empleado_id]
      );
    }
  } catch (error: any) {
    console.error("Error al registrar intento fallido de login:", error);
  }
};

export const recordLoginSuccessByFirebaseUid = async (uid: string) => {
  try {
    await pool.query(
      `UPDATE empleados
       SET failed_login_attempts = 0,
           locked_until = NULL,
           lock_reason = NULL,
           last_login_at = NOW()
       WHERE firebase_uid = ?`,
      [uid]
    );
  } catch (error: any) {
    console.error("Error al registrar login exitoso:", error);
  }
};
