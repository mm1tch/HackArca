const express = require("express");
const jwt = require('jsonwebtoken');
const cors = require("cors");
const bcrypt = require('bcryptjs');
const pool = require('./db');

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


const JWT_SECRET = process.env.JWT_SECRET ; // Use environment variable!
// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401); // No token

  jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403); // Invalid token
      req.user = user; // Attach user info (including isAdmin) to request
      next();
  });
};

// Middleware to check if user is admin
const authorizeAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
  next();
};

// Signup routes
app.post('/api/signup', async (req, res) => {
  const { firstName, lastName, correo, password } = req.body;

  try {

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO users (nombre, apellido, correo, password)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `;

    const values = [firstName, lastName, correo, hashedPassword];
    const result = await pool.query(query, values);

    res.status(201).json({ message: 'Usuario creado exitosamente', userId: result.rows[0].id });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Error al crear usuario' });
  }
});



// Login route
app.post('/api/login', async (req, res) => {
  const { correo, password } = req.body;
  
  try {        
      const result = await pool.query('SELECT id, password, is_admin FROM users WHERE correo = $1', [correo]);

      const user = result.rows[0];


      if (!user) {
          return res.status(401).json({ message: 'user not found' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user.id, isAdmin: user.is_admin }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });

  } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
  }
});

// Protected route for all authenticated users
app.get('/api/profile', authenticateToken, (req, res) => {
  res.json({ message: `Welcome, user ${req.user.userId}! You are an admin: ${req.user.isAdmin}` });
});

// Admin-only route
app.get('/api/admin/dashboard', authenticateToken, authorizeAdmin, (req, res) => {
  res.json({ message: 'Welcome to the Admin Dashboard!' });
});

app.post('/api/citas', authenticateToken, async (req, res) => {
const { cliente, fecha, hora, motivo } = req.body;
const id_usuario = req.user.userId;

try {
    const result = await pool.query(
        'INSERT INTO citas (cliente, fecha, hora, motivo, id_usuario) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [cliente, fecha, hora, motivo, id_usuario]
    );
    res.status(201).json(result.rows[0]);
} catch (error) {
    console.error('Error al crear cita:', error);
    res.status(500).json({ message: 'Error al crear cita' });
}
});

app.get("/api/future-visits", async (req, res) => {
try {
  const result = await pool.query("SELECT * FROM visitas WHERE status = 'Future'");
  res.status(200).json(result.rows);
} catch (error) {
  console.error("Error al obtener visitas futuras:", error);
  res.status(500).json({ message: "Error al obtener visitas futuras" });
}
});

// Cancela una visita por ID
app.put("/api/future-visits/:id/cancelar", async (req, res) => {
const { id } = req.params;

try {
  const result = await pool.query(
    "UPDATE visitas SET status = 'Cancelled' WHERE id = $1 RETURNING *",
    [id]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ message: "Visita no encontrada" });
  }

  res.json({ message: "Visita cancelada exitosamente", visita: result.rows[0] });
} catch (error) {
  console.error("Error al cancelar visita:", error);
  res.status(500).json({ message: "Error al cancelar visita" });
}
});


app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});

