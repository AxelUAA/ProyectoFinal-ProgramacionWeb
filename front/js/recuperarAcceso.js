document.getElementById("changePassForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const correo = document.getElementById("correo").value.trim();

    if (!correo) {
        Swal.fire({
            icon: "warning",
            title: "Correo requerido",
            text: "Por favor ingresa un correo electrónico."
        });
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/verificarCorreo/${correo}`);
        const data = await response.json();

        if (!data.exists) {
            Swal.fire({
                icon: "error",
                title: "Correo no válido",
                text: "Ingresa un usuario válido."
            });
            return;
        }

        // Si existe, muestra un mensaje de éxito y luego redirige
        Swal.fire({
            icon: "success",
            title: "Correo encontrado",
            text: "El correo existe en el sistema."
        }).then(() => {
            // Redirige a verificar.html sin usar el correo como parametro en la URL
            window.location.href = "verificar.html";
            
        });

    } catch (error) {
        console.error("Error verificando correo:", error);

        Swal.fire({
            icon: "error",
            title: "Error del servidor",
            text: "No se pudo verificar el correo."
        });
    }
});
