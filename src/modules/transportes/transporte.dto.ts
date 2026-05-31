export interface CrearTransporteDTO {
  numero_serie: string
  sucursal_id: number
  empleado_id?: number | null
  subtipo_id: number
  capacidad_carga: number
  unidad_medida: string
  placa?: string
}

export interface ActualizarTransporteDTO {
  empleado_id?: number | null
  sucursal_id?: number
  capacidad_carga?: number
  unidad_medida?: string
  placa?: string
}
