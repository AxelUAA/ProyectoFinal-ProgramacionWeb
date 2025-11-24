// controllers/authController.js
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const db = require('../db/conexion');

const JWT_SECRET = process.env.JWT_SECRET || 'clave_por_defecto';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '60'; // segundos

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    
    // -------------------- VALIDAR reCAPTCHA --------------------
    const recaptchaToken =
    req.body.captcha || req.body["g-recaptcha-response"];


    if (!recaptchaToken) {
      return res.status(400).json({
        ok: false,
        message: "Falta el token de reCAPTCHA"
      });
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    if (!secretKey) {
      return res.status(500).json({
        ok: false,
        message: "Falta la clave secreta de reCAPTCHA en el servidor (.env)"
      });
    }

    const verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;

    const googleRes = await fetch(verifyURL, { method: 'POST' });
    const googleData = await googleRes.json();

    if (!googleData.success) {
      return res.status(400).json({
        ok: false,
        message: "Falló la verificación de reCAPTCHA"
      });
    }
    // -------------------- FIN VALIDACIÓN ------------------------


    const { correo, password } = req.body || {};

    if (!correo || !password) {
      return res.status(400).json({
        ok: false,
        message: "Faltan campos 'correo' y 'password'."
      });
    }

    // Buscar usuario en la BD por correo
    const [rows] = await db.promise().query(
      `
        SELECT 
          ID,
          Nombre,
          Correo,
          Rol,
          \`Password\` AS Contrasena
        FROM usuarios
        WHERE Correo = ?
        LIMIT 1
      `,
      [correo]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        ok: false,
        message: 'Credenciales inválidas (correo no encontrado).'
      });
    }

    const user = rows[0];

    // Comparar contraseña (aquí texto plano; en producción usar bcrypt)
    if (user.Contrasena !== password) {
      return res.status(401).json({
        ok: false,
        message: 'Credenciales inválidas (contraseña incorrecta).'
      });
    }

    // Payload del token
    const payload = {
      userId: user.ID,
      nombre: user.Nombre,
      correo: user.Correo,
      rol: user.Rol
    };

    // Crear token con expiración de 1 minuto
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: `${JWT_EXPIRES_IN}s`  // "60s"
    });

    return res.status(200).json({
      ok: true,
      message: 'Login correcto',
      token,
      expiresIn: Number(JWT_EXPIRES_IN),
      user: {
        id: user.ID,
        nombre: user.Nombre,
        correo: user.Correo,
        rol: user.Rol
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor'
    });
  }
};