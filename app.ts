import express from "express";
import cors from "cors";
import empleadoRoutes from "./src/modules/empleados/empleado.routes";
import authRoutes from "./src/modules/auth/auth.routes";
import clienteRoutes from "./src/modules/clientes/cliente.routes";

const app = express();

app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173", // URL de tu frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Authorization", "Content-Type"],
}));

app.use("/auth", authRoutes);
app.use("/empleados", empleadoRoutes);
app.use("/clientes", clienteRoutes);

app.get("/test", (req, res) => {
  res.send("Ruta test funcionando");
});

export default app;