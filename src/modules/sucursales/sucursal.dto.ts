export interface CrearSucursalDTO {
  nombre_sucursal: string
  ciudad_id: number
  empleado_id_supervisor?: number
  colonia: string
  codigo_postal: string
  calle: string
  numero_exterior: string
  numero_interior?: string
  longitud?: number
  latitud?: number
}

export interface ActualizarSucursalDTO extends Partial<CrearSucursalDTO> {}