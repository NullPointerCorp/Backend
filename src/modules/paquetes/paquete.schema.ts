import { z } from "zod";

const tamanioValidos = ['Pequeño', 'Mediano', 'Grande', 'Extra Grande'] as const;
const formaValidos = ['Cuadrada', 'Rectangular', 'Circular'] as const;

export const crearPaqueteSchema = z.object({
  cliente_id: z
    .number({ required_error: "El cliente es requerido" })
    .int()
    .positive("Selecciona un cliente válido"),

  tamano: z
    .string({ required_error: "El tamaño es requerido" })
    .refine(
      (val) => tamanioValidos.includes(val as any),
      "El tamaño es requerido"
    ),

  forma: z
    .string({ required_error: "La forma es requerida" })
    .refine(
      (val) => formaValidos.includes(val as any),
      "La forma es requerida"
    ),

  peso: z
    .number({ required_error: "El peso es requerido" })
    .positive("El peso debe ser mayor a 0")
    .max(999.99, "El peso máximo es 999.99 kg"),

  precio: z
    .number()
    .positive()
    .nullish(),
});

export const actualizarPaqueteSchema = z.object({
  tamano: z
    .string()
    .refine((val) => tamanioValidos.includes(val as any), "Tamaño inválido"),

  forma: z
    .string()
    .refine((val) => formaValidos.includes(val as any), "Forma inválida"),

  peso: z
    .number()
    .positive("El peso debe ser mayor a 0")
    .max(999.99, "El peso máximo es 999.99 kg"),

  precio: z
    .number()
    .positive()
    .nullish(),

  cliente_id: z
    .number()
    .int()
    .positive()
    .nullish(),
});