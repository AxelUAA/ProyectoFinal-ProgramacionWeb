// Rutas para gestionar favoritos
const express = require('express');
const router = express.Router();
const db = require('../db/conexion');

// Obtener todos los favoritos de un usuario
router.get('/:userId', (req, res) => {
    const userId = req.params.userId;
    const query = `
        SELECT p.*, f.id as favorito_id, f.fecha_agregado 
        FROM favoritos f
        INNER JOIN productos p ON f.producto_id = p.id
        WHERE f.user_id = ?
        ORDER BY f.fecha_agregado DESC
    `;

    db.query(query, [userId], (err, results) => {
        if(err){
            console.error('Error al obtener favoritos:', err);
            res.status(500).json({ ok: false, msg: 'Error en el servidor' });
            return;
        }
        res.json({ ok: true, favoritos: results });
    });
});

// Agregar un producto a favoritos
router.post('/', (req, res) => {
    const { user_id, producto_id } = req.body;

    if(!user_id || !producto_id) {
        return res.status(400).json({ ok: false, msg: 'Faltan datos requeridos' });
    }

    const query = 'INSERT INTO favoritos (user_id, producto_id) VALUES (?, ?)';

    db.query(query, [user_id, producto_id], (err, result) => {
        if(err){
            if(err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ ok: false, msg: 'Este producto ya está en tus favoritos' });
            }
            console.error('Error al agregar favorito:', err);
            return res.status(500).json({ ok: false, msg: 'Error en el servidor' });
        }
        res.json({ ok: true, msg: 'Producto agregado a favoritos', id: result.insertId });
    });
});

// Eliminar un producto de favoritos
router.delete('/:userId/:productoId', (req, res) => {
    const { userId, productoId } = req.params;
    const query = 'DELETE FROM favoritos WHERE user_id = ? AND producto_id = ?';

    db.query(query, [userId, productoId], (err, result) => {
        if(err){
            console.error('Error al eliminar favorito:', err);
            return res.status(500).json({ ok: false, msg: 'Error en el servidor' });
        }
        
        if(result.affectedRows === 0) {
            return res.status(404).json({ ok: false, msg: 'Favorito no encontrado' });
        }

        res.json({ ok: true, msg: 'Producto eliminado de favoritos' });
    });
});

// Verificar si un producto está en favoritos
router.get('/check/:userId/:productoId', (req, res) => {
    const { userId, productoId } = req.params;
    const query = 'SELECT id FROM favoritos WHERE user_id = ? AND producto_id = ?';

    db.query(query, [userId, productoId], (err, results) => {
        if(err){
            console.error('Error al verificar favorito:', err);
            return res.status(500).json({ ok: false, msg: 'Error en el servidor' });
        }
        res.json({ ok: true, isFavorite: results.length > 0 });
    });
});

module.exports = router;
