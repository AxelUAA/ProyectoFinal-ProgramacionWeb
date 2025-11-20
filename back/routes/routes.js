//archivo de rutas
const express = require('express');
const router = express.Router();
const db = require('../db/conexion');

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
//aqui se pueden agregar mas rutas como post o asi
module.exports = router;
