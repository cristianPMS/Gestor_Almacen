const db = require('../models/database.js');

// Mostrar registros de la tabla
exports.mostrarTable = async (req, res) => {
    try {
        const query = 'SELECT * FROM `material_extraido`;';
        const [results] = await db.query(query);
        
        if (results.length > 0) {
            res.json({ message: 'Datos obtenidos', data: results });
        } else {
            res.json({ message: 'Sin datos', data: [] });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener datos', error: err.message });
    }
};

// Agregar datos a la tabla
exports.agregar = async (req, res) => {
    try {
        const { id_material, id_trabajador, cantidad_extraida, fecha_extraccion } = req.body;
        const query = 'INSERT INTO `material_extraido` (`id_material`, `id_trabajador`, `cantidad_extraida`, `fecha_extraccion`) VALUES (?, ?, ?, ?);';
        
        const [results] = await db.query(query, [id_material, id_trabajador, cantidad_extraida, fecha_extraccion]);
        res.json({ message: 'Registrado con éxito', data: results });
    } catch (err) {
        res.status(500).json({ message: 'Error al registrar', error: err.message });
    }
};

// Editar datos
exports.editar = async (req, res) => {
    try {
        const { id_material, id_trabajador, cantidad_extraida, fecha_extraccion } = req.body;
        const { id } = req.params;
        
        const query = `UPDATE material_extraido SET id_material = ?, id_trabajador = ?, cantidad_extraida = ?, fecha_extraccion = ? WHERE id = ?`;
        const [results] = await db.query(query, [id_material, id_trabajador, cantidad_extraida, fecha_extraccion, id]);
        
        if (results.affectedRows > 0) {
            res.json({ message: 'Registro actualizado exitosamente' });
        } else {
            res.status(404).json({ message: 'Registro no encontrado' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error al actualizar el registro', error: err.message });
    }
};

// Eliminar registro
exports.eliminar = async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'DELETE FROM `material_extraido` WHERE id = ?;';
        const [results] = await db.query(query, [id]);
        
        if (results.affectedRows > 0) {
            res.json({ message: 'Registro eliminado correctamente' });
        } else {
            res.status(404).json({ message: 'Registro no encontrado' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar el registro', error: err.message });
    }
};
