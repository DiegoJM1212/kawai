const express = require('express');
const sql = require('mssql');

// Crear la aplicación Express
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

// Ruta para obtener datos del registro civil
app.get('/registro-civil/:cedula', async (req, res) => {
  let cedula = req.params.cedula.trim(); // Eliminar espacios en blanco en la cédula

  console.log('Buscando cédula:', cedula); // Verifica que la cédula que estás recibiendo en la URL

  try {
    // Conectar a la base de datos
    await sql.connect(config);

    // Realizar la consulta para obtener los datos de la cédula
    const result = await sql.query`SELECT * FROM registro_civil WHERE cedula = ${cedula}`;

    // Ver el resultado de la consulta para saber qué datos devuelve
    console.log('Resultado de la consulta:', result.recordset);

    // Si no se encuentra la cédula
    if (result.recordset.length === 0) {
      console.log('No se encontraron resultados para la cédula:', cedula);
      return res.status(404).json({ message: 'Cédula no encontrada' });
    }

    // Obtener los datos
    const { nombre, telefono, fecha_nacimiento } = result.recordset[0];

    // Enviar los datos encontrados
    return res.json({ nombre, telefono, fecha_nacimiento });
  } catch (err) {
    console.error('Error al acceder a la base de datos:', err);
    res.status(500).json({ message: 'Error al acceder a la base de datos' });
  } finally {
    // Cerrar la conexión
    await sql.close();
  }
});

// Iniciar el servidor en el puerto 3005
app.listen(3005, () => {
  console.log('Servidor en ejecución en http://localhost:3005');
});
