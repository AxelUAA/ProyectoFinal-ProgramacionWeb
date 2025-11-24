document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formEliminar");

    if (!form) return; // Si no existe el formulario en esta página, no hace nada

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // 1. Obtener el ID del input
        const idInput = document.querySelector('input[name="id"]');
        const id = idInput.value.trim();

        if (!id) {
            alert("Por favor, ingresa un ID válido.");
            return;
        }

        // Confirmación de seguridad antes de borrar
        if (!confirm(`¿Estás seguro de que deseas eliminar el producto con ID ${id}?`)) {
            return;
        }

        try {
            // 2. Enviar la petición DELETE a la API
            const response = await fetch(`http://localhost:3000/api/eliminarProducto/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const result = await response.json();

            // 3. Manejar la respuesta
            if (response.ok) {
                alert("✅ " + result.message);
                form.reset(); // Limpia el campo
            } else {
                alert("❌ Error: " + result.message);
            }

        } catch (err) {
            console.error("Error al eliminar:", err);
            alert("❌ Error de conexión con el servidor.");
        }
    });
});
document.getElementById("back").addEventListener("click", () => {
    window.history.back();
});
