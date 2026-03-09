export interface PaqueteDTO {
  folio: number
  cliente_id: number
  nombre_cliente?: string
  tamano: string
  forma: string
  precio: number
  peso: number
}

export interface CrearPaqueteDTO {
  cliente_id: number
  tamano: string
  forma: string
  precio: number
  peso: number
}