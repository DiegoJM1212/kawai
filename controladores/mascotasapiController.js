const axios = require('axios');

const API2_URL = process.env.API2_URL || 'https://adop.onrender.com'; // Use the environment variable or fallback

const obtenerMascotas = async () => {
    try {
        const response = await axios.get(`${API2_URL}/api/mascotas`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener las mascotas:', error);
        throw new Error('Error al obtener las mascotas desde la API');
    }
};

module.exports = {
    obtenerMascotas
};

