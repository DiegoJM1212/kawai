const express = require('express');
const router = express.Router();
const appointmentController = require('../controladores/appointmentController');

// Ruta para agendar cita veterinaria
router.post('/agendar', appointmentController.agendarCita);

// Nueva ruta para comprobar disponibilidad
router.post('/comprobar-disponibilidad', appointmentController.comprobarDisponibilidad);

module.exports = router;
