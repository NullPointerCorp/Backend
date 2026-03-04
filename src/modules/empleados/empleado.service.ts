import admin from "../../config/firebase";
import {
  deleteEmpleado,
  findEmpleadoByCorreo,
  findEmpleadoById,
  insertEmpleado,
  updateEmpleado,
} from "./empleado.repository";
import { CrearEmpleadoDTO, EditarEmpleadoDTO } from "./empleado.dto";

export const makeTempPassword = (length = 12) => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
  let out = "";
  for (let i = 0; i < length; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
};

export const crearEmpleadoService = async (dto: CrearEmpleadoDTO) => {
  const correo = dto.correo.trim().toLowerCase();

  // evita duplicados en BD
  const exists = await findEmpleadoByCorreo(correo);
  if (exists) {
    return { error: "Ya existe un empleado con ese correo" as const };
  }

  // 1) Crear usuario en Firebase
  const tempPassword = makeTempPassword();
  const user = await admin.auth().createUser({
    email: correo,
    password: tempPassword,
    displayName: dto.nombre,
    disabled: false,
  });

  try {
    // 2) Insertar en MySQL con firebase_uid
    const created = await insertEmpleado({
      nombre: dto.nombre,
      correo,
      rol_id: Number(dto.rol_id),
      sucursal_id: dto.sucursal_id != null ? Number(dto.sucursal_id) : null,
      firebase_uid: user.uid,
    });

    // 3) Link reset password para que el empleado ponga su contraseña
    const resetLink = await admin.auth().generatePasswordResetLink(correo);

    return {
      ok: true as const,
      empleado_id: created.empleado_id,
      firebase_uid: created.firebase_uid,
      reset_password_link: resetLink,
    };
  } catch (e) {
    // rollback: borrar usuario Firebase si MySQL falló
    await admin.auth().deleteUser(user.uid).catch(() => {});
    throw e;
  }
};

export const editarEmpleadoService = async (empleadoId: number, dto: EditarEmpleadoDTO) => {
  const empleado = await findEmpleadoById(empleadoId);
  if (!empleado) return { error: "Empleado no encontrado" as const };

  const patch: any = {};

  if (dto.nombre != null) patch.nombre = dto.nombre;
  if (dto.correo != null) patch.correo = dto.correo.trim().toLowerCase();
  if (dto.rol_id != null) patch.rol_id = Number(dto.rol_id);
  if (dto.sucursal_id !== undefined) patch.sucursal_id = dto.sucursal_id != null ? Number(dto.sucursal_id) : null;
  if (dto.is_locked != null) patch.is_locked = dto.is_locked ? 1 : 0;

  await updateEmpleado(empleadoId, patch);

  // si quieres sincronizar lock con Firebase:
  if (dto.is_locked != null && empleado.firebase_uid) {
    await admin.auth().updateUser(empleado.firebase_uid, { disabled: !!dto.is_locked }).catch(() => {});
  }

  return { ok: true as const };
};

export const eliminarEmpleadoService = async (empleadoId: number) => {
  const empleado = await findEmpleadoById(empleadoId);
  if (!empleado) return { error: "Empleado no encontrado" as const };

  // 1) borrar de BD
  await deleteEmpleado(empleadoId);

  // 2) opcional: borrar o deshabilitar en Firebase
  if (empleado.firebase_uid) {
    // preferible: deshabilitar en lugar de borrar (depende tu política)
    await admin.auth().updateUser(empleado.firebase_uid, { disabled: true }).catch(() => {});
  }

  return { ok: true as const };
};