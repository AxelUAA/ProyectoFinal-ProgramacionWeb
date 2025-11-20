const jwt = require('jsonwebtoken');

// Credenciales válidas (en producción, estas deberían estar en una base de datos)
const VALID_USER = {
  username: 'isc',
  password: '1234'
};

// Clave secreta para JWT - IMPORTANTE:
// Esta clave se usa para FIRMAR y VERIFICAR los tokens JWT.
// Sin esta clave, cualquiera podría crear tokens falsos.
// La firma del token = HMAC-SHA256(header.payload, JWT_SECRET)
// Por eso es CRÍTICA para la seguridad del sistema.
// En producción, debe estar en variables de entorno (no en el código).
const JWT_SECRET = process.env.JWT_SECRET || 'mi_clave_secreta_super_segura_2025';

/**
 * Controlador para el login
 * Valida las credenciales y genera un token JWT
 */
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validar que se envíen los datos necesarios
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Usuario y contraseña son requeridos'
      });
    }

    // Validar credenciales
    if (username === VALID_USER.username && password === VALID_USER.password) {
      // Generar token JWT
      const token = jwt.sign(
        { 
          username: username,
          userId: 1 // En producción, esto vendría de la base de datos
        },
        JWT_SECRET,
        { 
          expiresIn: '24h' // El token expira en 24 horas
        }
      );

      return res.status(200).json({
        success: true,
        message: 'Login exitoso Jean Puentes',
        token: token,
        user: {
          username: username
        }
      });
    } else {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  login
};

