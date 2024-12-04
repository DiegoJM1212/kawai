const express = require('express');
const router = express.Router();
const paypalController = require('../controladores/paypal');

router.post('/crear-pago', paypalController.createPayment);

module.exports = router;

