// Controller para el onboarding

const LOGIN_ROUTE = '/login';
const ONBOARDING_ROUTE = '/onboarding';

const COOKIE_OPTIONS = {
  maxAge: 365 * 24 * 60 * 60 * 1000, // 1 año
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
  sameSite: 'strict'
};

const checkOnboarding = (req, res, next) => {
  try {
    if (req.cookies.onboardingSeen) {
      // Si ya fue visto, continúa al siguiente middleware
      next();
    } else {
      // Si no, redirige al onboarding
      res.redirect(ONBOARDING_ROUTE);
    }
  } catch (error) {
    console.error('Error en checkOnboarding:', error);
    res.status(500).send('Error interno del servidor');
  }
};

const showOnboarding = (req, res) => {
  res.render('onboarding');
};

const finishOnboarding = (req, res) => {
  try {
    // Marca el onboarding como completado guardando una cookie
    res.cookie('onboardingSeen', 'true', COOKIE_OPTIONS);
    res.redirect(LOGIN_ROUTE);
  } catch (error) {
    console.error('Error en finishOnboarding:', error);
    res.status(500).send('Error al finalizar el onboarding');
  }
};

module.exports = { checkOnboarding, showOnboarding, finishOnboarding };
