// lo de base 
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const routes = require('./routes/routes');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rutas generales de la API (productos, carrito, etc.)
app.use('/api', routes);

// Rutas de autenticación (login y registro)
app.use('/api/auth', authRoutes);

// Rutas de usuario (protegidas con JWT/middleware)
app.use('/api/users', usersRoutes);


// Servidor encendido
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
     console.log(`El front vive en http://localhost:5500/front/index.html`);
});
