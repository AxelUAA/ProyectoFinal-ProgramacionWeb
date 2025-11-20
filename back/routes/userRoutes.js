const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');

// Ruta protegida - requiere token JWT válido
// El middleware verifyToken se ejecuta ANTES del controlador
router.get('/profile', verifyToken, userController.getProfile);

module.exports = router;
