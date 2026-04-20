export interface PaqueteDTO {
  tipo_paquete_id: number
  tamanio: string
  forma: string
  precio: number
}

export interface CrearPaqueteDTO {
  tamanio: string
  forma: string
  precio: number
}
