const express = require("express");
const router = express.Router();

const { getProductsByCategory } = require("../controllers/salesController");

// /api/graficas/products-by-category
router.get("/products-by-category", getProductsByCategory);

module.exports = router;
