export type TipoFiltroViaje = "salidas" | "entradas" | "todos";

export interface CrearViajeDTO {
  numero_serie: string;
  sucursal_destino_id: number;
  fecha_salida: string;
  fecha_llegada?: string | null;
}

export interface ViajeConsultaDTO {
  viaje_id: number;
  numero_serie: string;
  placa: string | null;
  transportista: string;
  sucursal_origen_id: number;
  origen: string;
  sucursal_destino_id: number;
  destino: string;
  fecha_salida: string;
  fecha_llegada: string | null;
}
