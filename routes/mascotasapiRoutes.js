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
        console.error('Error en la ruta /api/mascotas:', error);
        res.status(500).json({ error: 'Error al obtener las mascotas', details: error.message });
    }
});
router.all('*', async (req, res) => {
  try {
    const response = await axios({
      method: req.method, // Usar el mismo método de la solicitud (GET, POST, etc.)
      url: `https://adop.onrender.com${req.path}`, // Cambia esto por la URL base de tu API
      data: req.body, // Pasar el cuerpo de la solicitud
      headers: req.headers, // Reutilizar los encabezados de la solicitud original
    });
    res.status(response.status).send(response.data); // Responder con los datos de la API remota
  } catch (err) {
    res.status(err.response?.status || 500).send(err.message); // Manejar errores
  }
});
// Usar el middleware de manejo de errores
router.use(errorHandler);

module.exports = router;
