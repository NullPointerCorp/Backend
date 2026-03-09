import { z } from "zod";

export const crearAlmacenSchema = z.object({
  nombre_almacen: z
    .string({ required_error: "El nombre es requerido" })
    .transform((val) => val.trim())
    .pipe(
      z.string()
        .min(1, "El nombre es requerido")
        .max(80, "Máximo 80 caracteres")
    ),

  sucursal_id: z
    .number({ required_error: "La sucursal es requerida" })
    .int()
    .positive("Selecciona una sucursal válida"),

  descripcion: z
    .string()
    .transform((val) => val.trim())
    .pipe(z.string().max(255, "Máximo 255 caracteres"))
    .nullish()
    .or(z.literal("")),
});

export const actualizarAlmacenSchema = z.object({
  nombre_almacen: z
    .string()
    .transform((val) => val.trim())
    .pipe(
      z.string()
        .min(1, "El nombre es requerido")
        .max(80, "Máximo 80 caracteres")
    ),

  descripcion: z
    .string()
    .transform((val) => val.trim())
    .pipe(z.string().max(255, "Máximo 255 caracteres"))
    .nullish()
    .or(z.literal("")),
});