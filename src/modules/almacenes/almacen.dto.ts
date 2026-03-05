export interface AlmacenDTO {
  almacen_id: number;
  sucursal_id: number;
  nombre_sucursal?: string;
  nombre_almacen: string;
  descripcion?: string;
}

export interface CrearAlmacenDTO {
  sucursal_id: number;
  nombre_almacen: string;
  descripcion?: string;
}