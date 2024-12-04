const { poolPromise, sql } = require('../data/db');

async function agendarCita(req, res) {
    try {
        const { id_usuario, nombrePropietario, nombreMascota, consulta, fecha, hora } = req.body;

        const connection = await poolPromise;

        // Inserta la cita en la tabla existente
        await connection.request()
            .input('id_usuario', sql.Int, id_usuario)
            .input('nombre_propietario', sql.VarChar, nombrePropietario)
            .input('nombre_mascota', sql.VarChar, nombreMascota)
            .input('consulta', sql.Text, consulta)
            .input('fecha', sql.Date, fecha)
            .input('hora', sql.Time, hora)
            .query(`INSERT INTO citas_veterinarias (id_usuario, nombre_propietario, nombre_mascota, consulta, fecha, hora) 
                     VALUES (@id_usuario, @nombre_propietario, @nombre_mascota, @consulta, @fecha, @hora)`);

        // Registrar en la auditoría
        await connection.request()
            .input('usuario_id', sql.Int, id_usuario)
            .input('accion', sql.VarChar, 'Agendar Cita')
            .input('descripcion', sql.Text, 'Cita agendada correctamente')
            .input('resultado', sql.VarChar, 'Éxito')
            .query(`INSERT INTO auditoria (usuario_id, accion, descripcion, resultado) 
                    VALUES (@usuario_id, @accion, @descripcion, @resultado)`);

        res.status(200).send('Cita agendada correctamente');
    } catch (error) {
        console.error('Error al agendar cita:', error);

        // Registrar error en la auditoría
        try {
            const connection = await poolPromise;
            await connection.request()
                .input('usuario_id', sql.Int, req.body.id_usuario)
                .input('accion', sql.VarChar, 'Agendar Cita')
                .input('descripcion', sql.Text, `Error al agendar cita: ${error.message}`)
                .input('resultado', sql.VarChar, 'Error')
                .query(`INSERT INTO auditoria (usuario_id, accion, descripcion, resultado) 
                        VALUES (@usuario_id, @accion, @descripcion, @resultado)`);
        } catch (auditError) {
            console.error('Error al registrar en auditoría:', auditError);
        }

        res.status(500).send('Error al agendar la cita');
    }
}

async function comprobarDisponibilidad(req, res) {
    try {
        const { fecha, hora } = req.body;

        const connection = await poolPromise;

        const result = await connection.request()
            .input('fecha', sql.Date, fecha)
            .input('hora', sql.Time, hora)
            .query(`SELECT COUNT(*) AS count FROM citas_veterinarias WHERE fecha = @fecha AND hora = @hora`);

        const isAvailable = result.recordset[0].count === 0;

        // Registrar en la auditoría
        await connection.request()
            .input('usuario_id', sql.Int, req.session.userId) // Asegúrate de que el ID del usuario esté en la sesión
            .input('accion', sql.VarChar, 'Comprobar Disponibilidad')
            .input('descripcion', sql.Text, `Disponibilidad consultada para ${fecha} a las ${hora}`)
            .input('resultado', sql.VarChar, isAvailable ? 'Disponible' : 'No disponible')
            .query(`INSERT INTO auditoria (usuario_id, accion, descripcion, resultado) 
                    VALUES (@usuario_id, @accion, @descripcion, @resultado)`);

        res.status(200).json({ available: isAvailable });
    } catch (error) {
        console.error('Error al comprobar disponibilidad:', error);

        // Registrar error en la auditoría
        try {
            const connection = await poolPromise;
            await connection.request()
                .input('usuario_id', sql.Int, req.session.userId)
                .input('accion', sql.VarChar, 'Comprobar Disponibilidad')
                .input('descripcion', sql.Text, `Error al comprobar disponibilidad: ${error.message}`)
                .input('resultado', sql.VarChar, 'Error')
                .query(`INSERT INTO auditoria (usuario_id, accion, descripcion, resultado) 
                        VALUES (@usuario_id, @accion, @descripcion, @resultado)`);
        } catch (auditError) {
            console.error('Error al registrar en auditoría:', auditError);
        }

        res.status(500).send('Error al comprobar la disponibilidad');
    }
}

module.exports = {
    agendarCita,
    comprobarDisponibilidad,
};
