// ===== CONFIGURACIÓN DE OFERTAS =====
// Este objeto define qué productos están en oferta y su porcentaje de descuento
// Formato: { id_producto: porcentaje_descuento }

const OFERTAS = {
    1: 25,   // Producto ID 1 tiene 25% de descuento
    2: 20,   // Producto ID 2 tiene 20% de descuento
    3: 30,   // Producto ID 3 tiene 30% de descuento
    6: 15,   // Producto ID 6 tiene 15% de descuento
    9: 10    // Producto ID 9 tiene 10% de descuento
};

// Función para verificar si un producto está en oferta
function estaEnOferta(idProducto) {
    return OFERTAS.hasOwnProperty(idProducto);
}

// Función para obtener el porcentaje de descuento
function obtenerDescuento(idProducto) {
    return OFERTAS[idProducto] || 0;
}

// Función para calcular el precio con descuento
function calcularPrecioOferta(precio, idProducto) {
    if (!estaEnOferta(idProducto)) {
        return precio;
    }
    
    const descuento = obtenerDescuento(idProducto);
    const precioConDescuento = precio - (precio * descuento / 100);
    return Math.round(precioConDescuento * 100) / 100; // Redondear a 2 decimales
}
