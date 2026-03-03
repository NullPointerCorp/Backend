export interface ClienteDTO {
  id: number;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  correo: string;
  telefono: string;
}

export interface CrearClienteDTO {
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  correo: string;
  telefono: string;
}