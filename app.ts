import express from "express";
import cors from "cors";

import authRoutes from "./src/modules/auth/auth.routes";
import sucursalRoutes from "./src/modules/sucursales/sucursal.routes";
import empleadoRoutes from "./src/modules/empleados/empleado.routes";
import rolRoutes from "./src/modules/roles/rol.routes";
import clienteRoutes from "./src/modules/clientes/cliente.routes";
import ubicacion from "./src/modules/ubicacion/ubicacion.routes";
import almacenRoutes from "./src/modules/almacenes/almacen.routes";
import tipoPaquetesRouter from './src/modules/tipo-paquetes/tipoPaquete.routes';
import transporteRoutes from "./src/modules/transportes/transporte.routes";

import { errorHandler } from "./src/middlewares/error-handler";

const app = express();

app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Authorization", "Content-Type"],
}));

app.use("/auth", authRoutes);
app.use("/ubicacion", ubicacion);
app.use("/sucursales", sucursalRoutes);
app.use("/almacenes", almacenRoutes);
app.use("/empleados", empleadoRoutes);
app.use("/roles", rolRoutes);
app.use("/clientes", clienteRoutes);
app.use('/tipo-paquetes', tipoPaquetesRouter);
app.use("/transporte", transporteRoutes);

app.get("/test", (req, res) => {
  res.send("Ruta test funcionando");
});

app.use(errorHandler);

export default app;
