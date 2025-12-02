// back/controllers/salesController.js
const SalesModel = require("../model/SalesModel2");
const db = require("../db/conexion");
const pdb = db.promise(); // promesas para consultas ad-hoc
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require ('path');

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
    //dar descuento de 100 pesos
    if(coupon === 'promo2025') descuento = 100;
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
      pais: pais,
      metodo_pago: metodo,
      subtotal: subtotal,
      descuento: descuento,
      impuestos: impuesto,
      envio: shipping,
      total_final: total
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
// api para mandar el recibo por correo al cliente
exports.enviarRecibo = async (req, res) => {
  try {
    
    // 1. Recibir datos (SIN CAMBIOS DE VARIABLES)
    const { ventaId } = req.body; 

    if (!ventaId) {
      return res.status(400).json({ ok: false, message: "Falta el ID de la venta" });
    }

    const correo = req.user.correo;
    
    // 2. Obtener venta (SIN CAMBIOS DE LÓGICA)
    const venta = await SalesModel.getVenta(ventaId);
    if (!venta) {
      return res.status(404).json({ ok: false, message: "Venta no encontrada" });
    }

    // =========================================================
    // 3. GENERACIÓN DEL PDF (AQUÍ ES DONDE ESTÁ EL DISEÑO)
    // =========================================================
    const pdfPath = path.join(__dirname, `recibo_${ventaId}.pdf`);
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(pdfPath);
    
    doc.pipe(stream);

    // --- RUTA DEL LOGO ---
    // Asegúrate que esta imagen exista en tu carpeta public/img
    const logoPath = path.join(__dirname, "../public/img/logo.jpg");

    // --- ENCABEZADO CON LOGO Y LEMA ---
    if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 50, 45, { width: 60 }); // Logo a la izquierda
    }

    // Título de la empresa (A la derecha del logo)
    doc.font('Helvetica-Bold')
       .fontSize(20)
       .text('SNEAKERS CLON 5G', 120, 55); 

    // Lema (Debajo del título)
    doc.font('Helvetica-Oblique') // Cursiva
       .fontSize(10)
       .fillColor('#555555') // Un gris elegante
       .text('"EL ORIGINAL ERES TÚ"', 120, 80);

    // Línea separadora
    doc.moveTo(50, 110).lineTo(550, 110).strokeColor('#aaaaaa').stroke();

    // --- TÍTULO DEL DOCUMENTO ---
    doc.moveDown(4);
    doc.fillColor('black').font('Helvetica-Bold').fontSize(16)
       .text('RECIBO DE COMPRA', { align: 'center' });
    doc.moveDown();

    // --- DETALLES DE LA VENTA ---
    doc.font('Helvetica').fontSize(12);
    
    // Usamos las variables que ya traes de tu base de datos (venta.nombre, venta.direccion, etc.)
    doc.text(`ID de Venta: #${ventaId}`, { align: 'right' });
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, { align: 'right' });
    
    doc.moveDown();
    doc.font('Helvetica-Bold').text('Información del Cliente:');
    doc.font('Helvetica').text(`Nombre: ${venta.nombre}`);
    doc.text(`Dirección: ${venta.direccion}`);
    doc.text(`Ciudad: ${venta.ciudad}, CP: ${venta.cp}`);
    doc.text(`Teléfono: ${venta.telefono}`); // Agregué teléfono que vi en tu BD
    
    doc.moveDown();
    doc.font('Helvetica-Bold').text('Detalles del Pago:');
    doc.font('Helvetica');
    doc.text(`Método de Pago: ${venta.metodo_pago}`);
    
    // Si tienes envío, subtotal e impuestos en 'venta', puedes agregarlos aquí.
    // Por seguridad, solo pondré el total que sé que ya funciona:
    
    doc.moveDown(2);
    
    // --- CUADRO DEL TOTAL ---
    // Dibujar un rectángulo gris claro de fondo
    doc.rect(50, doc.y, 500, 30).fill('#f0f0f0');
    doc.fillColor('black'); // Volver a texto negro
    
    // Escribir el total encima del rectángulo (ajustamos Y ligeramente)
    doc.font('Helvetica-Bold').fontSize(14)
       .text(`TOTAL PAGADO: $${venta.total} MXN`, 60, doc.y - 22, { align: 'right' });

    // --- PIE DE PÁGINA ---
    doc.moveDown(4);
    doc.fontSize(10).font('Helvetica-Oblique').fillColor('grey')
       .text('Gracias por tu preferencia.', { align: 'center' });

    doc.end();

    // =========================================================
    // 4. ENVÍO DEL CORREO (ESPERAMOS A QUE TERMINE EL PDF)
    // =========================================================
    stream.on('finish', async () => {
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: "alejandro.cuabe@gmail.com",
                    pass: "xhdd ufyb amol xbbs"
                }
            });

            await transporter.sendMail({
                from: '"Sneakers Clon 5G" <alejandro.cuabe@gmail.com>',
                to: correo,
                subject: `Recibo de compra #${ventaId}`,
                // Usamos HTML en el cuerpo del correo también para que se vea bien
                html: `
                    <h2>¡Gracias por tu compra!</h2>
                    <p>Hola <b>${venta.nombre}</b>, adjuntamos tu recibo de compra.</p>
                    <p><i>"EL ORIGINAL ERES TÚ"</i></p>
                    <p>Atte: <b>SNEAKERS CLON 5G</b></p>
                `,
                attachments: [
                    {
                        filename: `recibo_${ventaId}.pdf`,
                        path: pdfPath
                    }
                ]
            });

            // Borrar el archivo temporal
            fs.unlinkSync(pdfPath);

            console.log("✅ Recibo enviado correctamente.");
            return res.json({
                ok: true,
                message: "Recibo enviado correctamente al cliente"
            });

        } catch (errorCorreo) {
            console.error("Error enviando email:", errorCorreo);
            return res.status(500).json({ ok: false, message: "Error enviando el email" });
        }
    });

  } catch (err) {
    console.error("Error general en enviarRecibo:", err);
    return res.status(500).json({ ok: false, message: "Error interno procesando recibo" });
  }
};