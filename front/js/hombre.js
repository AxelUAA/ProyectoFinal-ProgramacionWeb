// Cargar productos de la categoría Hombre (1)
function cargarProductosHombre() {
    fetch("http://localhost:3000/api/productos/categoria/1")
        .then(res => res.json())
        .then(data => {
            const contenedor = document.getElementById("contenedor");
            contenedor.innerHTML = "";

            if (!Array.isArray(data) || data.length === 0) {
                contenedor.innerHTML = "<p>No se encontraron productos.</p>";
                return;
            }

            data.forEach(producto => {
                const div = document.createElement("div");
                div.className = "card";

                div.innerHTML = `
                    <img src="img/${producto.imagen}" alt="${producto.nombre}">
                    <h3>${producto.nombre}</h3>
                    <p class="precio">$${producto.precio}</p>
                    <p>Stock: ${producto.stock}</p>
                `;

                // ABRIR MODAL
                div.addEventListener("click", () => {
                    mostrarModal(producto);
                });

                contenedor.appendChild(div);
            });
        })
        .catch(err => {
            console.error("Error:", err);
        });
}

// Ejecutar
cargarProductosHombre();
