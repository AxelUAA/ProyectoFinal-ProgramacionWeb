document.addEventListener("DOMContentLoaded", () => {

    const userArea = document.getElementById("user-area");

    const nombre = localStorage.getItem("currentUserName");
    const rol = localStorage.getItem("currentUserRol");

    // ---- SI NO ESTÁ LOGUEADO ----
    if (!nombre) {
        userArea.innerHTML = `
            <a href="login.html" class="btn-login">Iniciar sesión</a>
        `;
        return;
    }

    // ---- SI ES ADMIN ----
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

    // ---- CERRAR SESIÓN CON SWEETALERT ----
    const logoutBtn = document.getElementById("logoutBtn");

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

                localStorage.removeItem("currentUserName");
                localStorage.removeItem("currentUserEmail");
                localStorage.removeItem("currentUserRol");

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
});

