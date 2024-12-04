const express = require('express');
const router = express.Router();
const mascotaController = require('../controladores/mascotaController');

// Ruta para obtener detalles de una mascota
router.get('/:id', mascotaController.obtenerDetallesMascota);

module.exports = router;

