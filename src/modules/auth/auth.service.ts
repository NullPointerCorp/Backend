import { SessionDTO } from "./auth.dto";
import { findEmpleadoByFirebaseUid } from "../empleados/empleado.repository";

export const getSessionByUid = async (uid: string): Promise<SessionDTO | null> => {
  const empleado = await findEmpleadoByFirebaseUid(uid);

  if (!empleado) return null;

  return {
    id: empleado.id,
    nombre: empleado.nombre,
    rol: empleado.rol
  };
};