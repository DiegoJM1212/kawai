const axios = require('axios'); // Librería para hacer peticiones HTTP

// Controlador para obtener los datos de registro civil
const obtenerDatosRegistroCivil = async (req, res) => {
    const cedula = req.params.cedula;

    console.log(`Buscando datos para la cédula: ${cedula}`); // Verificar que la cédula es correcta

    try {
        // Hacer la solicitud GET a la API del registro civil (externa)
        const response = await axios.get(`http://localhost:3005/registro-civil/${cedula}`);
        
        console.log('Respuesta de la API:', response.data); // Verifica la respuesta de la API

        // Verificar si la API respondió con los datos
        if (response.data) {
            // Si la respuesta de la API tiene datos, devolverlos al cliente
            res.json({
                success: true,
                message: 'Datos obtenidos con éxito',
                data: response.data // Los datos devueltos por la API
            });
        } else {
            // Si no se encontraron datos para esa cédula
            res.status(404).json({
                success: false,
                message: 'No se encontraron datos para esa cédula'
            });
        }
    } catch (error) {
        console.error('Error al consultar la API de registro civil:', error.message);
        // Manejar cualquier error que ocurra al hacer la solicitud a la API externa
        res.status(500).json({ 
            success: false, 
            message: 'Error al consultar la API de registro civil',
            error: error.message  // Agregar el mensaje de error
        });
    }
};

module.exports = {
    obtenerDatosRegistroCivil
};
