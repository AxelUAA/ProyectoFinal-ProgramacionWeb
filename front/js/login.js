// js/login.js

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const btnCambiarPass = document.getElementById('btnCambiarPass');
  const btnRegistrar = document.getElementById('btnRegistrar');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const correo = document.getElementById('correo').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!correo || !password) {
      Swal.fire({
        icon: 'error',
        title: 'Campos incompletos',
        text: 'Debes llenar correo y contraseña.'
      });
      return;
    }
      //  Obtener respuesta del CAPTCHA
      const captcha = grecaptcha.getResponse();

      if (!captcha) {
           Swal.fire({
          icon: 'warning',
          title: 'Captcha requerido',
           text: 'Por favor confirma que no eres un robot.'
          });
       return;
    }

    try {
      const base = window.API_BASE || 'http://localhost:3000/api';

      const res = await fetch(`${base}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, password, captcha })
      });

      const data = await res.json();

      // Si el backend responde error
      if (!res.ok || data.ok === false) {
        Swal.fire({
          icon: 'error',
          title: 'Credenciales incorrectas',
          text: data.message || 'Correo o contraseña inválidos.'
        });
        return;
      }

      // data.user debe venir del backend (id, nombre, correo, rol)
      const token     = data.token;
      const expiresIn = data.expiresIn || 60;
      const user      = data.user || {
        nombre: data.nombre,
        correo: data.correo,
        rol: data.rol
      };

      // Guardar JWT + expiración + datos de usuario usando helpers globales
      if (window.guardarSesionJWT) {
        window.guardarSesionJWT(token, expiresIn, user);
      } else {
        // Fallback mínimo
        if (user.nombre) localStorage.setItem('currentUserName', user.nombre);
        if (user.correo) localStorage.setItem('currentUserEmail', user.correo);
        if (user.rol)    localStorage.setItem('currentUserRol', user.rol);
      }

      Swal.fire({
        icon: 'success',
        title: 'Bienvenido',
        text: 'Inicio de sesión exitoso. Tu sesión durará 1 minuto.',
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        window.location.href = 'index.html';
      });

    } catch (error) {
      console.error('Error en login:', error);
      Swal.fire({
        icon: 'error',
        title: 'Servidor apagado',
        text: 'No se pudo conectar al backend.'
      });
    }
  });

  // Botón "Cambiar contraseña"
  if (btnCambiarPass) {
    btnCambiarPass.addEventListener('click', () => {
      Swal.fire({
        icon: 'info',
        title: 'Próximamente',
        text: 'Esta función aún no está disponible.'
      });
    });
  }

  // Botón "Registrar"
  if (btnRegistrar) {
    btnRegistrar.addEventListener('click', () => {
      window.location.href = 'registrar.html';
    });
  }
});
