const express = require('express');
const router = express.Router();
const mascotasController = require('../controladores/mascotasapiController');

// Ruta para la vista de mascotas
router.get('/mascotas', mascotasController.renderMascotasPage);

module.exports = router;
