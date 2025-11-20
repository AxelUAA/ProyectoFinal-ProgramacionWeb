
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const routes = require('./routes/routes');
const usersRoutes = require('./routes/usersRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rutas principales de la API
app.use('/api', routes);          // Productos
app.use('/api/users', usersRoutes); // Login

// Servidor encendido
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
     console.log(`El front vive en http://localhost:5500/front/index.html`);
});
