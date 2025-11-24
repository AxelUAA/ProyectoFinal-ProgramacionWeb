// ===== CARGA DE PRODUCTOS DE CATEGORÍA (NIÑOS) =====

function cargarProductos(idCategoria) {
    const url = `http://localhost:3000/api/productos/categoria/${idCategoria}`;
    
    fetch(url)
        .then(res => res.json())
        .then(data => {
            const contenedor = document.getElementById('contenedor');

            contenedor.innerHTML = '';

            if (!Array.isArray(data) || data.length === 0) {
                contenedor.innerHTML = '<p>No se encontraron productos en esta categoría.</p>';
                return;
            }

            data.forEach(producto => {
                const div = document.createElement('div');
                div.className = 'card';

                div.innerHTML = `
                    <img src="http://localhost:3000/public/img/${producto.imagen}" alt="${producto.nombre}"
                         onerror="this.src='https://via.placeholder.com/150?text=Sin+Imagen'">
                    <h3>${producto.nombre}</h3>
                    <p class="precio">$${producto.precio}</p>
                    <p>Stock: ${producto.stock}</p>
                `;

                // 👉 ABRIR MODAL
                div.addEventListener("click", () => mostrarModal(producto));

                contenedor.appendChild(div);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            const contenedor = document.getElementById('contenedor');
            if(contenedor) {
                contenedor.innerHTML = '<p style="color:red">Error al cargar productos.</p>';
            }
        });
}

// Cargar categoría niños (id = 3)
cargarProductos(3);
