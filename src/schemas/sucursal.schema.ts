import { z } from "zod";

const codigoPostalRegex = /^\d{5}$/;

export const crearSucursalSchema = z.object({
  nombre_sucursal: z
    .string({ required_error: "El nombre es requerido" })
    .transform((val) => val.trim())
    .pipe(
      z.string()
        .min(1, "El nombre es requerido")
        .max(80, "Máximo 80 caracteres")
    ),

  ciudad_id: z
    .number({ required_error: "La ciudad es requerida" })
    .int()
    .positive("Selecciona una ciudad válida"),

  colonia: z
    .string({ required_error: "La colonia es requerida" })
    .transform((val) => val.trim())
    .pipe(
      z.string()
        .min(1, "La colonia es requerida")
        .max(100, "Máximo 100 caracteres")
    ),

  codigo_postal: z
    .string({ required_error: "El código postal es requerido" })
    .regex(codigoPostalRegex, "Debe tener exactamente 5 dígitos"),

  calle: z
    .string({ required_error: "La calle es requerida" })
    .transform((val) => val.trim())
    .pipe(
      z.string()
        .min(1, "La calle es requerida")
        .max(100, "Máximo 100 caracteres")
    ),

  numero_exterior: z
    .string({ required_error: "El número exterior es requerido" })
    .transform((val) => val.trim())
    .pipe(
      z.string()
        .min(1, "El número exterior es requerido")
        .max(10, "Máximo 10 caracteres")
    ),

  // Opcionales - usan undefined, NO null (compatible con tu DTO)
  numero_interior: z
    .string()
    .transform((val) => val.trim())
    .pipe(z.string().max(10, "Máximo 10 caracteres"))
    .optional(),

  longitud: z
    .number()
    .min(-180, "Longitud inválida")
    .max(180, "Longitud inválida")
    .optional(),

  latitud: z
    .number()
    .min(-90, "Latitud inválida")
    .max(90, "Latitud inválida")
    .optional(),

  empleado_id_supervisor: z
    .number()
    .int()
    .positive()
    .optional(),
});

export const actualizarSucursalSchema = crearSucursalSchema.partial();

export const ciudadIdSchema = z.object({
  ciudad_id: z.string().regex(/^\d+$/, "ID de ciudad inválido").transform(Number),
});