const { poolPromise, sql } = require('../data/db');

async function obtenerDetallesMascota(req, res) {
    const { id } = req.params; // Asumiendo que el ID de la mascota viene en la URL
    const usuarioId = req.session.userId; // Asumiendo que tienes el ID del usuario en la sesión

    let connection;
    try {
        connection = await poolPromise;

        // Obtener detalles de la mascota
        const resultMascota = await connection.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM mascotas WHERE id = @id');

        if (resultMascota.recordset.length === 0) {
            return res.status(404).send('Mascota no encontrada');
        }

        const mascota = resultMascota.recordset[0];

        // Obtener detalles del usuario
        const resultUsuario = await connection.request()
            .input('id', sql.Int, usuarioId)
            .query('SELECT nombre, email, telefono FROM usuarios WHERE id = @id');

        if (resultUsuario.recordset.length === 0) {
            return res.status(404).send('Usuario no encontrado');
        }

        const usuario = resultUsuario.recordset[0];

        // Obtener seguimientos veterinarios
        const resultSeguimientos = await connection.request()
            .input('mascotaId', sql.Int, id)
            .query('SELECT * FROM seguimiento_veterinario WHERE mascota_id = @mascotaId ORDER BY fecha DESC');

        const seguimientos = resultSeguimientos.recordset;

        res.render('detalles-mascota', { mascota, usuario, seguimientos });
    } catch (error) {
        console.error('Error al obtener detalles de la mascota:', error);
        res.status(500).send('Error al cargar los detalles de la mascota');
    } finally {
        if (connection) {
            connection.close();
        }
    }
}

module.exports = {
    obtenerDetallesMascota
};


