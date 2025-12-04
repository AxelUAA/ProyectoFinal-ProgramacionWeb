// js/auth.js

// ================== CONFIG / HELPERS JWT ==================

const API_BASE = 'http://localhost:3000/api';
let tokenTimeoutId = null;

// Leer token desde localStorage
function getToken() {
    return localStorage.getItem('token');
}

// Leer expiración
function getTokenExp() {
    const exp = localStorage.getItem('token_exp');
    return exp ? Number(exp) : null;
}

// Verificar expiración
function tokenEstaExpirado() {
    const exp = getTokenExp();
    if (!exp) return true;
    return Date.now() > exp;
}

// Programar aviso cuando caduque el token
function programarExpiracion(segundos) {
    if (tokenTimeoutId) clearTimeout(tokenTimeoutId);

    tokenTimeoutId = setTimeout(() => {

        limpiarSesion(false);

        Swal.fire({
            icon: 'info',
            title: 'Sesión expirada',
            text: 'Tu sesión ha expirado. Por favor, inicia sesión de nuevo.'
        }).then(() => {
            window.location.href = 'login.html';
        });

    }, segundos * 1000);
}

// Guardar token, expiración y usuario
function guardarSesionJWT(token, expiresIn, user) {
    if (!token || !expiresIn) return;

    console.log('Guardando sesión JWT:', { token: token ? 'presente' : 'ausente', expiresIn, user });

    const expTimestamp = Date.now() + expiresIn * 1000;

    localStorage.setItem('token', token);
    localStorage.setItem('token_exp', expTimestamp.toString());

    if (user?.id) {
        localStorage.setItem('currentUserId', user.id);
        console.log('✅ ID guardado:', user.id);
    } else {
        console.warn('⚠️ No se encontró user.id en:', user);
    }
    if (user?.nombre) localStorage.setItem('currentUserName', user.nombre);
    if (user?.correo) localStorage.setItem('currentUserEmail', user.correo);
    if (user?.rol)    localStorage.setItem('currentUserRol', user.rol);

    programarExpiracion(expiresIn);
}

// Borrar datos de sesión
function limpiarSesionStorage() {
    localStorage.removeItem('token');
    localStorage.removeItem('token_exp');
    localStorage.removeItem('currentUserId');
    localStorage.removeItem('currentUserName');
    localStorage.removeItem('currentUserEmail');
    localStorage.removeItem('currentUserRol');
}

// Limpiar sesión (con o sin alerta)
function limpiarSesion(mostrarAlerta = true) {
    limpiarSesionStorage();

    if (tokenTimeoutId) {
        clearTimeout(tokenTimeoutId);
        tokenTimeoutId = null;
    }

    if (mostrarAlerta) {
        Swal.fire({
            icon: 'warning',
            title: 'Sesión cerrada',
            text: 'Tu sesión ha sido cerrada.'
        });
    }
}

// Exponer para otros scripts
window.API_BASE = API_BASE;
window.guardarSesionJWT = guardarSesionJWT;
window.tokenEstaExpirado = tokenEstaExpirado;
window.getToken = getToken;
window.limpiarSesion = limpiarSesion;


// ================== UI / CONTROL DE SESIÓN ==================

document.addEventListener("DOMContentLoaded", () => {

    const userArea = document.getElementById("user-area");
    const btnCarrito = document.getElementById("btnVerCarrito"); // 🛒 CARRITO
    const nombre = localStorage.getItem("currentUserName");
    const rol = localStorage.getItem("currentUserRol");

    // ----------------- VERIFICAR EXPIRACIÓN -----------------
    const exp = getTokenExp();
    if (exp) {
        if (Date.now() >= exp) {
            limpiarSesion(false);

            Swal.fire({
                icon: "info",
                title: "Sesión expirada",
                text: "Tu sesión ha expirado. Por favor, inicia sesión de nuevo."
            }).then(() => {
                window.location.href = "login.html";
            });

        } else {
            const restante = Math.floor((exp - Date.now()) / 1000);
            programarExpiracion(restante);
        }
    }

    // ----------------- USUARIO NO LOGUEADO -----------------
    if (!nombre) {

        // Mostrar botón de login
        if (userArea) {
            userArea.innerHTML = `
                <a href="login.html" class="btn-login">Iniciar sesión</a>
            `;
        }

        // Ocultar botón del carrito
        if (btnCarrito) btnCarrito.style.display = "none";

        return;
    }

    // ----------------- USUARIO LOGUEADO -----------------
    if (rol && rol.toLowerCase() === "admin") {

        userArea.innerHTML = `
            <span class="user-name admin">👑 Admin: ${nombre}</span>
            <button id="logoutBtn">Cerrar sesión</button>
        `;

    } else {

        userArea.innerHTML = `
            <span class="user-name">Hola, ${nombre}</span>
            <button id="logoutBtn">Cerrar sesión</button>
        `;
    }

    // Mostrar botón del carrito 🛒 SOLO si hay sesión
    if (btnCarrito) {
        btnCarrito.style.display = "inline-block";
    }

    // ----------------- CERRAR SESIÓN -----------------
    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {

            Swal.fire({
                title: "¿Cerrar sesión?",
                text: "Tu sesión actual será cerrada",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sí, cerrar",
                cancelButtonText: "Cancelar"
            }).then((result) => {
                if (result.isConfirmed) {

                    limpiarSesion(false);

                    Swal.fire({
                        title: "Sesión cerrada",
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false
                    });

                    setTimeout(() => {
                        window.location.href = "login.html";
                    }, 1500);
                }
            });

        });
    }
});
