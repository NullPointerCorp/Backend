export type EmpleadoListItemDTO = {
  empleado_id: number;
  nombre: string;
  apellido_paterno: string | null;
  apellido_materno: string | null;
  telefono: string | null;
  correo: string;
  estado: string | null;
  ciudad_id: number | null;
  ciudad: string | null;
  colonia: string | null;
  codigo_postal: string | null;
  calle: string | null;
  numero_exterior: string | null;
  numero_interior: string | null;
  rol_id: number;
  rol_nombre: string;
  sucursal_id: number | null;
  sucursal_nombre: string | null;
  is_locked: boolean;
  last_login_at: string | null;
};

export type CrearEmpleadoDTO = {
  nombre: string;
  apellido_paterno: string;
  apellido_materno?: string | null;
  telefono?: string | null;
  correo: string;
  contrasena?: string;
  rol_id: number;
  sucursal_id?: number | null;
  ciudad_id?: number | null;
  colonia?: string | null;
  codigo_postal?: string | null;
  calle?: string | null;
  numero_exterior?: string | null;
  numero_interior?: string | null;
};

export type EditarEmpleadoDTO = {
  nombre?: string;
  apellido_paterno?: string; 
  apellido_materno?: string | null;
  telefono?: string | null;
  correo?: string;
  contrasena?: string;
  rol_id?: number;
  sucursal_id?: number | null;
  ciudad_id?: number | null;
  colonia?: string | null;
  codigo_postal?: string | null;
  calle?: string | null;
  numero_exterior?: string | null;
  numero_interior?: string | null;
  is_locked?: boolean;
};
