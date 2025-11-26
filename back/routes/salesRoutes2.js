// back/routes/salesRoutes2.js
const express = require("express");
const router = express.Router();
const salesController2 = require("../controllers/salesController2");

router.post("/verificar-stock", salesController2.verificarStock);
router.post("/pagar", salesController2.pagar);

module.exports = router;
