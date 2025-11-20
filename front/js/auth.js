document.addEventListener("DOMContentLoaded", () => {
    const userArea = document.getElementById("user-area");

    const nombre = localStorage.getItem("currentUserName");
    const rol = localStorage.getItem("currentUserRol");

    if (!nombre) {
        // Usuario NO logueado
        userArea.innerHTML = `
            <a href="login.html" class="btn-login">Iniciar sesión</a>
        `;
        return;
    }

    // Si es admin → mostrarlo especial
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

    // Evento cerrar sesión
    const logoutBtn = document.getElementById("logoutBtn");
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("currentUserName");
        localStorage.removeItem("currentUserEmail");
        localStorage.removeItem("currentUserRol");
        window.location.href = "login.html";
    });
});

