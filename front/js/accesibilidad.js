document.addEventListener("DOMContentLoaded", () => {

    const btn = document.getElementById("accesibilidad-btn");
    const panel = document.getElementById("accesibilidad-panel");
    const user = localStorage.getItem("currentUserEmail");

    // Mostrar/Ocultar panel
    btn.addEventListener("click", () => {
        panel.style.display = panel.style.display === "none" ? "block" : "none";
    });

    // Obtener elementos del panel
    const fontSize = document.getElementById("acc-font-size");
    const contrast = document.getElementById("acc-contrast");
    const fontFamily = document.getElementById("acc-font-family");
    const saveBtn = document.getElementById("acc-save");

    // ---------------------------------------------------------
    // Cargar preferencias almacenadas por usuario
    // ---------------------------------------------------------
    function cargarPreferencias() {
        if (!user) return;

        const prefs = JSON.parse(localStorage.getItem(`prefs_${user}`));

        if (!prefs) return;

        aplicarPreferencias(prefs);

        fontSize.value = prefs.fontSize;
        contrast.value = prefs.contrast;
        fontFamily.value = prefs.fontFamily;
    }

    // ---------------------------------------------------------
    // Guardar preferencias con SweetAlert2
    // ---------------------------------------------------------
    saveBtn.addEventListener("click", () => {

        if (!user) {
            Swal.fire({
                icon: "error",
                title: "Inicia sesión",
                text: "Debes iniciar sesión para guardar preferencias."
            });
            return;
        }

        const prefs = {
            fontSize: fontSize.value,
            contrast: contrast.value,
            fontFamily: fontFamily.value
        };

        localStorage.setItem(`prefs_${user}`, JSON.stringify(prefs));

        aplicarPreferencias(prefs);

        Swal.fire({
            icon: "success",
            title: "Preferencias guardadas",
            text: "Tus ajustes se han aplicado correctamente",
            timer: 1500,
            showConfirmButton: false
        });
    });

    // ---------------------------------------------------------
    // Aplicar preferencias al DOM
    // ---------------------------------------------------------
    function aplicarPreferencias(prefs) {

        document.body.className = ""; // limpio clases anteriores

        document.body.classList.add(`font-${prefs.fontSize}`);
        document.body.classList.add(`font-${prefs.fontFamily}`);

        if (prefs.contrast === "dark") {
            document.body.classList.add("dark-mode");
        }
    }

    // Iniciar
    cargarPreferencias();
});
