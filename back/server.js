    const express = require('express');
    const cors = require('cors');
    const dotenv = require('dotenv');
    const path = require('path');

    //importar las rutas

    const routes = require('./routes/routes');

    //cargar variables de entorno
    dotenv.config();

    //crear la aplicacion de express
    const app = express();
    const PORT = process.env.PORT || 3000;

    //middlewares
    app.use(cors());
    app.use(express.json());

    /*configurar las rutas para decir que todo lo que venga del archivo 
    de rutas tiene que comenzar con /api */
    app.use('/api', routes);

    //hacemos publica la carpeta front
    //app.use(express.static(path.join(__dirname, '../front')));

    //levantar el servidor
    app.listen(PORT, ()=>{
        console.log(`Servidor back corriendo en http://localhost:${PORT}`);
        console.log(`El front vive en http://localhost:5500/front/`);
    });
