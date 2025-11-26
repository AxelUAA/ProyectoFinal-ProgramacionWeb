//front para registrar un nuevo usuario 
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registerForm");

    form.addEventListener("submit", async (e) => {
        e.preventDefault(); 
        const password = document.getElementById('password').value;
        const passwordNueva = document.getElementById('passwordNueva').value;
        //validar que las contraseñas coincidan
        if (password !== passwordNueva) {
            Swal.fire({
                title: 'Error',
                text: 'Las contraseñas no coinciden',
                icon: 'error'
            });
            return; // Detener el envío del formulario si las contraseñas no coinciden
        }

        // 1. Tomar los valores (Ahora usamos el ID 'password')
        const data = {
            id: document.getElementById('id').value,
            nombre: document.getElementById('nombre').value,
            correo: document.getElementById('correo').value,
            password: document.getElementById('password').value 
        };

        try {
            // 2. Petición al servidor
            const response = await fetch("http://localhost:3000/api/registrarUsuario", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            // 3. Manejo de respuesta
            if (response.ok) {
                Swal.fire({
                    title: '¡Registro Exitoso!',
                    text: result.message,
                    icon: 'success',
                    confirmButtonText: 'Ir al Login'
                }).then((res) => {
                    if (res.isConfirmed) {
                        window.location.href = 'login.html';
                    }
                });
                form.reset();
            } else {
                Swal.fire({
                    title: 'Error',
                    text: result.message || "Error desconocido",
                    icon: 'error'
                });
            }

        } catch (err) {
            console.error("Error al registrar:", err);
            Swal.fire({
                title: 'Error de conexión',
                text: 'Asegúrate de que el servidor backend esté encendido.',
                icon: 'error'
            });
        }
    });
});