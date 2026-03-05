import { Request, Response } from "express";
import { getAllRoles } from "./rol.repository";

export const listarRoles = async (_req: Request, res: Response) => {
  try {
    const roles = await getAllRoles();
    return res.json({ ok: true, data: roles });
  } catch (error) {
    console.error("[roles] GET /roles error", error);
    return res.status(500).json({ ok: false, message: "Error al listar roles" });
  }
};