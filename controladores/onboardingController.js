const express = require('express');
const router = express.Router();
const { checkOnboarding, finishOnboarding } = require('../controladores/onboardingController');

// Ruta para la página de onboarding
router.get('/onboarding', checkOnboarding, (req, res) => {
  res.render('onboarding'); // Renderiza la vista del onboarding
});

// Ruta para finalizar el onboarding
router.get('/finish-onboarding', finishOnboarding);

// Ruta para el login (raíz del proyecto)
router.get('/login', (req, res) => {
  res.render('login'); // Renderiza la vista de inicio de sesión
});

// Ruta por defecto que redirige al onboarding o al login
router.get('/', (req, res) => {
  if (!req.cookies.onboardingSeen) {
    return res.redirect('/onboarding');
  }
  res.redirect('/login');
});

module.exports = router;
