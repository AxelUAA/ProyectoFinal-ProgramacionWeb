const SalesModel = require('../model/SalesModel');

// GET /api/graficas/products-by-category
const getProductsByCategory = async (req, res) => {
    try {
        const rows = await SalesModel.getProductsByCategory();

        const labels = rows.map(row => {
            if (row.categoria == 1) return "Hombre";
            if (row.categoria == 2) return "Mujer";
            if (row.categoria == 3) return "Niños";
            return "Otro";
        });

        const values = rows.map(row => row.total);

        res.json({ labels, values });

    } catch (error) {
        console.error("Error en gráfica:", error);
        res.status(500).json({ mensaje: "Error al obtener datos" });
    }
};

module.exports = {
    getProductsByCategory
};
