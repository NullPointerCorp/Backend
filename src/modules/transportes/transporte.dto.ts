export interface CrearTransporteDTO {
  numero_serie: string
  empleado_id: number
  subtipo_id: number
  capacidad_carga: number
  unidad_medida: string
  placa?: string
}

export interface ActualizarTransporteDTO {
  empleado_id?: number
  capacidad_carga?: number
  unidad_medida?: string
  placa?: string
}
