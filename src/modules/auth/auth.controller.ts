import { Request, Response } from "express";
import { getSessionByUid } from "./auth.service";
import {
  getEmpleadoSecurityByCorreo,
  recordLoginFailedByCorreo,
  recordLoginSuccessByFirebaseUid,
} from "../empleados/empleado.repository";

// POST /auth/prelogin  { correo }
export const prelogin = async (req: Request, res: Response) => {
  const correo = String(req.body?.correo ?? "")
    .trim()
    .toLowerCase();

  if (!correo) {
    return res.status(400).json({ message: "correo es obligatorio" });
  }

  const st = await getEmpleadoSecurityByCorreo(correo);

  // Neutral: si no existe, igual responde ok
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

// POST /auth/login-failed  { correo }
export const loginFailed = async (req: Request, res: Response) => {
  const correo = String(req.body?.correo ?? "")
    .trim()
    .toLowerCase();

  if (!correo) {
    return res.status(400).json({ message: "correo es obligatorio" });
  }

  // Regla: 3 intentos, 15 minutos de bloqueo
  await recordLoginFailedByCorreo(correo, 3, 15);

  // Neutral: siempre ok
  return res.status(200).json({ ok: true });
};

// GET /auth/me (tu getSession actual)
// Requiere authMiddleware para llenar req.firebaseUid
export const getSession = async (req: Request, res: Response) => {
  const firebaseUid = (req as any).firebaseUid as string | undefined;

  if (!firebaseUid) {
    return res.status(401).json({ message: "Token requerido" });
  }

  const session = await getSessionByUid(firebaseUid);

  if (!session) {
    // No revelamos detalles
    return res.status(403).json({ message: "No autorizado" });
  }

  // Login exitoso: reset intentos + last_login_at
  await recordLoginSuccessByFirebaseUid(firebaseUid);

  return res.json(session);
};