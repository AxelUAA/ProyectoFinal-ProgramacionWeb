// ===== FUNCION PARA MOSTRAR MODAL =====
function mostrarModal(producto) {

    // Guardar producto actual para el botón "Agregar al carrito"
    window.productoActual = producto;


    document.getElementById("modal-img").src = "http://localhost:3000/public/img/" + producto.imagen;
    document.getElementById("modal-nombre").textContent = producto.nombre;
    document.getElementById("modal-precio").textContent = "$" + producto.precio;
    document.getElementById("modal-stock").textContent = "Stock disponible: " + producto.stock;
    document.getElementById("modal-desc").textContent = producto.descripcion || "Sin descripción";

    const btnAgregar = document.getElementById("modal-cart-btn");
    const estaLogueado = !!localStorage.getItem("currentUserName");

    // === Mostrar u ocultar botón, PERO sin romper el diseño ===
    if (btnAgregar) {
        if (estaLogueado) {
            btnAgregar.style.visibility = "visible";
            btnAgregar.style.height = "auto";
            btnAgregar.style.padding = "8px 14px";
            btnAgregar.style.marginTop = "12px";
        } else {
            btnAgregar.style.visibility = "hidden"; // no se ve
            btnAgregar.style.height = "0px";        // no ocupa lugar
            btnAgregar.style.padding = "0";         // no empuja nada
            btnAgregar.style.marginTop = "0";       // sin espacio extra
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
    document.getElementById("modal-cart-btn").addEventListener("click", () => {
        if (!window.productoActual) return;

        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

        carrito.push({
            id: window.productoActual.id,
            nombre: window.productoActual.nombre,
            precio: window.productoActual.precio,
            imagen: window.productoActual.imagen,
            cantidad: 1
        });

        localStorage.setItem("carrito", JSON.stringify(carrito));

        Swal.fire("Agregado", "Producto añadido al carrito", "success");
    });


});
