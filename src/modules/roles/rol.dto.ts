export interface RolDTO {
  rol_id: number;
  rol_nombre: string;
  descripcion: string | null;
}

export type CrearRolDTO = Omit<RolDTO, 'rol_id'>

export type EditarRolDTO = Omit<RolDTO, 'rol_id'>
