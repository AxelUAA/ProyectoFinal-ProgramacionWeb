//archivo de rutas
const express = require('express');
const router = express.Router();
const db = require('../db/conexion');
const nodemailer = require('nodemailer');
const path = require('path');

//ruta para obtener todos los productos

router.get('/productos', (req, res) =>{
    const query = 'SELECT * FROM productos';

    db.query(query, (err, results)=>{
        if(err){
            console.error('Error al obtener los productos', err);
            res.status(500).send('Error en el servidor');
            return;
        }
        res.json(results);
    });
});

//ruta para obtener un producto por categoria
//categoria 1 = hombre
//categoria 2 = mujer
//categoria 3 = niñ@s

// Ruta para filtrar productos por categoría (1, 2, etc.)
router.get('/productos/categoria/:id', (req, res) => {
    const idCategoria = req.params.id; // Obtiene el número de la URL
    const query = 'SELECT * FROM productos WHERE categoria = ?';

    db.query(query, [idCategoria], (err, results) => {
        if(err){
            console.error('Error al filtrar por categoría:', err);
            res.status(500).send('Error en el servidor');
            return;
        }
        res.json(results);
    });
});

// API para dar de alta un nuevo producto
router.post("/agregarProducto", (req, res) => {
    const { id, nombre, descripcion, precio, stock, imagen, categoria } = req.body;

    // Validación: Todos los campos son obligatorios
    if (!id || !nombre || !descripcion || !precio || !stock || !imagen || !categoria) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const sql = `
        INSERT INTO productos (id, nombre, descripcion, precio, stock, imagen, categoria)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [id, nombre, descripcion, precio, stock, imagen, categoria],
        (err, result) => {
            if (err) {
                console.error("Error al agregar el producto:", err);

                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(409).json({ message: "El ID ya existe, usa otro" });
                }

                return res.status(500).json({ message: "Error del servidor" });
            }

            return res.json({
                message: "Producto agregado correctamente",
                result
            });
        }
    );
});

//api para dar de baja un producto
router.delete('/eliminarProducto/:id', (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM productos WHERE id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error al eliminar el producto:", err);
            return res.status(500).json({ message: "Error del servidor al eliminar" });
        }

        // Verificar si se eliminó alguna fila
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.json({ message: "Producto eliminado correctamente" });
    });
});

//api para modificar un producto
router.put('/modificarProducto/:id', (req, res) => {
    const { id } = req.params; // El ID viene de la URL
    const { nombre, descripcion, precio, stock, imagen, categoria } = req.body; // Los datos nuevos vienen del cuerpo

    // Validación: Asegurarnos que envíen datos
    if (!nombre || !descripcion || !precio || !stock || !imagen || !categoria) {
        return res.status(400).json({ message: "Todos los campos son obligatorios para modificar" });
    }

    const sql = `
        UPDATE productos 
        SET nombre = ?, descripcion = ?, precio = ?, stock = ?, imagen = ?, categoria = ?
        WHERE id = ?
    `;

    db.query(
        sql, 
        [nombre, descripcion, precio, stock, imagen, categoria, id], 
        (err, result) => {
            if (err) {
                console.error("Error al modificar el producto:", err);
                return res.status(500).json({ message: "Error del servidor al modificar" });
            }

            // Verificar si se encontró el producto para modificarlo
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Producto no encontrado (revisa el ID)" });
            }

            res.json({ message: "Producto modificado correctamente" });
        }
    );
});

// API para registrar un nuevo usuario y enviar correo de bienvenida
router.post('/registrarUsuario', (req, res) => {
    
    const { nombre, correo, id, password } = req.body;

    if (!nombre || !correo || !id || !password) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const sql = `
        INSERT INTO usuarios (nombre, correo, id, password, rol) 
        VALUES (?, ?, ?, ?, 'cliente')
    `;

    db.query(
        sql,
        [nombre, correo, id, password],
        async (err, result) => {
            if (err) {
                console.error("Error al registrar el usuario:", err);

                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(409).json({ message: "El ID ya existe, usa otro" });
                }
                return res.status(500).json({ message: "Error del servidor" });
            }

            // ===========================
            // 1) CONFIGURAR TRANSPORTER
            // ===========================
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "alejandro.cuabe@gmail.com",
                    pass: "xhdd ufyb amol xbbs"
                }
            });

            // ===========================
            // 2) RUTA DEL CUPÓN
            // ===========================
            const cuponPath = path.join(__dirname, "../public/img/cupon.png");

            // ===========================
            // 3) OPCIONES DEL CORREO
            // ===========================
            const mailOptions = {
                from: '"Sneakers Clon 5G" <alejandro.cuabe@gmail.com>',
                to: correo,
                subject: "¡Bienvenido a SNEAKERS CLON 5G!",
                html: `
                    <h2>Hola ${nombre} 👋</h2>
                    <p>Gracias por registrarte en <b>Sneakers Clon 5G</b>.</p>
                    <p>Aquí tienes un cupón especial de bienvenida:</p>
                    <p><b>🎁 CUPÓN DE DESCUENTO ESPECIAL</b></p>
                    <p>Utilízalo en tu próxima compra.</p>
                    <p>¡Gracias por confiar en nosotros!</p>
                `,
                attachments: [
                    {
                        filename: "cupon.png",
                        path: cuponPath,
                    }
                ]
            };

            // ===========================
            // 4) ENVIAR CORREO
            // ===========================
            try {
                await transporter.sendMail(mailOptions);
                console.log("Correo enviado a:", correo);
            } catch (mailErr) {
                console.error("Error al enviar correo:", mailErr);
            }

            // ===========================
            // 5) RESPUESTA AL FRONT
            // ===========================
            return res.json({
                message: "Usuario registrado correctamente y correo enviado",
                result
            });
        }
    );
});

module.exports = router;
