ALTER TABLE envios
  ADD COLUMN sucursal_origen_id INT NULL AFTER viaje_id,
  ADD COLUMN sucursal_destino_id INT NULL AFTER sucursal_origen_id;

UPDATE envios e
INNER JOIN viajes v ON v.viaje_id = e.viaje_id
SET
  e.sucursal_origen_id = v.sucursal_origen_id,
  e.sucursal_destino_id = v.sucursal_destino_id
WHERE e.viaje_id IS NOT NULL
  AND (e.sucursal_origen_id IS NULL OR e.sucursal_destino_id IS NULL);

ALTER TABLE envios
  MODIFY viaje_id INT NULL,
  MODIFY estado_envio ENUM(
    'registrado',
    'en_camino',
    'entregado',
    'retrasado',
    'devuelto',
    'cancelado',
    'en_espera'
  ) NOT NULL DEFAULT 'registrado',
  ADD CONSTRAINT fk_envio_viaje FOREIGN KEY (viaje_id) REFERENCES viajes(viaje_id),
  ADD CONSTRAINT fk_envio_sucursal_origen FOREIGN KEY (sucursal_origen_id) REFERENCES sucursales(sucursal_id),
  ADD CONSTRAINT fk_envio_sucursal_destino FOREIGN KEY (sucursal_destino_id) REFERENCES sucursales(sucursal_id);
