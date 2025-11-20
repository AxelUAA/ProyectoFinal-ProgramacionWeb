document.addEventListener("DOMContentLoaded", () => {

    const btn = document.getElementById("accesibilidad-btn");
    const panel = document.getElementById("accesibilidad-panel");
    const user = localStorage.getItem("currentUserEmail");  // clave por usuario logueado

    // Mostrar/Ocultar panel
    btn.addEventListener("click", () => {
        panel.style.display = panel.style.display === "none" ? "block" : "none";
    });

    // Obtener elementos
    const fontSize = document.getElementById("acc-font-size");
    const contrast = document.getElementById("acc-contrast");
    const fontFamily = document.getElementById("acc-font-family");
    const saveBtn = document.getElementById("acc-save");

    // Cargar preferencias del usuario
    function cargarPreferencias() {
        if (!user) return;

        const prefs = JSON.parse(localStorage.getItem(`prefs_${user}`));

        if (!prefs) return;

        // Aplicar preferencias al DOM
        aplicarPreferencias(prefs);

        // Poner valores en los selects
        fontSize.value = prefs.fontSize;
        contrast.value = prefs.contrast;
        fontFamily.value = prefs.fontFamily;
    }

    // Guardar preferencias
    saveBtn.addEventListener("click", () => {
        if (!user) {
            alert("Debes iniciar sesión para guardar preferencias.");
            return;
        }

        const prefs = {
            fontSize: fontSize.value,
            contrast: contrast.value,
            fontFamily: fontFamily.value
        };

        // Guardar por usuario
        localStorage.setItem(`prefs_${user}`, JSON.stringify(prefs));

        aplicarPreferencias(prefs);

        alert("Preferencias guardadas.");
    });

    // Función que aplica preferencias al body
    function aplicarPreferencias(prefs) {
        document.body.className = ""; // limpiar

        document.body.classList.add(`font-${prefs.fontSize}`);
        document.body.classList.add(`font-${prefs.fontFamily}`);

        if (prefs.contrast === "dark") {
            document.body.classList.add("dark-mode");
        }
    }

    // Cargar preferencias al iniciar
    cargarPreferencias();
});
