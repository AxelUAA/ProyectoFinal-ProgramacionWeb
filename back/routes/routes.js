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

//aqui se pueden agregar mas rutas como post o asi
module.exports = router;
