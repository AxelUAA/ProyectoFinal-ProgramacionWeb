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
      if (!Array.isArray(data) || data.length === 0) {
        document.getElementById('contenedor').innerHTML = "<p>No se encontraron productos.</p>";
        return;
      }

      // Separar productos en oferta y todos los productos
      const productosEnOferta = data.filter(p => estaEnOferta(p.id));
      
      // Mostrar productos en oferta (si hay)
      if (productosEnOferta.length > 0) {
        mostrarOfertas(productosEnOferta);
      }

      // Mostrar todos los productos (incluyendo los que están en oferta)
      mostrarProductos(data, 'contenedor');
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

// Función para mostrar productos en oferta
function mostrarOfertas(productos) {
  const contenedorOfertas = document.getElementById('contenedor-ofertas');
  contenedorOfertas.innerHTML = '';

  productos.forEach(producto => {
    const div = crearTarjetaProducto(producto);
    contenedorOfertas.appendChild(div);
  });
}

// Función para mostrar todos los productos
function mostrarProductos(productos, contenedorId) {
  const contenedor = document.getElementById(contenedorId);
  contenedor.innerHTML = '';

  productos.forEach(producto => {
    const div = crearTarjetaProducto(producto);
    contenedor.appendChild(div);
  });
}

// Función para crear tarjeta de producto (con o sin oferta)
function crearTarjetaProducto(producto) {
  const div = document.createElement("div");
  
  if (estaEnOferta(producto.id)) {
    div.className = "card card-oferta";
    
    const descuento = obtenerDescuento(producto.id);
    const precioOferta = calcularPrecioOferta(producto.precio, producto.id);
    const ahorro = producto.precio - precioOferta;

    div.innerHTML = `
      <div class="card-image-wrapper">
        <span class="badge-oferta">-${descuento}% OFF</span>
        <img src="http://localhost:3000/public/img/${producto.imagen}" alt="${producto.nombre}">
        <button class="quick-view-btn" onclick="event.stopPropagation();">👁</button>
      </div>
      <div class="card-content">
        <span class="card-category">SNEAKERCLON5G</span>
        <h3>${producto.nombre}</h3>
        <p class="precio-original">Antes: $${producto.precio}</p>
        <p class="precio-oferta">$${precioOferta.toFixed(2)}</p>
        <span class="ahorro">¡Ahorras $${ahorro.toFixed(2)}!</span>
        <span class="stock-badge ${producto.stock < 5 && producto.stock > 0 ? 'bajo-stock' : ''}">
          ${producto.stock > 0 ? `Stock: ${producto.stock}` : "Sin Stock"}
        </span>
      </div>
      ${producto.stock === 0 ? '<div class="sin-stock-overlay"><span class="sin-stock-text">Agotado</span></div>' : ''}
    `;
  } else {
    div.className = "card";
    
    div.innerHTML = `
      <div class="card-image-wrapper">
        <span class="card-badge">NEW</span>
        <img src="http://localhost:3000/public/img/${producto.imagen}" alt="${producto.nombre}">
        <button class="quick-view-btn" onclick="event.stopPropagation();">👁</button>
      </div>
      <div class="card-content">
        <span class="card-category">SNEAKERCLON5G</span>
        <h3>${producto.nombre}</h3>
        <p class="precio">$${producto.precio}</p>
        <span class="stock-badge ${producto.stock < 5 && producto.stock > 0 ? 'bajo-stock' : ''}">
          ${producto.stock > 0 ? `Stock: ${producto.stock}` : "Sin Stock"}
        </span>
      </div>
      ${producto.stock === 0 ? '<div class="sin-stock-overlay"><span class="sin-stock-text">Agotado</span></div>' : ''}
    `;
  }

  // Evento click para abrir modal
  div.addEventListener("click", () => {
    mostrarModal(producto);
  });

  return div;
}
