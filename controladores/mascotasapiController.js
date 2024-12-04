const path = require('path');

const mascotasservice = require('../servicios/mascotasservice');

const renderMascotasPage = async (req, res) => {
    try {
        const mascotas = await mascotasservice.obtenerMascotas(); // Obtén las mascotas desde el servicio
        res.json(mascotas);  // Devuelve las mascotas como respuesta en formato JSON
    } catch (error) {
        console.error('Error al obtener las mascotas:', error);
        res.status(500).json({ error: 'Error al obtener las mascotas.' }); // Devuelve un error en caso de fallo
    }
};

module.exports = {
    renderMascotasPage
};
