export interface ClienteDTO {
  cliente_id: number;
  nombre: string;
  apellido_paterno: string;
  apellido_materno?: string | null;
  correo: string;
  telefono?: string | null;
}

export interface CrearClienteDTO {
  nombre: string;
  apellido_paterno: string;
  apellido_materno?: string | null;
  correo: string;
  telefono?: string | null;
}
