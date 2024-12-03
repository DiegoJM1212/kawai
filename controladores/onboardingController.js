const COOKIE_OPTIONS = {
  maxAge: 365 * 24 * 60 * 60 * 1000, // 1 año
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict'
};

// Middleware para verificar si el usuario ha completado el onboarding
const checkOnboarding = (req, res, next) => {
  if (req.cookies.onboardingSeen) {
    return res.redirect('/');  // Redirige al login si ya ha visto el onboarding
  } else {
    return res.redirect('/onboarding');  // Muestra el onboarding si no lo ha visto
  }
};

// Renderiza la página de onboarding
const showOnboarding = (req, res) => {
  res.render('onboarding');  // Muestra la vista de onboarding
};

// Marca el onboarding como completado y redirige al login
const finishOnboarding = (req, res) => {
  res.cookie('onboardingSeen', 'true', COOKIE_OPTIONS);  // Marca el onboarding como completado
  res.redirect('/');  // Redirige al login
};

module.exports = { checkOnboarding, showOnboarding, finishOnboarding };



