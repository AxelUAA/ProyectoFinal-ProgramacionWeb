// Archivo: js/productos-categoria.js

function cargarProductos(idCategoria) {
    const url = `http://localhost:3000/api/productos/categoria/${idCategoria}`;
    
    fetch(url)
        .then(res => res.json())
        .then(data => {
            const contenedor = document.getElementById('contenedor');

            // Limpiamos el contenedor por si acaso
            contenedor.innerHTML = '';

            if (!Array.isArray(data) || data.length === 0) {
                contenedor.innerHTML = '<p>No se encontraron productos en esta categoría.</p>';
                return;
            }

            data.forEach(producto => {
                const div = document.createElement('div');
                div.className = 'card';

                div.innerHTML = `
                    <img src="img/${producto.imagen}" alt="${producto.nombre}"
                         onerror="this.src='https://via.placeholder.com/150?text=Sin+Imagen'">
                    <h3>${producto.nombre}</h3>
                    <p class="precio">$${producto.precio}</p>
                    <p>Stock: ${producto.stock}</p>
                `;

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
// Cargar productos de la categoría "Hombre" (idCategoria = 1)
cargarProductos(3);