const express = require('express');
const router = express.Router();
const { checkOnboarding, showOnboarding, finishOnboarding } = require('../controladores/onboardingController');

// Ruta raíz: Muestra el onboarding directamente
router.get('/', showOnboarding);

// Ruta para el login
router.get('/login', checkOnboarding, (req, res) => {
  res.render('login');  // Muestra el login si ya pasó el onboarding
});

// Ruta POST para completar el onboarding
router.post('/finish-onboarding', finishOnboarding);

module.exports = router;
