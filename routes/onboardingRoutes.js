const express = require('express');
const router = express.Router();
const { checkOnboarding, finishOnboarding } = require('../controladores/onboardingController');

// Ruta para la página de onboarding
router.get('/onboarding', checkOnboarding, (req, res) => {
  // Si el onboarding no ha sido completado, se muestra la vista de onboarding
  res.render('onboarding');  // Asegúrate de que el motor de plantillas esté configurado para ejs o el que uses
});

// Ruta para finalizar el onboarding
router.get('/finish-onboarding', finishOnboarding);

// Ruta para el login (raíz del proyecto)
router.get('/', (req, res) => {
  res.render('login');  // Asumiendo que tienes una vista 'login'
});

module.exports = router;