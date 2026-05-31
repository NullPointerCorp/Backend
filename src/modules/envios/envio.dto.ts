export interface EnvioDTO {
  envio_id: number;
  tipo_paquete_id: number;
  viaje_id: number | null;
  sucursal_origen_id: number;
  sucursal_destino_id: number;
  descripcion: string;
  estado_envio: string;
  peso: number;
  cliente_id: number;
  empleado_id: number;
}

export interface CrearEnvioDTO {
  tipo_paquete_id: number;
  cliente_id: number;
  destino_id: number;
  descripcion: string;
  estado_envio?: string;
  peso: number;
}

export interface EnvioConsultaDTO {
  envio_id: number;
  correo: number;
  descripcion: string;
  tamanio: string;
  forma: string;
  peso: number;
  nombre_empleado: string; 
  numero_serie: string | null;
  nombre_subtipo: string | null;
  fecha_salida: string | null;
  fecha_llegada: string | null;
  origen: string;          
  destino: string;
  estado_envio: string;
  empleado_id: number;
}

export type EditarEnvioDTO = Omit<EnvioDTO, 'envio_id'>
