const express = require('express');
const router = express.Router();
const db = require('../data/db');  // Aquí importamos la conexión a la base de datos

// Función para obtener los seguros desde la base de datos
const obtenerSeguros = async (req, res) => {
    try {
        const pool = await db.poolPromise;  // Esperamos a obtener el pool de conexiones
        const result = await pool.request().query('SELECT * FROM seguros'); // Ejecutamos la consulta SQL

        // Si la consulta es exitosa, devolvemos los resultados como JSON
        res.json(result.recordset);  // result.recordset contiene los datos obtenidos
    } catch (error) {
        console.error('Error al obtener los seguros:', error.message);
        res.status(500).json({ error: 'Error al obtener los seguros' });
    }
};

// Definimos la ruta de la API para obtener seguros
router.get('/seguros', obtenerSeguros);

// Exportamos el router para que se use en server.js
module.exports = router;
