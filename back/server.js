// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const routes = require('./routes/routes');      // productos, etc.
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

// variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Middleware para servir archivos estáticos (front-end)
app.use('/public', express.static(path.join(__dirname, 'public')));

// Rutas generales de la API (productos, carrito, etc.)
app.use('/api', routes);

// Rutas de autenticación (login y registro)
app.use('/api/auth', authRoutes);

// Rutas de usuario (protegidas con JWT/middleware)
app.use('/api/users', userRoutes);

// Servidor encendido
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`🔑 Login:  POST http://localhost:${PORT}/api/auth/login`);
  console.log(`🛡 Perfil: GET  http://localhost:${PORT}/api/users/perfil (requiere Bearer token)`);
  console.log(`El front vive en http://localhost:5500/front/index.html`);
});
