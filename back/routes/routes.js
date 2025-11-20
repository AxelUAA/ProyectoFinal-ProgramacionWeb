//archivo de rutas
const express = require('express');
const router = express.Router();
const db = require('../db/conexion');

// Obtener todos los productos
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

// Obtener productos por categoría
router.get('/productos/categoria/:id', (req, res) => {
    const categoriaId = req.params.id;
    const query = 'SELECT * FROM productos WHERE categoria = ?';

    db.query(query, [categoriaId], (err, results) => {
        if(err){
            console.error('Error al obtener productos por categoría', err);
            res.status(500).send('Error en el servidor');
            return;
        }
        res.json(results);
    });
});

//aqui se pueden agregar mas rutas como post o asi
module.exports = router;
