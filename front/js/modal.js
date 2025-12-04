// ===== FUNCION PARA MOSTRAR MODAL =====
function mostrarModal(producto) {

    // Guardar producto actual para el botón "Agregar al carrito"
    window.productoActual = producto;

    document.getElementById("modal-img").src = "http://localhost:3000/public/img/" + producto.imagen;
    document.getElementById("modal-nombre").textContent = producto.nombre;
    
    // Verificar si el producto está en oferta
    const modalPrecio = document.getElementById("modal-precio");
    if (estaEnOferta(producto.id)) {
        const precioOriginal = producto.precio;
        const precioConDescuento = calcularPrecioOferta(producto.precio, producto.id);
        const descuento = obtenerDescuento(producto.id);
        
        modalPrecio.innerHTML = `
            <span style="text-decoration: line-through; color: #999; font-size: 16px;">$${precioOriginal}</span>
            <span style="color: #2e8b57; font-size: 24px; font-weight: bold; margin-left: 10px;">$${precioConDescuento}</span>
            <span style="background: #ff4444; color: white; padding: 4px 8px; border-radius: 5px; font-size: 12px; margin-left: 10px;">-${descuento}% OFF</span>
        `;
    } else {
        modalPrecio.textContent = "$" + producto.precio;
    }
    
    document.getElementById("modal-stock").textContent = "Stock disponible: " + producto.stock;
    document.getElementById("modal-desc").textContent = producto.descripcion || "Sin descripción";

    const btnAgregar = document.getElementById("modal-cart-btn");
    const btnFavorito = document.getElementById("modal-favorito-btn");
    const estaLogueado = !!localStorage.getItem("currentUserName");

    // === Mostrar u ocultar botón carrito ===
    if (btnAgregar) {
        if (estaLogueado) {
            btnAgregar.style.visibility = "visible";
            btnAgregar.style.height = "auto";
            btnAgregar.style.padding = "8px 14px";
            btnAgregar.style.marginTop = "12px";
        } else {
            btnAgregar.style.visibility = "hidden";
            btnAgregar.style.height = "0px";
            btnAgregar.style.padding = "0";
            btnAgregar.style.marginTop = "0";
        }
    }

    // === Mostrar u ocultar botón favoritos ===
    if (btnFavorito) {
        if (estaLogueado) {
            btnFavorito.style.display = "block";
            
            // Verificar si ya está en favoritos
            if (typeof verificarEnFavoritos === 'function') {
                verificarEnFavoritos(producto.id).then(enFavoritos => {
                    actualizarBotonFavorito(producto.id, enFavoritos);
                });
            }
        } else {
            btnFavorito.style.display = "none";
        }
    }

    document.getElementById("modal-producto").style.display = "flex";
}

// ===== CERRAR MODAL =====
document.addEventListener("DOMContentLoaded", () => {

    const modal = document.getElementById("modal-producto");
    const closeBtn = document.getElementById("modal-close");

    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
        });
    }

    modal.addEventListener("click", (e) => {
        if (e.target.id === "modal-producto") {
            modal.style.display = "none";
        }
    });

    // ===== AGREGAR PRODUCTO AL CARRITO =====
    const modalCartBtn = document.getElementById("modal-cart-btn");
    if (modalCartBtn) {
        modalCartBtn.addEventListener("click", () => {
            if (!window.productoActual) return;

            let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

            let productoEnCarrito = carrito.find(p => p.id === window.productoActual.id);
            
            // Calcular precio con descuento si aplica
            const precioFinal = estaEnOferta(window.productoActual.id) 
                ? calcularPrecioOferta(window.productoActual.precio, window.productoActual.id)
                : window.productoActual.precio;

            // 1️⃣ Si el producto ya existe, validar stock
            if (productoEnCarrito) {
                if (productoEnCarrito.cantidad + 1 > window.productoActual.stock) {
                    return Swal.fire("Sin stock", "No puedes agregar más unidades.", "warning");
                }
                productoEnCarrito.cantidad++;
            } else {
                // 2️⃣ Si no existe, validar stock
                if (window.productoActual.stock < 1) {
                    return Swal.fire("Sin stock", "Producto agotado.", "warning");
                }

                carrito.push({
                    id: window.productoActual.id,
                    nombre: window.productoActual.nombre,
                    precio: precioFinal,
                    precioOriginal: window.productoActual.precio,
                    imagen: window.productoActual.imagen,
                    cantidad: 1,
                    tieneDescuento: estaEnOferta(window.productoActual.id),
                    descuento: estaEnOferta(window.productoActual.id) ? obtenerDescuento(window.productoActual.id) : 0
                });
            }

            localStorage.setItem("carrito", JSON.stringify(carrito));

            Swal.fire("Agregado", "Producto añadido al carrito", "success");
        });
    } else {
        console.warn('Botón #modal-cart-btn no encontrado en el DOM. Si el modal aparece sin el botón, añade el HTML del botón o incluye el modal desde una plantilla común.');
    }

    // ===== BOTÓN DE FAVORITOS (inicialmente no hace nada, se configura en mostrarModal) =====
    // El onclick se asigna dinámicamente en la función actualizarBotonFavorito()

});
