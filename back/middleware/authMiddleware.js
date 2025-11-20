const jwt = require('jsonwebtoken');

// Clave secreta (debe ser la misma que se usa para generar el token)
const JWT_SECRET = process.env.JWT_SECRET || 'mi_clave_secreta_super_segura_2025';

/**
 * Middleware para verificar el token JWT
 * Se ejecuta antes de las rutas protegidas
 */
const verifyToken = (req, res, next) => {
  try {
    // Obtener el token del header Authorization
    // Formato esperado: "Bearer <token>"
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado. Debe enviar: Authorization: Bearer <token>'
      });
    }

    // Extraer el token (eliminar "Bearer ")
    const token = authHeader.split(' ')[1]; // ["Bearer", "<token>"] -> "<token>"
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Formato de token inválido. Use: Bearer <token>'
      });
    }

    // Verificar el token usando JWT_SECRET
    // Si el token es válido, decoded contiene los datos del payload
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Agregar los datos del usuario al request para uso posterior
    req.user = decoded; // { username: 'isc', userId: 1, iat: ..., exp: ... }
    
    // Continuar con la siguiente función (controlador)
    next();
    
  } catch (error) {
    // Si el token es inválido, expirado o falsificado
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado. Debe hacer login nuevamente.'
      });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido o falsificado.'
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Error al verificar el token.'
      });
    }
  }
};

module.exports = {
  verifyToken
};

