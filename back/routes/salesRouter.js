// back/routes/salesRoutes.js
const express = require("express");
const router = express.Router();

const { getSalesByCategory } = require("../salesController");

router.get("/sales-by-category", getSalesByCategory);

module.exports = router;
