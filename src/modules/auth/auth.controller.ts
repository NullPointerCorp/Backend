import { Request, Response } from "express";
import { getSessionByUid } from "./auth.service";

export const getSession = async (req: Request, res: Response) => {
  const firebaseUid = (req as any).firebaseUid;

  const session = await getSessionByUid(firebaseUid);

  if (!session) {
    return res.status(403).json({ message: "Empleado no autorizado" });
  }

  return res.json(session);
};