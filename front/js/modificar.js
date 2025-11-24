document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formModificar");

    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // 1. Obtener el ID (para saber a quién modificar)
        const idInput = document.querySelector('input[name="id"]');
        const id = idInput.value.trim();

        if (!id) {
            alert("Debes ingresar el ID del producto que quieres modificar.");
            return;
        }

        // 2. Obtener los datos nuevos del formulario
        const data = {
            nombre: document.querySelector('input[name="nombre"]').value,
            descripcion: document.querySelector('textarea[name="descripcion"]').value,
            precio: document.querySelector('input[name="precio"]').value,
            stock: document.querySelector('input[name="stock"]').value,
            imagen: document.querySelector('input[name="imagen"]').value,
            categoria: document.querySelector('input[name="categoria"]').value,
        };

        try {
            // 3. Enviar la petición PUT a la ruta que creamos
            // Fíjate que el ID va en la URL: /api/modificarProducto/40
            const response = await fetch(`http://localhost:3000/api/modificarProducto/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                alert("✅ " + result.message);
                form.reset(); // Limpia el formulario
            } else {
                alert("❌ Error: " + result.message);
            }

        } catch (err) {
            console.error("Error al modificar:", err);
            alert("❌ Error de conexión con el servidor.");
        }
    });
});
document.getElementById("back").addEventListener("click", () => {
    window.history.back();
});
