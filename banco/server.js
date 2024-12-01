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

// Ruta para obtener el saldo de la tarjeta
app.get('/tarjeta/:numeroTarjeta', async (req, res) => {
  // Eliminar espacios o saltos de línea antes de procesar el número de tarjeta
  const numeroTarjeta = req.params.numeroTarjeta.replace(/\s+/g, '').trim(); // Elimina cualquier espacio o salto de línea

  console.log(`Received request for card: ${numeroTarjeta}`);
  console.log('Request headers:', req.headers);

  try {
    console.log('Attempting to connect to database...');
    await sql.connect(config);
    console.log('Database connection successful');

    console.log('Executing SQL query...');
    const result = await sql.query`SELECT SaldoActual FROM TarjetasSimulacion WHERE NumeroTarjeta = ${numeroTarjeta}`;
    console.log('SQL query executed successfully');

    if (result.recordset.length === 0) {
      console.log(`Card not found: ${numeroTarjeta}`);
      return res.status(404).json({ message: 'Tarjeta no encontrada' });
    }

    const { SaldoActual } = result.recordset[0];
    console.log(`Balance for card ${numeroTarjeta}: ${SaldoActual}`);
    return res.json({ SaldoActual });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: 'Error al acceder a la base de datos' });
  } finally {
    console.log('Closing database connection');
    await sql.close();
  }
});

// Ruta para procesar el pago (por ejemplo)
app.post('/pago', async (req, res) => {
  const { numeroTarjeta, monto } = req.body;

  if (!numeroTarjeta || !monto) {
    return res.status(400).json({ message: 'Faltan datos necesarios (numeroTarjeta, monto)' });
  }

  // Eliminar espacios o saltos de línea antes de procesar el número de tarjeta
  const sanitizedNumeroTarjeta = numeroTarjeta.replace(/\s+/g, '').trim();

  console.log(`Attempting to process payment for card: ${sanitizedNumeroTarjeta} with amount: ${monto}`);

  try {
    console.log('Attempting to connect to database...');
    await sql.connect(config);
    console.log('Database connection successful');

    // Aquí iría la lógica para procesar el pago (actualizar saldo, verificar fondos, etc.)
    console.log('Processing payment...');

    // Simulación de actualización de saldo (esto debe ser adaptado a tu lógica de negocio)
    const result = await sql.query`UPDATE TarjetasSimulacion SET SaldoActual = SaldoActual - ${monto} WHERE NumeroTarjeta = ${sanitizedNumeroTarjeta}`;
    
    if (result.rowsAffected[0] === 0) {
      console.log(`Card not found for payment: ${sanitizedNumeroTarjeta}`);
      return res.status(404).json({ message: 'Tarjeta no encontrada' });
    }

    console.log(`Payment processed for card ${sanitizedNumeroTarjeta}, amount deducted: ${monto}`);
    return res.json({ message: 'Pago procesado correctamente' });
  } catch (err) {
    console.error('Error processing payment:', err);
    res.status(500).json({ message: 'Error al procesar el pago' });
  } finally {
    console.log('Closing database connection');
    await sql.close();
  }
});

// Iniciar el servidor en el puerto 3002
app.listen(3002, () => {
  console.log('Servidor en ejecución en http://localhost:3002');
});
