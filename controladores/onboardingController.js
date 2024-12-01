// Controller para el onboarding

// Configuración de las rutas
const LOGIN_ROUTE = '/login';
const ONBOARDING_ROUTE = '/onboarding';

// Opciones para la cookie
const COOKIE_OPTIONS = {
  maxAge: 365 * 24 * 60 * 60 * 1000, // 1 año
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
  sameSite: 'strict'
};

// Verificar si el onboarding ya fue visto
const checkOnboarding = (req, res, next) => {
  try {
    if (req.cookies.onboardingSeen) {
      // Si ya fue visto, redirige al login
      return res.redirect(LOGIN_ROUTE);
    } else {
      // Si no, muestra la página de onboarding
      next();
    }
  } catch (error) {
    console.error('Error en checkOnboarding:', error);
    res.status(500).send('Error interno del servidor');
  }
};

// Función para finalizar el onboarding
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

module.exports = { checkOnboarding, finishOnboarding };