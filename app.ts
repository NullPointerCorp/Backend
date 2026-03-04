import express from "express";
import cors from "cors";
import authRoutes from "./src/modules/auth/auth.routes";
import sucursalRoutes from "./src/modules/sucursales/sucursal.routes";
import empleadoRoutes from "./src/modules/empleados/empleado.routes";
import clienteRoutes from "./src/modules/clientes/cliente.routes";
import ubicacion from "./src/modules/ubicacion/ubicacion.routes";

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
app.use("/empleados", empleadoRoutes);
app.use("/clientes", clienteRoutes);


app.get("/test", (req, res) => {
  res.send("Ruta test funcionando");
});

export default app;