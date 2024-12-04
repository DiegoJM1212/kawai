const express = require('express');
const router = express.Router();
const tarjetasController = require('../controladores/tarjetasController');

// Ruta para obtener el saldo de una tarjeta
router.get('/saldo/:numeroTarjeta', tarjetasController.obtenerSaldo);

// Ruta para realizar un pago con la tarjeta
router.post('/pago', tarjetasController.procesarPagoConTarjeta);

module.exports = router;

