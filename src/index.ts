import express from 'express';
import app from '../app';

const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend funcionando");
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});