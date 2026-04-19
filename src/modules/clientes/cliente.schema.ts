import { z } from "zod";

const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
const telefonoRegex = /^\d{10}$/;

export const crearClienteSchema = z.object({
  nombre: z
    .string({ required_error: "El nombre es requerido" })
    .trim()
    .min(2, "Mínimo 2 caracteres")
    .max(60, "Máximo 60 caracteres")
    .regex(soloLetras, "Solo se permiten letras y espacios"),

  apellido_paterno: z
    .string({ required_error: "El apellido paterno es requerido" })
    .min(2, "Mínimo 2 caracteres")
    .max(60, "Máximo 60 caracteres")
    .regex(soloLetras, "Solo se permiten letras y espacios"),

  apellido_materno: z
    .string()
    .max(60, "Máximo 60 caracteres")
    .regex(soloLetras, "Solo se permiten letras y espacios")
    .nullable()
    .optional(),

  correo: z
    .string({ required_error: "El correo es requerido" })
    .max(150, "Máximo 150 caracteres")
    .email("Formato de correo inválido"),

  telefono: z
    .string()
    .regex(telefonoRegex, "El teléfono debe tener exactamente 10 dígitos numéricos")
    .nullable()
    .optional(),
});

export const actualizarClienteSchema = crearClienteSchema.omit({ correo: true });

export type CrearClienteInput = z.infer<typeof crearClienteSchema>;
export type ActualizarClienteInput = z.infer<typeof actualizarClienteSchema>;
