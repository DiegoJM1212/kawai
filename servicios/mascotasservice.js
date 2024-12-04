// mascotasservice.js
const express = require('express');
const router = express.Router();
const db = require('../data/db');  // Aquí importamos la conexión a la base de datos

// Función para obtener las mascotas desde la base de datos
const obtenerMascotas = async (req, res) => {
    try {
        const pool = await db.poolPromise;  // Esperamos a obtener el pool de conexiones
        const result = await pool.request().query('SELECT * FROM mascotas_adopcion'); // Ejecutamos la consulta SQL

        // Si la consulta es exitosa, devolvemos los resultados como JSON
        res.json(result.recordset);  // result.recordset contiene los datos obtenidos
    } catch (error) {
        console.error('Error al obtener las mascotas:', error.message);
        res.status(500).json({ error: 'Error al obtener las mascotas' });
    }
};

// Definimos la ruta de la API para obtener mascotas
router.get('/mascotas', obtenerMascotas);

// Exportamos el router para que se use en server.js
module.exports = router;


