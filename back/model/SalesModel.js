// back/model/SalesModel.js
const pool = require('../db/conexion'); 

async function getSalesByCategory() {
    const [rows] = await pool.query(
        'SELECT categoria, ventas_totales FROM ventas_por_cat'
    );
    return rows;
}

module.exports = {
    getSalesByCategory
};
