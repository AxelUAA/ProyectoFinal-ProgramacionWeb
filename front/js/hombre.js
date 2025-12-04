// Variable global para almacenar todos los productos
let productosHombre = [];

// Cargar productos de la categoría Hombre (1)
function cargarProductosHombre() {
    fetch("http://localhost:3000/api/productos/categoria/1")
        .then(res => res.json())
        .then(data => {
            if (!Array.isArray(data) || data.length === 0) {
                document.getElementById("contenedor").innerHTML = "<p>No se encontraron productos.</p>";
                return;
            }
            
            productosHombre = data;
            mostrarProductos(productosHombre);
        })
        .catch(err => {
            console.error("Error:", err);
        });
}

// Mostrar productos en el DOM (con soporte de ofertas)
function mostrarProductos(productos) {
    const contenedor = document.getElementById("contenedor");
    contenedor.innerHTML = "";

    if (productos.length === 0) {
        contenedor.innerHTML = "<p>No se encontraron productos en este rango de precio.</p>";
        return;
    }

    productos.forEach(producto => {
        const div = document.createElement("div");
        
        // Verificar si está en oferta
        if (estaEnOferta(producto.id)) {
            div.className = "card card-oferta";
            
            const descuento = obtenerDescuento(producto.id);
            const precioOferta = calcularPrecioOferta(producto.precio, producto.id);
            const ahorro = producto.precio - precioOferta;

            div.innerHTML = `
                <span class="badge-oferta">-${descuento}% OFF</span>
                <img src="http://localhost:3000/public/img/${producto.imagen}" alt="${producto.nombre}">
                <h3>${producto.nombre}</h3>
                <p class="precio-original">Antes: $${producto.precio}</p>
                <p class="precio-oferta">$${precioOferta.toFixed(2)}</p>
                <p class="ahorro">¡Ahorras $${ahorro.toFixed(2)}!</p>
                <p>Stock: ${producto.stock}</p>
            `;
        } else {
            div.className = "card";
            
            div.innerHTML = `
                <img src="http://localhost:3000/public/img/${producto.imagen}" alt="${producto.nombre}">
                <h3>${producto.nombre}</h3>
                <p class="precio">$${producto.precio}</p>
                <p>Stock: ${producto.stock}</p>
            `;
        }

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

    // Actualizar valores mostrados
    precioMin.addEventListener("input", () => {
        valorMin.textContent = precioMin.value;
    });

    precioMax.addEventListener("input", () => {
        valorMax.textContent = precioMax.value;
    });

    // Aplicar filtro
    btnFiltrar.addEventListener("click", () => {
        const min = parseInt(precioMin.value);
        const max = parseInt(precioMax.value);

        if (min > max) {
            alert("El precio mínimo no puede ser mayor que el máximo");
            return;
        }

        const productosFiltrados = productosHombre.filter(p => 
            p.precio >= min && p.precio <= max
        );

        mostrarProductos(productosFiltrados);
    });

    // Limpiar filtro
    btnLimpiar.addEventListener("click", () => {
        precioMin.value = 0;
        precioMax.value = 10000;
        valorMin.textContent = "0";
        valorMax.textContent = "10000";
        mostrarProductos(productosHombre);
    });
}

// Ejecutar
cargarProductosHombre();
inicializarFiltros();

