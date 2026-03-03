import { Request, Response } from "express";
import { getAllEmpleados } from "./empleado.repository";

export const listarEmpleados = async (req: Request, res: Response) => {
  try {
    const empleados = await getAllEmpleados();
    res.json(empleados);
  } catch (error) {
    res.status(500).json({ message: "Error interno" });
  }
};