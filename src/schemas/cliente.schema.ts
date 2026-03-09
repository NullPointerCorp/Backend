import { z } from "zod";

const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
const telefonoRegex = /^\d{10}$/;

export const crearClienteSchema = z.object({
  nombre: z
    .string({ required_error: "El nombre es requerido" })
    .transform((val) => val.trim())
    .pipe(
      z.string()
        .min(2, "Mínimo 2 caracteres")
        .max(60, "Máximo 60 caracteres")
        .regex(soloLetras, "Solo se permiten letras y espacios")
    ),

  apellido_paterno: z
    .string({ required_error: "El apellido paterno es requerido" })
    .transform((val) => val.trim())
    .pipe(
      z.string()
        .min(2, "Mínimo 2 caracteres")
        .max(60, "Máximo 60 caracteres")
        .regex(soloLetras, "Solo se permiten letras y espacios")
    ),

  apellido_materno: z
    .string()
    .transform((val) => val.trim())
    .pipe(
      z.string()
        .max(60, "Máximo 60 caracteres")
        .refine(
          (val) => val === "" || soloLetras.test(val),
          "Solo se permiten letras y espacios"
        )
    )
    .nullish()
    .or(z.literal("")),

  correo: z
    .string({ required_error: "El correo es requerido" })
    .transform((val) => val.trim().toLowerCase())
    .pipe(
      z.string()
        .email("Formato de correo inválido")
        .max(150, "Máximo 150 caracteres")
    ),

  telefono: z
    .string({ required_error: "El teléfono es requerido" })
    .regex(telefonoRegex, "El teléfono debe tener 10 dígitos"),
});

export const actualizarClienteSchema = crearClienteSchema.omit({ correo: true });

export const buscarCorreoSchema = z.object({
  correo: z.string().email("Correo inválido"),
});