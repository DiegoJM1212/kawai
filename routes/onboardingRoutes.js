const express = require('express');
const router = express.Router();
const { checkOnboarding, showOnboarding, finishOnboarding } = require('../controladores/onboardingController');
// Ruta para mostrar el onboarding
router.get('/onboarding', showOnboarding);

// Ruta para el login, solo si el usuario ya completó el onboarding
router.get('/', showLogin);

// Ruta para el login (otra forma de asegurarse de que solo se muestra si el onboarding ha sido completado)
router.get('/login', showLogin);

module.exports = router;
