// ===== FUNCION PARA MOSTRAR MODAL =====
function mostrarModal(producto) {
    document.getElementById("modal-img").src = "img/" + producto.imagen;
    document.getElementById("modal-nombre").textContent = producto.nombre;
    document.getElementById("modal-precio").textContent = "$" + producto.precio;
    document.getElementById("modal-stock").textContent = "Stock disponible: " + producto.stock;
    document.getElementById("modal-desc").textContent = producto.descripcion || "Sin descripción";

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
});
