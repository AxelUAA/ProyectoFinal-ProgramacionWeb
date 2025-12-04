// back/controllers/salesController.js
const SalesModel = require("../model/SalesModel2");
const db = require("../db/conexion");
const pdb = db.promise(); // promesas para consultas ad-hoc

// Verificar stock sin modificar BD
exports.verificarStock = async (req, res) => {
  try {
    const { carrito } = req.body;
    if (!Array.isArray(carrito) || carrito.length === 0) return res.json({ ok: false, message: "Carrito vacío" });

    for (const item of carrito) {
      const producto = await SalesModel.getProducto(item.id);
      if (!producto) return res.json({ ok: false, message: `Producto con id ${item.id} no encontrado` });
      if (producto.stock < item.cantidad) {
        return res.json({ ok: false, message: `No hay stock suficiente para ${producto.nombre}. Disponible: ${producto.stock}` });
      }
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Error interno" });
  }
};

// Procesar pago: crear venta, descontar stock, sumar ventas_por_cat
exports.pagar = async (req, res) => {
  try {
    const { carrito, metodo, envio, coupon } = req.body;
    if (!Array.isArray(carrito) || carrito.length === 0) return res.json({ ok: false, message: "Carrito vacío" });

    // 1) Verificar stock de nuevo (para evitar que se venda sin stock) y calcular subtotal
    let subtotal = 0;
    for (const item of carrito) {
      const producto = await SalesModel.getProducto(item.id);
      if (!producto) return res.json({ ok: false, message: `Producto con id ${item.id} no encontrado` });
      if (producto.stock < item.cantidad) {
        return res.json({ ok: false, message: `Stock insuficiente para ${producto.nombre}. Disponible: ${producto.stock}` });
      }
      // Use price from DB to avoid client tampering
      subtotal += producto.precio * item.cantidad;
    }

    // Determinar impuesto y envío según país
    const pais = (envio && envio.pais) ? envio.pais : 'Mexico';
    const taxRates = { Mexico: 0.16, USA: 0.08, Spain: 0.21, Other: 0.10 };
    const shippingFees = { Mexico: 100, USA: 400, Spain: 800, Other: 500 };
    const taxRate = taxRates[pais] ?? taxRates['Other'];
    const shipping = shippingFees[pais] ?? shippingFees['Other'];

    // Coupon
    let descuento = 0;
    if (coupon === 'promo2025') descuento = 100;
    if (descuento > subtotal) descuento = subtotal;

    const impuesto = Math.round((subtotal - descuento) * taxRate);
    const total = Math.round(subtotal - descuento + impuesto + shipping);

    // 2) Crear venta resumen (guardamos los datos básicos)
    const ventaId = await SalesModel.crearVenta({
      nombre: envio.nombre,
      direccion: envio.direccion,
      ciudad: envio.ciudad,
      cp: envio.cp,
      telefono: envio.tel,
      metodo_pago: metodo
    });

    // 3) Para cada item: descontar stock y sumar ventas_por_cat
    for (const item of carrito) {
      const producto = await SalesModel.getProducto(item.id);
      // descontar stock
      await SalesModel.descontarStock(item.id, item.cantidad);
      // sumar ventas por categoria
      await SalesModel.sumarVentaCategoria(producto.categoria, item.cantidad);
    }

    return res.json({ ok: true, message: "Compra procesada correctamente", ventaId, totals: { subtotal, descuento, impuesto, envio: shipping, total } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Error procesando el pago" });
  }
};
