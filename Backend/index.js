const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch"); 

const app = express();
const PORT = 5050;

app.use(cors());
app.use(express.json());


app.get("/api/comentarios", async (req, res) => {
  const { nombreSucursal } = req.query;

  if (!nombreSucursal) {
    return res.status(400).json({ error: "Falta el parámetro nombreSucursal" });
  }

  const url = `http://localhost:5050/api/comentarios?nombreSucursal=${encodeURIComponent(nombreSucursal)}`;
  console.log("🔁 Reenviando a Flask:", url);

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("❌ Error reenviando comentarios:", error);
    res.status(500).json({ error: "Error al obtener comentarios" });
  }
});


app.get("/api/sucursales", async (req, res) => {
  const url = `http://localhost:5050/api/sucursales`;
  console.log("🔁 Reenviando a Flask:", url);

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("❌ Error reenviando sucursales:", error);
    res.status(500).json({ error: "Error al obtener sucursales" });
  }
});

app.get("/api/visitas", async (req, res) => {
  const url = `http://localhost:5050/api/visitas`;
  console.log("🔁 Reenviando a Flask:", url);

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("❌ Error reenviando visitas:", error);
    res.status(500).json({ error: "Error al obtener visitas" });
  }
});

// 🔁 Reenviar surveys
app.get("/api/surveys", async (req, res) => {
  const url = `http://localhost:5050/api/surveys`;
  console.log("🔁 Reenviando a Flask:", url);

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("❌ Error reenviando surveys:", error);
    res.status(500).json({ error: "Error al obtener surveys" });
  }
});

app.get("/api/users/:id", (req, res) => {
  res.json({
    id: req.params.id,
    name: "Michelle",
    email: "michelle@example.com",
  });
});

app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});

