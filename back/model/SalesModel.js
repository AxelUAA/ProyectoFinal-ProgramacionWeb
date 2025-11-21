const db = require('../db/conexion');

const SalesModel = {

    getProductsByCategory: () => {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT categoria, COUNT(*) AS total
                FROM productos
                GROUP BY categoria
            `;

            db.query(sql, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }
};

module.exports = SalesModel;
