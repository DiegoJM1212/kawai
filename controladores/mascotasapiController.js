const axios = require('axios');

const AP2_URL = process.env.API2_URL; // Asegúrate de que esta URL sea correcta

const obtenerMascotas = async () => {
    try {
        const response = await axios.get(`${API_URL}/mascotas`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener las mascotas:', error);
        throw new Error('Error al obtener las mascotas desde la API');
    }
};

module.exports = {
    obtenerMascotas
};
