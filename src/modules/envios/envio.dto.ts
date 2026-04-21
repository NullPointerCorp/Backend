export interface EnvioDTO {
  envio_id: number;
  tipo_paquete_id: number;
  numero_serie: string;
  fecha_salida: string;
  fecha_llegada: string;
  estado_envio: string;
  origen_id: number;
  destino_id: number;
  cliente_id: number;
}

export interface EnvioConsultaDTO {
  envio_id: number;
  correo: number;
  descripcion: string;
  tamanio: string;
  forma: string;
  peso: number;
  nombre_empleado: string; 
  numero_serie: string;
  nombre_subtipo: string;
  fecha_salida: string;
  fecha_llegada: string;
  origen: string;          
  destino: string;
  estado_envio: string;
}

export type CrearEnvioDTO = Omit<EnvioDTO, 'envio_id'>

export type EditarEnvioDTO = Omit<EnvioDTO, 'envio_id'>
