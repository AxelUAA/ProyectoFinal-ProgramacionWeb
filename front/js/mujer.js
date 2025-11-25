// Variable global para almacenar todos los productos
let productosMujer = [];

// ===== CARGA DE PRODUCTOS POR CATEGORÍA =====
function cargarProductos(idCategoria) {
    const url = `http://localhost:3000/api/productos/categoria/${idCategoria}`;
    
    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (!Array.isArray(data) || data.length === 0) {
                document.getElementById('contenedor').innerHTML = '<p>No se encontraron productos en esta categoría.</p>';
                return;
            }

            productosMujer = data;
            mostrarProductos(productosMujer);
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('contenedor').innerHTML = '<p style="color:red">Error al cargar productos.</p>';
        });
}

// Mostrar productos en el DOM
function mostrarProductos(productos) {
    const contenedor = document.getElementById('contenedor');
    contenedor.innerHTML = '';

    if (productos.length === 0) {
        contenedor.innerHTML = '<p>No se encontraron productos en este rango de precio.</p>';
        return;
    }

    productos.forEach(producto => {
        const div = document.createElement('div');
        div.className = 'card';

        div.innerHTML = `
            <img src="http://localhost:3000/public/img/${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p class="precio">$${producto.precio}</p>
            <p>Stock: ${producto.stock}</p>
        `;

        div.addEventListener("click", () => {
            mostrarModal(producto);
        });

        contenedor.appendChild(div);
    });
}

// Inicializar filtros de precio
function inicializarFiltros() {
    const precioMin = document.getElementById("precioMin");
    const precioMax = document.getElementById("precioMax");
    const valorMin = document.getElementById("valorMin");
    const valorMax = document.getElementById("valorMax");
    const btnFiltrar = document.getElementById("btnFiltrar");
    const btnLimpiar = document.getElementById("btnLimpiar");

    precioMin.addEventListener("input", () => {
        valorMin.textContent = precioMin.value;
    });

    precioMax.addEventListener("input", () => {
        valorMax.textContent = precioMax.value;
    });

    btnFiltrar.addEventListener("click", () => {
        const min = parseInt(precioMin.value);
        const max = parseInt(precioMax.value);

        if (min > max) {
            alert("El precio mínimo no puede ser mayor que el máximo");
            return;
        }

        const productosFiltrados = productosMujer.filter(p => 
            p.precio >= min && p.precio <= max
        );

        mostrarProductos(productosFiltrados);
    });

    btnLimpiar.addEventListener("click", () => {
        precioMin.value = 0;
        precioMax.value = 10000;
        valorMin.textContent = "0";
        valorMax.textContent = "10000";
        mostrarProductos(productosMujer);
    });
}

// Cargar productos de la categoría Mujer (id = 2)
cargarProductos(2);
inicializarFiltros();

