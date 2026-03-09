import admin from "../../config/firebase";

import {
  deleteEmpleado,
  findEmpleadoByCorreo,
  findEmpleadoById,
  getEmpleadoById,
  insertEmpleado,
  updateEmpleado,
} from "./empleado.repository";
import { CrearEmpleadoDTO, EditarEmpleadoDTO } from "./empleado.dto";
import { hashPassword } from "./password.util";

export const makeTempPassword = (length = 12) => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
  let out = "";
  for (let i = 0; i < length; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
};

const hasAddressPayload = (dto: Partial<CrearEmpleadoDTO | EditarEmpleadoDTO>) =>
  dto.colonia != null ||
  dto.codigo_postal != null ||
  dto.calle != null ||
  dto.numero_exterior != null ||
  dto.numero_interior != null;

const validateAddressConsistency = (dto: Partial<CrearEmpleadoDTO | EditarEmpleadoDTO>) => {
  if (hasAddressPayload(dto) && dto.ciudad_id == null) {
    return "ciudad_id es obligatorio cuando se envían datos de dirección" as const;
  }

  return null;
};

export const crearEmpleadoService = async (dto: CrearEmpleadoDTO) => {
  const correo = dto.correo.trim().toLowerCase();

  const exists = await findEmpleadoByCorreo(correo);
  if (exists) {
    return { error: "Ya existe un empleado con ese correo" as const };
  }

  const addressError = validateAddressConsistency(dto);
  if (addressError) return { error: addressError };

  const tempPassword = makeTempPassword();
  const plainPassword = dto.contrasena?.trim() || tempPassword;
  const passwordHash = await hashPassword(plainPassword);

  const user = await admin.auth().createUser({
    email: correo,
    password: plainPassword,
    displayName: `${dto.nombre} ${dto.apellido_paterno}`,
    disabled: false,
  });

  try {
    const created = await insertEmpleado({
      nombre: dto.nombre,
      apellido_paterno: dto.apellido_paterno,
      apellido_materno: dto.apellido_materno ?? null,
      telefono: dto.telefono ?? null,
      correo,
      contrasena_hash: passwordHash,
      rol_id: Number(dto.rol_id),
      sucursal_id: dto.sucursal_id != null ? Number(dto.sucursal_id) : null,
      ciudad_id: dto.ciudad_id != null ? Number(dto.ciudad_id) : null,
      colonia: dto.colonia ?? null,
      codigo_postal: dto.codigo_postal ?? null,
      calle: dto.calle ?? null,
      numero_exterior: dto.numero_exterior ?? null,
      numero_interior: dto.numero_interior ?? null,
      firebase_uid: user.uid,
    });

    const resetLink = await admin.auth().generatePasswordResetLink(correo);
    const saved = await getEmpleadoById(created.empleado_id);

    return {
      ok: true as const,
        message: "Empleado creado correctamente",
      data: {
        ...saved,
        reset_password_link: resetLink,
      },
    };
  } catch (e) {
    await admin.auth().deleteUser(user.uid).catch(() => {});
    throw e;
  }
};

export const editarEmpleadoService = async (empleadoId: number, dto: EditarEmpleadoDTO) => {
  const empleado = await findEmpleadoById(empleadoId);
  if (!empleado) return { error: "Empleado no encontrado" as const };

  const addressError = validateAddressConsistency(dto);
  if (addressError) return { error: addressError };

  const patch: Record<string, unknown> = {};

  if (dto.nombre != null) patch.nombre = dto.nombre;
  if (dto.apellido_paterno != null) patch.apellido_paterno = dto.apellido_paterno;
  if (dto.apellido_materno !== undefined) patch.apellido_materno = dto.apellido_materno;
  if (dto.telefono !== undefined) patch.telefono = dto.telefono;
  if (dto.correo != null) patch.correo = dto.correo.trim().toLowerCase();
  if (dto.rol_id != null) patch.rol_id = Number(dto.rol_id);
  if (dto.sucursal_id !== undefined) patch.sucursal_id = dto.sucursal_id != null ? Number(dto.sucursal_id) : null;
  if (dto.ciudad_id !== undefined) patch.ciudad_id = dto.ciudad_id != null ? Number(dto.ciudad_id) : null;
  if (dto.colonia !== undefined) patch.colonia = dto.colonia;
  if (dto.codigo_postal !== undefined) patch.codigo_postal = dto.codigo_postal;
  if (dto.calle !== undefined) patch.calle = dto.calle;
  if (dto.numero_exterior !== undefined) patch.numero_exterior = dto.numero_exterior;
  if (dto.numero_interior !== undefined) patch.numero_interior = dto.numero_interior;
  if (dto.is_locked != null) patch.is_locked = dto.is_locked ? 1 : 0;

  if (dto.contrasena) {
    const plainPassword = dto.contrasena.trim();
    patch.contrasena = await hashPassword(plainPassword);

    if (empleado.firebase_uid) {
      await admin.auth().updateUser(empleado.firebase_uid, { password: plainPassword }).catch(() => {});
    }
  }

  await updateEmpleado(empleadoId, patch);

  if (dto.is_locked != null && empleado.firebase_uid) {
    await admin.auth().updateUser(empleado.firebase_uid, { disabled: !!dto.is_locked }).catch(() => {});
  }

  const actualizado = await getEmpleadoById(empleadoId);
  return { ok: true as const, message: "Empleado actualizado correctamente", data: actualizado };
};

export const eliminarEmpleadoService = async (empleadoId: number) => {
  const empleado = await findEmpleadoById(empleadoId);
  if (!empleado) return { error: "Empleado no encontrado" as const };

  try {
    await deleteEmpleado(empleadoId);
  } catch (error: any) {
    if (error?.code === "ER_ROW_IS_REFERENCED_2" || error?.errno === 1451) {
      return {
        error: "No se puede eliminar el empleado porque tiene registros relacionados." as const,
        code: "FK_CONSTRAINT" as const,
      };
    }
    throw error;
  }

  if (empleado.firebase_uid) {
    await admin.auth().updateUser(empleado.firebase_uid, { disabled: true }).catch(() => {});
  }

  return { ok: true as const };
};