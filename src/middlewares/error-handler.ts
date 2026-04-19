import { Request, Response, NextFunction } from "express";
import { HttpError } from "../errors/http-errors";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Errores HTTP que lanzamos
  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message });
  }

  // Errores conocidos de MySQL
  if (err.code === "ER_ROW_IS_REFERENCED_2" || err.errno === 1451) {
    return res.status(409).json({
      message: "¡No se puede eliminar porque tiene registros asociados!",
    });
  }

  if (err.code === "ER_DUP_ENTRY" || err.errno === 1062) {
    return res.status(409).json({
      message: "¡Ya existe un registro con esos datos!",
    });
  }

  if (err.code === "ER_NO_REFERENCED_ROW_2" || err.errno === 1452) {
    return res.status(400).json({
      message: "¡Una de las referencias enviadas no existe!",
    });
  }

  // Error inesperado lo logueamos para debugging y damos el genérico al usuario
  console.error("Error inesperado:", err);
  return res.status(500).json({ message: "¡Algo salió mal. Por favor intenta más tarde!" });
};
