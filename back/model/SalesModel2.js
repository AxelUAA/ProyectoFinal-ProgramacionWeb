// back/model/SalesModel.js
const db = require("../db/conexion"); // tu conexion actual

// Usaremos el modo promise para consultas
const pdb = db.promise();

exports.getProducto = async (id) => {
  const [rows] = await pdb.query("SELECT id, nombre, precio, stock, categoria FROM productos WHERE id = ?", [id]);
  return rows[0];
};

exports.descontarStock = async (id, cantidad) => {
  await pdb.query("UPDATE productos SET stock = stock - ? WHERE id = ?", [cantidad, id]);
};

exports.sumarVentaCategoria = async (categoria, cantidad) => {
  await pdb.query("UPDATE ventas_por_cat SET ventas_totales = ventas_totales + ? WHERE categoria = ?", [cantidad, categoria]);
};

exports.crearVenta = async (venta) => {
  const [result] = await pdb.query(
    `INSERT INTO ventas (nombre, direccion, ciudad, cp, telefono, metodo_pago, fecha)
     VALUES (?, ?, ?, ?, ?, ?, NOW())`,
    [venta.nombre, venta.direccion, venta.ciudad, venta.cp, venta.telefono, venta.metodo_pago]
  );
  return result.insertId;
};
