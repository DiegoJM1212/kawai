// controllers/onboardingController.js

// Función para mostrar el onboarding (si el usuario no ha completado el onboarding)
const showOnboarding = (req, res) => {
  res.render('onboarding'); // Muestra la vista del onboarding
};

// Función para mostrar el login solo si el onboarding está completo
const showLogin = (req, res) => {
  // Verificamos si el onboarding fue completado, ya sea con cookies o localStorage en frontend
  if (req.cookies.onboardingSeen || req.query.onboardingCompleted === 'true') {
    return res.render('login'); // Si ya completó el onboarding, muestra el login
  } else {
    return res.redirect('/onboarding'); // Si no completó el onboarding, redirige al onboarding
  }
};

// Exportamos las funciones del controlador
module.exports = { showOnboarding, showLogin };
