const { poolPromise, sql } = require('../data/db');

// Función para obtener el saldo de la tarjeta
async function obtenerSaldo(req, res) {
    const { numeroTarjeta } = req.params;
    let connection;
    try {
        connection = await poolPromise;

        const result = await connection.request()
            .input('numeroTarjeta', sql.VarChar, numeroTarjeta)
            .query('SELECT SaldoActual FROM TarjetasSimulacion WHERE NumeroTarjeta = @numeroTarjeta');

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'Tarjeta no encontrada.' });
        }

        const saldo = result.recordset[0].SaldoActual;
        res.status(200).json({ saldo });
    } catch (error) {
        console.error('Error al obtener el saldo de la tarjeta', error);
        res.status(500).json({ error: 'Error al obtener el saldo.' });
    } finally {
        if (connection) {
            connection.close();
        }
    }
}

// Función para procesar el pago con tarjeta
async function procesarPagoConTarjeta(req, res) {
    const { numeroTarjeta, nombreTitular, fechaExpiracion, cvv, monto } = req.body;

    let connection;
    try {
        connection = await poolPromise;

        // Verificar si la tarjeta existe y los datos son correctos
        const result = await connection.request()
            .input('numeroTarjeta', sql.VarChar, numeroTarjeta)
            .input('nombreTitular', sql.NVarChar, nombreTitular)
            .input('fechaExpiracion', sql.Date, fechaExpiracion)
            .input('codigoSeguridad', sql.Char, cvv)
            .query('SELECT * FROM TarjetasSimulacion WHERE NumeroTarjeta = @numeroTarjeta AND NombreTitular = @nombreTitular AND FechaExpiracion = @fechaExpiracion AND CodigoSeguridad = @codigoSeguridad');

        if (result.recordset.length === 0) {
            return res.status(400).json({ error: 'Datos de la tarjeta incorrectos.' });
        }

        const tarjeta = result.recordset[0];

        // Verificar si tiene suficiente saldo
        if (tarjeta.SaldoActual < monto) {
            return res.status(400).json({ error: 'Saldo insuficiente en la tarjeta.' });
        }

        // Actualizar el saldo de la tarjeta
        const nuevoSaldo = tarjeta.SaldoActual - monto;
        await connection.request()
            .input('numeroTarjeta', sql.VarChar, numeroTarjeta)
            .input('nuevoSaldo', sql.Decimal(18, 2), nuevoSaldo)
            .query('UPDATE TarjetasSimulacion SET SaldoActual = @nuevoSaldo WHERE NumeroTarjeta = @numeroTarjeta');

        // Enviar respuesta de éxito
        res.status(200).json({ success: true, message: 'Pago procesado con éxito.' });

    } catch (error) {
        console.error('Error al procesar el pago con tarjeta', error);
        res.status(500).json({ error: 'Error al procesar el pago.' });
    } finally {
        if (connection) {
            connection.close();
        }
    }
}

module.exports = {
    obtenerSaldo,
    procesarPagoConTarjeta
};

