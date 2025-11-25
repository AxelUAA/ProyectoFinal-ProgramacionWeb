document.addEventListener('DOMContentLoaded', () => {

  // Mostrar panel admin
  const rol = localStorage.getItem("currentUserRol");
  const email = localStorage.getItem("currentUserEmail");

  if (rol === "admin" || email === "jan.puentes06@gmail.com") {
    document.getElementById("admin-panel").style.display = "block";
  }

  // Cargar productos
  fetch('http://localhost:3000/api/productos')
    .then(res => res.json())
    .then(data => {
      const contenedor = document.getElementById('contenedor');

      if (!Array.isArray(data) || data.length === 0) {
        contenedor.innerHTML = "<p>No se encontraron productos.</p>";
        return;
      }

      data.forEach(producto => {
        const div = document.createElement("div");
        div.className = "card";

        div.innerHTML = `
          <img src="http://localhost:3000/public/img/${producto.imagen}">
          <h3>${producto.nombre}</h3>
          <p class="precio">$${producto.precio}</p>
          <p>Stock: ${producto.stock}</p>
        `;

      div.addEventListener("click", () => {
       mostrarModal(producto);
      });

        contenedor.appendChild(div);
      });
    });

  // Cerrar modal
  document.getElementById("modal-close").onclick = () => {
    document.getElementById("modal-producto").style.display = "none";
  };

  document.getElementById("modal-producto").onclick = (e) => {
    if (e.target.id === "modal-producto") {
      document.getElementById("modal-producto").style.display = "none";
    }
  };
});
