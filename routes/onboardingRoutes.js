const express = require('express');
const router = express.Router();
const { checkOnboarding, showOnboarding } = require('../controladores/onboardingController');

// Ruta raíz: Comprueba si el usuario ha visto el onboarding
router.get('/', checkOnboarding, (req, res) => {
  res.render('login');  // Muestra el login si ya pasó el onboarding
});

// Ruta para mostrar el onboarding
router.get('/onboarding', showOnboarding);

module.exports = router;
