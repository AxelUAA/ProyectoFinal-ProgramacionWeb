// back/controllers/salesController.js
const SalesModel = require('../model/SalesModel');

// GET /api/admin/dashboard/sales-by-category
const getSalesByCategory = async (req, res) => {
    try {
        const data = await SalesModel.getSalesByCategory();

        // Transformación para Chart.js
        const result = {
            labels: data.map(row => row.categoria),
            values: data.map(row => row.ventas_totales)
        };

        res.json(result);

    } catch (error) {
        console.error('Error al obtener ventas por categoría:', error);
        res.status(500).json({ mensaje: 'Error al obtener ventas por categoría' });
    }
};

module.exports = {
    getSalesByCategory
};
