import { z } from "zod";


const trimString = z.string().trim();
const email = z.string().trim().toLowerCase().email("Correo inválido");

const nullableInt = z
    .union([z.number().int().positive(), z.string().regex(/^\d+$/)])
    .transform((v) => (typeof v === "string" ? Number(v) : v))
    .nullable();


const intFromAny = z
    .union([z.number().int(), z.string().regex(/^\d+$/)])
    .transform((v) => (typeof v === "string" ? Number(v) : v));

const nullableText = z
  .union([z.string(), z.null()])
  .transform((v) => (typeof v === "string" ? v.trim() : v))
  .transform((v) => (v === "" ? null : v));

const password = z.string().min(8, "La contraseña debe tener al menos 8 caracteres").max(100, "Contraseña demasiado larga");

export const empleadoIdParamSchema = z.object({
    id: z
    .union([z.string().regex(/^\d+$/), z.number().int()])
    .transform((v) => Number(v))
    .refine((v) => Number.isInteger(v) && v > 0, "id inválido"),
});

export const crearEmpleadoSchema = z.object({
    nombre: trimString.min(2, "Nombre muy corto").max(80, "Nombre muy largo"),
    apellido_paterno: trimString.min(2, "Apellido paterno muy corto").max(80, "Apellido paterno muy largo"),
    apellido_materno: nullableText.optional().default(null),
    correo: email,
    contrasena: password.optional(),
    telefono: trimString
    .optional()
    .nullable()
    .refine((v) => v == null || /^[0-9+\-\s]{7,20}$/.test(v), "Teléfono inválido"),
    rol_id: intFromAny.refine((v) => v > 0, "rol_id inválido"),
    sucursal_id: nullableInt.optional().default(null),
    estado_id: nullableInt.optional().default(null),
    ciudad_id: nullableInt.optional().default(null),
    colonia: nullableText.optional().default(null),
    codigo_postal: nullableText
        .optional()
        .default(null)
        .refine((v) => v == null || /^[0-9]{4,10}$/.test(v), "Código postal inválido"),
    calle: nullableText.optional().default(null),
    numero_exterior: nullableText.optional().default(null),
    numero_interior: nullableText.optional().default(null),
  })
  .passthrough();

export const editarEmpleadoSchema = z
    .object({
    nombre: trimString.min(2).max(80).optional(),
    apellido_paterno: trimString.min(2).max(80).optional(),
    apellido_materno: nullableText.optional(),
    correo: email.optional(),
    contrasena: password.optional(),
    telefono: z
    .string()
    .trim()
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .refine((v) => v == null || (typeof v === "string" && /^[0-9+\-\s]{7,20}$/.test(v)), "Teléfono inválido")
    .optional(),

    rol_id: intFromAny.refine((v) => v > 0, "rol_id inválido").optional(),
    sucursal_id: nullableInt.optional(),
    estado_id: nullableInt.optional(),
    ciudad_id: nullableInt.optional(),
    colonia: nullableText.optional(),
    codigo_postal: nullableText
      .optional()
      .refine((v) => v == null || /^[0-9]{4,10}$/.test(v), "Código postal inválido"),
    calle: nullableText.optional(),
    numero_exterior: nullableText.optional(),
    numero_interior: nullableText.optional(),
    is_locked: z.boolean().optional(),
    })
  .passthrough();