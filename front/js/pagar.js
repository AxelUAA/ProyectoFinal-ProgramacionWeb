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
const envioSpan = document.getElementById("envio");
const impuestoSpan = document.getElementById("impuesto");
const descuentoSpan = document.getElementById("descuento");


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
    <div class="producto-info">
        <span class="producto-nombre">${item.nombre}</span>
        <span class="producto-precio">$${item.precio}</span>
    </div>

    <div class="cantidad-controls">
        <button class="btn-cantidad btn-menos" data-index="${index}">−</button>
        <span class="cantidad-display">${item.cantidad}</span>
        <button class="btn-cantidad btn-mas" data-index="${index}">+</button>
    </div>

    <button class="btn-eliminar" data-index="${index}">🗑️</button>
`;

            carritoLista.appendChild(li);

            total += item.precio * item.cantidad;
            totalItems += item.cantidad;
        });

        itemsCount.textContent = `${totalItems} ${totalItems === 1 ? 'item' : 'items'}`;
    }

    carritoTotal.textContent = total;

    // Botones para eliminar
    document.querySelectorAll(".btn-eliminar").forEach(btn => {
        btn.addEventListener("click", () => eliminarProducto(btn.dataset.index));
    });
    
    // Botones de cantidad
    document.querySelectorAll(".btn-mas").forEach(btn => {
        btn.addEventListener("click", () => aumentarCantidad(btn.dataset.index));
    });
    
    document.querySelectorAll(".btn-menos").forEach(btn => {
        btn.addEventListener("click", () => disminuirCantidad(btn.dataset.index));
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

// Actualizar cantidad
function actualizarCantidad(index, nuevaCantidad) {
    nuevaCantidad = parseInt(nuevaCantidad);

    if (nuevaCantidad <= 0) return;

    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    carrito[index].cantidad = nuevaCantidad;

    localStorage.setItem("carrito", JSON.stringify(carrito));

    cargarCarrito();
    cargarResumenCarrito();
}

// Aumentar cantidad
function aumentarCantidad(index) {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito[index].cantidad++;
    localStorage.setItem("carrito", JSON.stringify(carrito));
    cargarCarrito();
    cargarResumenCarrito();
}

// Disminuir cantidad
function disminuirCantidad(index) {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    if (carrito[index].cantidad > 1) {
        carrito[index].cantidad--;
        localStorage.setItem("carrito", JSON.stringify(carrito));
        cargarCarrito();
        cargarResumenCarrito();
    }
}


// ============================
// VACIAR CARRITO
// ============================

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

    // calcular impuestos, envío y descuento según país y cupón
    const pais = document.getElementById('envPais') ? document.getElementById('envPais').value : 'Mexico';
    const cupon = localStorage.getItem('cuponAplicado') || null;

    // reglas (puedes ajustarlas):
    const taxRates = { Mexico: 0.16, USA: 0.08, Spain: 0.21, Other: 0.10 };
    const shippingFees = { Mexico: 100, USA: 400, Spain: 800, Other: 500 };

    const taxRate = taxRates[pais] ?? taxRates['Other'];
    const shipping = shippingFees[pais] ?? shippingFees['Other'];

    let descuento = 0;
    if (cupon === 'promo2025') descuento = 100;
    if (descuento > total) descuento = total;

    const impuesto = Math.round(((total - descuento) * taxRate));
    const totalFinal = Math.round(total - descuento + impuesto + shipping);

    totalPago.textContent = total;
    if (envioSpan) envioSpan.textContent = shipping;
    if (impuestoSpan) impuestoSpan.textContent = impuesto;
    if (descuentoSpan) descuentoSpan.textContent = descuento;
    if (totalPagoFinal) totalPagoFinal.textContent = totalFinal;
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
        const camposEnvio = ["envNombre", "envDireccion", "envCiudad", "envCP", "envTel", "envPais"];
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
                tel: document.getElementById("envTel").value,
                pais: document.getElementById("envPais").value
            }
            ,
            coupon: localStorage.getItem('cuponAplicado') || null
        })
    });

    const pagoFinal = await pagar.json();

    if (!pagoFinal.ok) {
        return Swal.fire("Error", pagoFinal.message, "error");
    }

    // 3️⃣ Limpiar carrito
    localStorage.removeItem("carrito");
    localStorage.removeItem('cuponAplicado');

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

// Manejo de cupón y país para recalcular totales
const btnAplicarCupon = document.getElementById('btnAplicarCupon');
const inputCupon = document.getElementById('inputCupon');
const selectPais = document.getElementById('envPais');

if (btnAplicarCupon && inputCupon) {
    btnAplicarCupon.addEventListener('click', () => {
        const code = inputCupon.value.trim();
        if (code === 'promo2025') {
            localStorage.setItem('cuponAplicado', code);
            Swal.fire('Cupón aplicado', 'Se aplicó un descuento de $100', 'success');
        } else {
            localStorage.removeItem('cuponAplicado');
            Swal.fire('Cupón inválido', 'El código no es válido', 'warning');
        }
        cargarResumenCarrito();
    });
}

if (selectPais) {
    selectPais.addEventListener('change', () => cargarResumenCarrito());
}
