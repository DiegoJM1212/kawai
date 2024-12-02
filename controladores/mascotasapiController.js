const axios = require('axios');

const API2_URL = 'https://adop.onrender.com';  // Asegúrate de que esta URL sea la correcta


const obtenerMascotas = async () => {
    try {
        console.log('Attempting to fetch mascotas from:', API2_URL);
        const response = await axios.get(`${API2_URL}/mascotas`);
        console.log('Response received:', response.status, response.data);
        return response.data;
    } catch (error) {
        console.error('Error detallado al obtener las mascotas:', error.response ? error.response.data : error.message);
        throw new Error('Error al obtener las mascotas desde la API: ' + (error.response ? error.response.data : error.message));
    }
};

module.exports = {
    obtenerMascotas
};


