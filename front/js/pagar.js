// ======================================================
// ===============  MANEJO DEL CARRITO  ==================
// ======================================================

// Referencias del carrito (parte superior)
const carritoLista = document.getElementById("carritoLista");
const carritoTotal = document.getElementById("carritoTotal");
const itemsCount = document.getElementById("itemsCount");
const carritoEmpty = document.getElementById("carritoEmpty");
const btnVaciar = document.getElementById("btnVaciarCarrito");
const btnFinalizar = document.getElementById("btnFinalizar");

// Referencias del resumen final
const listaProductos = document.getElementById("listaProductos");
const totalPago = document.getElementById("totalPago");
const totalPagoFinal = document.getElementById("totalPagoFinal");


// ============================
// CARGAR CARRITO SUPERIOR
// ============================

function cargarCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    carritoLista.innerHTML = "";
    let total = 0;
    let totalItems = 0;

    if (carrito.length === 0) {
        carritoEmpty.classList.add("show");
        itemsCount.textContent = "0 items";
    } else {
        carritoEmpty.classList.remove("show");
        
        carrito.forEach((item, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <span>${item.nombre} - $${item.precio} x ${item.cantidad}</span>
                <button class="btn-eliminar" data-index="${index}">🗑️ Eliminar</button>
            `;
            carritoLista.appendChild(li);

            total += item.precio * item.cantidad;
            totalItems += item.cantidad;
        });

        itemsCount.textContent = `${totalItems} ${totalItems === 1 ? 'item' : 'items'}`;
    }

    carritoTotal.textContent = total;

    // Botones para eliminar uno
    document.querySelectorAll(".btn-eliminar").forEach(btn => {
        btn.addEventListener("click", () => eliminarProducto(btn.dataset.index));
    });
}


// ============================
// ELIMINAR PRODUCTO
// ============================

function eliminarProducto(index) {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    carrito.splice(index, 1);

    localStorage.setItem("carrito", JSON.stringify(carrito));

    cargarCarrito();
    cargarResumenCarrito();
}



// ============================
// VACIAR CARRITO
// ============================

btnVaciar.addEventListener("click", () => {
    Swal.fire({
        title: "¿Vaciar carrito?",
        text: "Todos los productos serán eliminados.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, vaciar",
        cancelButtonText: "Cancelar"
    }).then(result => {
        if (result.isConfirmed) {
            localStorage.removeItem("carrito");
            cargarCarrito();
            cargarResumenCarrito();

            Swal.fire("Carrito vacío", "Se eliminaron todos los productos.", "success");
        }
    });
});



// ============================
// FINALIZAR COMPRA (mostrar sección de pago)
// ============================

btnFinalizar.addEventListener("click", () => {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    if (carrito.length === 0) {
        Swal.fire({
            icon: "warning",
            title: "Carrito vacío",
            text: "Agrega productos antes de continuar."
        });
        return;
    }

    document.getElementById("seccionFinalizar").classList.remove("hidden");

    document.getElementById("seccionFinalizar").scrollIntoView({
        behavior: "smooth"
    });

    cargarResumenCarrito();
});



// ======================================================
// ==============  RESUMEN DEL PEDIDO  ==================
// ======================================================

function cargarResumenCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    listaProductos.innerHTML = "";
    let total = 0;

    carrito.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.nombre} - $${item.precio} x ${item.cantidad}`;
        listaProductos.appendChild(li);

        total += item.precio * item.cantidad;
    });

    totalPago.textContent = total;
    if (totalPagoFinal) totalPagoFinal.textContent = total;
}



// ======================================================
// ============  MÉTODOS DE PAGO Y VALIDACIÓN  ==========
// ======================================================

// Botones de métodos
const metodoBtns = document.querySelectorAll(".metodo-btn");
const formEnvio = document.getElementById("formEnvio");
const formTarjeta = document.getElementById("formTarjeta");
const infoTransferencia = document.getElementById("infoTransferencia");
const infoOxxo = document.getElementById("infoOxxo");
const btnPagar = document.getElementById("btnPagar");

let metodoSeleccionado = null;


// Quitar selección visual
function limpiarSeleccion() {
    metodoBtns.forEach(b => b.classList.remove("activo"));
}


// Seleccionar método
metodoBtns.forEach(btn => {
    btn.addEventListener("click", () => {

        metodoSeleccionado = btn.dataset.metodo;

        limpiarSeleccion();
        btn.classList.add("activo");

        // SIEMPRE mostrar datos de envío
        formEnvio.classList.remove("hidden");

        // Ocultar todo
        formTarjeta.classList.add("hidden");
        infoTransferencia.classList.add("hidden");
        infoOxxo.classList.add("hidden");

        // Mostrar lo que corresponde
        if (metodoSeleccionado === "tarjeta") formTarjeta.classList.remove("hidden");
        if (metodoSeleccionado === "transferencia") infoTransferencia.classList.remove("hidden");
        if (metodoSeleccionado === "oxxo") infoOxxo.classList.remove("hidden");

        btnPagar.classList.remove("hidden");
    });
});



// ======================================================
// ====================== Pagar =========================
// ======================================================

btnPagar.addEventListener("click", async () => {

    if (!metodoSeleccionado) {
        return Swal.fire({ icon: "warning", title: "Selecciona un método de pago" });
    }

    // Validar envío
    const camposEnvio = ["envNombre", "envDireccion", "envCiudad", "envCP", "envTel"];
    for (const id of camposEnvio) {
        if (document.getElementById(id).value.trim() === "") {
            return Swal.fire({
                icon: "warning",
                title: "Datos incompletos",
                text: "Llena todos los campos."
            });
        }
    }

    // Validación de tarjeta
    if (metodoSeleccionado === "tarjeta") {
        const numero = document.getElementById("numeroTarjeta").value.trim();
        const cvv = document.getElementById("cvv").value.trim();

        if (numero.length !== 16 || cvv.length !== 3) {
            return Swal.fire({ icon: "error", title: "Tarjeta inválida" });
        }
    }

    // Obtener carrito
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // 1️⃣ Verificar stock en servidor
    const verificar = await fetch("http://localhost:3000/api/sales/verificar-stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ carrito })
    });

    const respuesta = await verificar.json();

    if (!respuesta.ok) {
        return Swal.fire("Stock insuficiente", respuesta.message, "error");
    }

    // 2️⃣ Procesar pago
    const pagar = await fetch("http://localhost:3000/api/sales/pagar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            carrito,
            metodo: metodoSeleccionado,
            envio: {
                nombre: document.getElementById("envNombre").value,
                direccion: document.getElementById("envDireccion").value,
                ciudad: document.getElementById("envCiudad").value,
                cp: document.getElementById("envCP").value,
                tel: document.getElementById("envTel").value
            }
        })
    });

    const pagoFinal = await pagar.json();

    if (!pagoFinal.ok) {
        return Swal.fire("Error", pagoFinal.message, "error");
    }

    // 3️⃣ Limpiar carrito
    localStorage.removeItem("carrito");

    Swal.fire({
        icon: "success",
        title: "Compra completada",
        text: "Gracias por tu compra!"
    }).then(() => {
        window.location.href = "index.html";
    });

});




// ============================
// INICIALIZAR
// ============================

cargarCarrito();
