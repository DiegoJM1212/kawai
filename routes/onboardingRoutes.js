const express = require('express');
const router = express.Router();
const { checkOnboarding, showOnboarding } = require('../controladores/onboardingController');

// Ruta raíz: Muestra el onboarding directamente
router.get('/', showOnboarding);

// Ruta para el login
router.get('/login', checkOnboarding, (req, res) => {
  res.render('login');  // Muestra el login si ya pasó el onboarding
});

module.exports = router;
