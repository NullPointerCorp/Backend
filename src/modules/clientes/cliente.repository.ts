import { pool } from "../../config/database";
import { CrearClienteDTO } from "./cliente.dto";

export const getAllClientes = async () => {
  const [rows] = await pool.query(`SELECT * FROM clientes`);
  return (rows as any);
}

export const findClienteById = async (id: number) => {
  const [rows] = await pool.query(`SELECT * FROM clientes WHERE id = ?`, [id]);
  return (rows as any)[0];
};

export const createCliente = async (data: CrearClienteDTO) => {
  const [result] = await pool.query(`INSERT INTO clientes SET ?`, [data]);
  return result;
};

export const updateCliente = async (id: number, data: Partial<CrearClienteDTO>) => {
  const [result] = await pool.query(`UPDATE clientes SET ? WHERE id = ?`, [data, id]);
  return result;
};

export const deleteCliente = async (id: number) => {
  const [result] = await pool.query(`DELETE FROM clientes WHERE id = ?`, [id]);
  return result;
};