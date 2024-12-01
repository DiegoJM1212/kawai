const express = require('express');
const sql = require('mssql');
const app = express();

// Configuración de la base de datos
const config = {
    user: 'diego', // Usuario de SQL en Azure
    password: 'Paramore.1997', // Asegúrate de poner la contraseña correcta
    server: 'diegojm.database.windows.net', // Nombre del servidor de Azure SQL
    database: 'kawaipet', // Nombre de la base de datos en Azure
    options: {
      encrypt: true, // Habilita la encriptación para la conexión segura
      trustServerCertificate: false, // No confiar en certificados no firmados
    },
  };

// Middleware para aceptar solicitudes JSON
app.use(express.json());

// Middleware global para limpiar saltos de línea y caracteres no deseados
app.use((req, res, next) => {
    // Eliminar cualquier salto de línea o retorno de carro en la URL
    req.url = req.url.replace(/[\n\r%0A]+/g, '').trim();
    next();
});

// Ruta para obtener todas las mascotas en adopción
app.get('/mascotas', async (req, res) => {
    try {
        // Conectar a la base de datos
        await sql.connect(config);

        // Realizar la consulta para obtener todas las mascotas
        const result = await sql.query('SELECT * FROM mascotas_adopcion');

        // Enviar las mascotas obtenidas
        return res.json(result.recordset);
    } catch (err) {
        console.error('Error al obtener mascotas:', err);
        res.status(500).json({ message: 'Error al obtener mascotas' });
    } finally {
        // Cerrar la conexión
        await sql.close();
    }
});

// Ruta para obtener una mascota por ID
app.get('/mascota/:id', async (req, res) => {
    const id = req.params.id.trim();  // Eliminar cualquier espacio o salto de línea del parámetro

    try {
        // Conectar a la base de datos
        await sql.connect(config);

        // Realizar la consulta para obtener la mascota por ID
        const result = await sql.query`SELECT * FROM mascotas_adopcion WHERE id = ${id}`;

        // Si no se encuentra la mascota
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Mascota no encontrada' });
        }

        // Enviar los datos de la mascota
        return res.json(result.recordset[0]);
    } catch (err) {
        console.error('Error al obtener mascota:', err);
        res.status(500).json({ message: 'Error al obtener mascota' });
    } finally {
        // Cerrar la conexión
        await sql.close();
    }
});

// Ruta para agregar una nueva mascota
app.post('/mascota', async (req, res) => {
    const { nombre, tipo, disponibilidad, foto } = req.body;

    try {
        // Validar que se reciban los campos necesarios
        if (!nombre || !tipo) {
            return res.status(400).json({ message: 'El nombre y el tipo son requeridos' });
        }

        // Conectar a la base de datos
        await sql.connect(config);

        // Insertar la nueva mascota en la base de datos
        await sql.query`INSERT INTO mascotas_adopcion (nombre, tipo, disponibilidad, foto) 
                    VALUES (${nombre}, ${tipo}, ${disponibilidad || 1}, ${foto || null})`;

        // Responder con éxito
        return res.status(201).json({ message: 'Mascota agregada con éxito' });
    } catch (err) {
        console.error('Error al agregar mascota:', err);
        res.status(500).json({ message: 'Error al agregar mascota' });
    } finally {
        // Cerrar la conexión
        await sql.close();
    }
});

// Ruta para actualizar una mascota
app.put('/mascota/:id', async (req, res) => {
    const id = req.params.id.trim();  // Eliminar cualquier espacio o salto de línea del parámetro
    const { nombre, tipo, disponibilidad, foto } = req.body;

    try {
        // Validar que se reciban los campos necesarios
        if (!nombre || !tipo) {
            return res.status(400).json({ message: 'El nombre y el tipo son requeridos' });
        }

        // Conectar a la base de datos
        await sql.connect(config);

        // Realizar la actualización de la mascota
        const result = await sql.query`UPDATE mascotas_adopcion 
                                    SET nombre = ${nombre}, tipo = ${tipo}, disponibilidad = ${disponibilidad}, foto = ${foto} 
                                    WHERE id = ${id}`;

        // Si no se encuentra la mascota
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Mascota no encontrada' });
        }

        // Responder con éxito
        return res.json({ message: 'Mascota actualizada con éxito' });
    } catch (err) {
        console.error('Error al actualizar mascota:', err);
        res.status(500).json({ message: 'Error al actualizar mascota' });
    } finally {
        // Cerrar la conexión
        await sql.close();
    }
});

// Ruta para eliminar una mascota
app.delete('/mascota/:id', async (req, res) => {
    const id = req.params.id.trim();  // Eliminar cualquier espacio o salto de línea del parámetro

    try {
        // Conectar a la base de datos
        await sql.connect(config);

        // Eliminar la mascota de la base de datos
        const result = await sql.query`DELETE FROM mascotas_adopcion WHERE id = ${id}`;

        // Si no se encuentra la mascota
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Mascota no encontrada' });
        }

        // Responder con éxito
        return res.json({ message: 'Mascota eliminada con éxito' });
    } catch (err) {
        console.error('Error al eliminar mascota:', err);
        res.status(500).json({ message: 'Error al eliminar mascota' });
    } finally {
        // Cerrar la conexión
        await sql.close();
    }
});

// Iniciar el servidor en el puerto 3001
app.listen(3001, () => {
    console.log('Servidor en ejecución en http://localhost:3001');
});
