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
            const logoPath = path.join(__dirname, "../public/img/logo.jpg");

            // ===========================
            // 3) OPCIONES DEL CORREO
            // ===========================
            const mailOptions = {
                from: '"Sneakers Clon 5G" <alejandro.cuabe@gmail.com>',
                to: correo,
                subject: "¡Bienvenido a SNEAKERS CLON 5G!",
                html: `
                    <div style="text-align:left;">
                    <img src="cid:logoSneakers" alt="Logo" style="width:150px; margin-bottom:20px;" />
                    </div>
                    <h2>Hola ${nombre} 👋</h2>
                    <p>Gracias por registrarte en <b>Sneakers Clon 5G</b>.</p>
                    <p>EL ORIGINAL ERES TÚ</p>
                    <p>Aquí tienes un cupón especial de bienvenida:</p>
                    <p><b>🎁 CUPÓN DE DESCUENTO ESPECIAL</b></p>
                    <p>Utilízalo en tu próxima compra.</p>
                    <p>¡Gracias por confiar en nosotros!</p>
                `,
                attachments: [
                    {
                        filename: "cupon.png",
                        path: cuponPath,
                    },
                    {
                        filename: "logo.jpg",
                        path: logoPath,
                        cid: "logoSneakers"
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

// API para responder un comentario y enviar correo
router.post('/responderComentario', async (req, res) => {
    const { correo, respuesta } = req.body;

    // Validación
    if (!correo || !respuesta) {
        return res.status(400).json({ message: "El correo y la respuesta son obligatorios" });
    }

    // 1) CONFIGURAR TRANSPORTER
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "alejandro.cuabe@gmail.com",
            pass: "xhdd ufyb amol xbbs"
        }
    });

    // 2) RUTA DEL LOGO
    const logoPath = path.join(__dirname, "../public/img/logo.jpg");

    // 3) OPCIONES DEL CORREO
    const mailOptions = {
        from: '"Sneakers Clon 5G" <alejandro.cuabe@gmail.com>',
        to: correo,
        subject: "Respuesta a tu comentario - SNEAKERS CLON 5G",
        html: `
            <div style="text-align:left;">
                <img src="cid:logoSneakers" alt="Logo" style="width:150px; margin-bottom:20px;" />
            </div>
            <h2>Hola 👋</h2>
            <p>Gracias por ponerte en contacto con <b>Sneakers Clon 5G</b>.</p>
            <p>¡EL ORIGINAL ERES TÚ!</p>
            <p>Hemos recibido tu comentario</p>
            <h1>En breve será atendido</h1>
            <blockquote style="border-left:3px solid #4CAF50; padding-left:10px; color:#333;">
            
            </blockquote>
            <p>Nos alegra que formes parte de nuestra comunidad.</p>
            <p>¡Gracias por confiar en nosotros!</p>
        `,
        attachments: [
            {
                filename: "logo.jpg",
                path: logoPath,
                cid: "logoSneakers" // Content-ID para usar inline
            }
        ]
    };

    // 4) ENVIAR CORREO
    try {
        await transporter.sendMail(mailOptions);
        console.log("Respuesta enviada a:", correo);
        return res.json({ message: "Respuesta enviada correctamente" });
    } catch (mailErr) {
        console.error("Error al enviar correo:", mailErr);
        return res.status(500).json({ message: "Error al enviar la respuesta" });
    }
});
//api para verificar si el correo existe en la base de datos
/*router.get('/verificarCorreo/:correo', (req, res) => {
    const correo = req.params.correo;
    const sql = 'SELECT * FROM usuarios WHERE correo = ?';

    db.query(sql, [correo], (err, results) => {
        if (err) {
            console.error('Error al verificar el correo:', err);
            return res.status(500).json({ message: 'Error del servidor' });
        }

        if (results.length > 0) {
            return res.json({ exists: true });
        } else {
            return res.json({ exists: false });
        }
    });
});
*/
router.get('/verificarCorreo/:correo', async (req, res) => {
    const correo = req.params.correo;
    const sql = 'SELECT * FROM usuarios WHERE correo = ?';

    db.query(sql, [correo], async (err, results) => {
        if (err) {
            console.error('Error al verificar el correo:', err);
            return res.status(500).json({ message: 'Error del servidor' });
        }

        // SI EL CORREO NO EXISTE
        if (results.length === 0) {
            return res.json({ exists: false });
        }

        // ================================
        //  1) GENERAR CLAVE ALEATORIA
        // ================================
        const codigo = Math.floor(100000 + Math.random() * 900000); // Ej: 348192

        // ================================
        // 2) Guardar el código en la base de datos
        const sqlUpdate = "UPDATE usuarios SET codigo = ? WHERE correo = ?";

        db.query(sqlUpdate, [codigo, correo], async (updateErr) => {
            if (updateErr) {
                console.error("Error al guardar el código:", updateErr);
                return res.status(500).json({ message: "Error al guardar el código" });
            }
        });

        // ================================
        //  2) CONFIGURAR TRANSPORTER
        // ================================
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "alejandro.cuabe@gmail.com",
                pass: "xhdd ufyb amol xbbs"
            }
        });

        // ================================
        //  3) RUTA DEL LOGO
        // ================================
        const logoPath = path.join(__dirname, "../public/img/logo.jpg");

        // ================================
        //  4) OPCIONES DEL CORREO
        // ================================
        const mailOptions = {
            from: '"Sneakers Clon 5G" <alejandro.cuabe@gmail.com>',
            to: correo,
            subject: "Código de recuperación - SNEAKERS CLON 5G",
            html: `
                <div style="text-align:left;">
                    <img src="cid:logoSneakers" alt="Logo" style="width:150px; margin-bottom:20px;" />
                </div>
                <h2>Recuperación de acceso</h2>
                <p>Hola, hemos recibido una solicitud para recuperar tu acceso.</p>
                <p>Tu código de verificación es:</p>

                <h1 style="color:#4CAF50; letter-spacing:5px;">${codigo}</h1>

                <p>Ingresa este código en la página de verificación.</p>
                <p>Si tú no solicitaste esto, simplemente ignora este mensaje.</p>
                <br>
                <p><b>Sneakers Clon 5G</b></p>
                <p>¡EL ORIGINAL ERES TÚ!</p>
            `,
            attachments: [
                {
                    filename: "logo.jpg",
                    path: logoPath,
                    cid: "logoSneakers"
                }
            ]
        };

        // ================================
        //  5) ENVIAR CORREO
        // ================================
        try {
            await transporter.sendMail(mailOptions);
            console.log("Código enviado a:", correo);

            return res.json({
                exists: true,
                codigo: codigo // opcional por si quieres usarlo en frontend
            });

        } catch (mailErr) {
            console.error("Error al enviar código:", mailErr);
            return res.status(500).json({ message: "Error al enviar el correo" });
        }
    });
});

//api que verifica el codigo que llega al correo con el de 
router.post('/verificarCodigo', (req, res) => {
    const {codigo } = req.body;
    const sql = 'SELECT * FROM usuarios WHERE codigo = ?';
    db.query(sql, [codigo], (err, results) => {
        if (err) {
            console.error('Error al verificar el código:', err);
            return res.status(500).json({ message: 'Error del servidor' });
        }
        if (results.length > 0) {
            return res.json({ valid: true });
        } else {
            return res.json({ valid: false });
        }
    });
});


router.put('/actualizarPassword', (req, res) => {
    console.log('✅ Entró a /actualizarPassword');
    const { codigo, newPassword, newPassword2 } = req.body;

    // Mostrar en consola lo que llega del front
    console.log('Datos recibidos del frontend:', { codigo, newPassword, newPassword2 });

    if (newPassword !== newPassword2) {
        return res.status(400).json({ message: 'Las contraseñas no coinciden' });
    }

    if (newPassword.length < 8) {
        return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres' });
    }

    const sql = 'UPDATE usuarios SET password = ? WHERE codigo = ?';
    db.query(sql, [newPassword, codigo], (err, result) => {
        if (err) {
            console.error('Error al actualizar la contraseña:', err);
            return res.status(500).json({ message: 'Error del servidor' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        return res.json({ message: 'Contraseña actualizada correctamente' });
    });
});

module.exports = router;
