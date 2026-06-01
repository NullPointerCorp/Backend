export type TipoFiltroViaje = "salidas" | "entradas" | "todos";

export interface CrearViajeDTO {
  numero_serie: string;
  sucursal_destino_id: number;
  fecha_salida: string;
  fecha_llegada: string;
}

export interface ActualizarViajeDTO {
  numero_serie: string;
  fecha_salida: string;
  fecha_llegada: string;
}

export type EstadoViaje = 'programado' | 'en_camino' | 'entregado' | 'regresando' | 'finalizado' | 'cancelado';

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
  fecha_llegada: string;
  estado: EstadoViaje;
}
