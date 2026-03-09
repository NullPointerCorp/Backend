import { Request, Response } from "express";
import { getSessionByUid } from "./auth.service";
import {
  getEmpleadoSecurityByCorreo,
  recordLoginFailedByCorreo,
  recordLoginSuccessByFirebaseUid,
} from "../empleados/empleado.repository";

export const prelogin = async (req: Request, res: Response) => {
  const correo = String(req.body?.correo ?? "")
    .trim()
    .toLowerCase();

  if (!correo) {
    return res.status(400).json({ message: "correo es obligatorio" });
  }

  const st = await getEmpleadoSecurityByCorreo(correo);

  if (!st.exists) {
    return res.status(200).json({ ok: true });
  }

  const now = new Date();
  const lockedUntil = st.locked_until ? new Date(st.locked_until) : null;
  const isTempLocked = lockedUntil && lockedUntil > now;

  if (st.is_locked || isTempLocked) {
    return res.status(423).json({
      message: "Credenciales inválidas o cuenta bloqueada",
      locked_until: lockedUntil ? lockedUntil.toISOString() : null,
    });
  }

  return res.status(200).json({ ok: true });
};

export const loginFailed = async (req: Request, res: Response) => {
  const correo = String(req.body?.correo ?? "")
    .trim()
    .toLowerCase();

  if (!correo) {
    return res.status(400).json({ message: "correo es obligatorio" });
  }

  await recordLoginFailedByCorreo(correo, 3, 15);

  return res.status(200).json({ ok: true });
};

export const getSession = async (req: Request, res: Response) => {
  const firebaseUid = (req as any).firebaseUid as string | undefined;

  if (!firebaseUid) {
    return res.status(401).json({ message: "Token requerido" });
  }

  const session = await getSessionByUid(firebaseUid);

  if (!session) {
    return res.status(403).json({ message: "No autorizado" });
  }

  await recordLoginSuccessByFirebaseUid(firebaseUid);

  return res.json(session);
};