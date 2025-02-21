const db = require('../models/database.js');

// Mostrar registros de la tabla
exports.mostrar = async (req, res) => {
    const query = 'SELECT * FROM `material_ingresado`;';
    try {
        const [results] = await db.query(query);
        if (results.length > 0) {
            res.json({ message: 'Datos obtenidos', data: results });
        } else {
            res.json({ message: 'Sin datos', data: [] });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los datos', error: error.message });
    }
};

// Agregar datos
exports.agregar = async (req, res) => {
    const { id_material, id_trabajador, cantidad_ingresada, fecha_ingreso } = req.body;
    const query = 'INSERT INTO `material_ingresado` (`id_material`, `id_trabajador`, `cantidad_ingresada`, `fecha_ingreso`) VALUES (?, ?, ?, ?);';
    
    try {
        const [results] = await db.query(query, [id_material, id_trabajador, cantidad_ingresada, fecha_ingreso]);
        res.json({ message: 'Registrado con éxito', data: results });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar datos', error: error.message });
    }
};

// Actualizar registro
exports.actualizar = async (req, res) => {
    const { id_material, id_trabajador, cantidad_ingresada, fecha_ingreso } = req.body;
    const { id } = req.params;
    const query = 'UPDATE material_ingresado SET id_material=?, id_trabajador=?, cantidad_ingresada=?, fecha_ingreso=? WHERE id=?';

    try {
        const [results] = await db.query(query, [id_material, id_trabajador, cantidad_ingresada, fecha_ingreso, id]);
        if (results.affectedRows > 0) {
            res.json({ message: 'Registro actualizado con éxito' });
        } else {
            res.status(404).json({ message: 'Registro no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el registro', error: error.message });
    }
};

// Eliminar registro
exports.eliminar = async (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM `material_ingresado` WHERE id=?;';

    try {
        const [results] = await db.query(query, [id]);
        if (results.affectedRows > 0) {
            res.json({ message: 'Registro eliminado correctamente' });
        } else {
            res.status(404).json({ message: 'Registro no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el registro', error: error.message });
    }
};
