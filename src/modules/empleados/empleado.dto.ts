export type EmpleadoListItemDTO = {
  empleado_id: number;
  nombre: string;
  correo: string;
  rol_id: number;
  sucursal_id: number | null;
  is_locked: boolean;
  last_login_at: string | null;
};

export type CrearEmpleadoDTO = {
  nombre: string;
  correo: string;
  rol_id: number;
  sucursal_id?: number | null;
};

export type EditarEmpleadoDTO = {
  nombre?: string;
  correo?: string;
  rol_id?: number;
  sucursal_id?: number | null;
  is_locked?: boolean;
};