const express = require('express');
const router = express.Router();
const mascotasController = require('../controladores/mascotasapiController');

// Middleware para manejar errores
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
};

// Ruta para obtener todas las mascotas
router.get('/api/mascotas', async (req, res, next) => {
    try {
        const mascotas = await mascotasController.obtenerMascotas();
        res.json(mascotas);
    } catch (error) {
        next(error);
    }
});

// Usar el middleware de manejo de errores
router.use(errorHandler);

module.exports = router;