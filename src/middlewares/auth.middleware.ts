import { Request, Response, NextFunction } from "express";
import admin from "../config/firebase";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token requerido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);

    (req as any).firebaseUid = decoded.uid;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }
};