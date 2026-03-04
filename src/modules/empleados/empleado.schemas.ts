import { z } from "zod";

// Helpers
const trimString = z.string().trim();
const email = z.string().trim().toLowerCase().email("Correo inválido");

// Si manejas sucursal_id opcional:
const nullableInt = z
    .union([z.number().int().positive(), z.string().regex(/^\d+$/)])
    .transform((v) => (typeof v === "string" ? Number(v) : v))
    .nullable();

// rol_id requerido como int positivo
const intFromAny = z
    .union([z.number().int(), z.string().regex(/^\d+$/)])
    .transform((v) => (typeof v === "string" ? Number(v) : v));

export const empleadoIdParamSchema = z.object({
    id: z
    .union([z.string().regex(/^\d+$/), z.number().int()])
    .transform((v) => Number(v))
    .refine((v) => Number.isInteger(v) && v > 0, "id inválido"),
});

export const crearEmpleadoSchema = z.object({
    nombre: trimString.min(2, "Nombre muy corto").max(80, "Nombre muy largo"),
    apellidos: trimString.min(2, "Apellidos muy cortos").max(120, "Apellidos muy largos"),
    correo: email,
    telefono: trimString
    .optional()
    .nullable()
    .refine(
        (v) => v == null || /^[0-9+\-\s]{7,20}$/.test(v),
        "Teléfono inválido"
    ),

    rol_id: intFromAny.refine((v) => v > 0, "rol_id inválido"),

  // Si lo tienes en tabla:
    sucursal_id: nullableInt.optional().default(null),

  // Si manejas ciudad_id:
    ciudad_id: nullableInt.optional().default(null),
});

export const editarEmpleadoSchema = z
    .object({
    nombre: trimString.min(2).max(80).optional(),
    apellidos: trimString.min(2).max(120).optional(),
    correo: email.optional(),
    telefono: z
    .string()
    .trim()
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .refine(
        (v) => v == null || (typeof v === "string" && /^[0-9+\-\s]{7,20}$/.test(v)),
        "Teléfono inválido"
    )
    .optional(),

    rol_id: intFromAny.refine((v) => v > 0, "rol_id inválido").optional(),

    sucursal_id: nullableInt.optional(),
    ciudad_id: nullableInt.optional(),

    // Para bloquear/desbloquear manual
    is_locked: z.boolean().optional(),
    })
    .strict();