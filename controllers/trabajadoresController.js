const db = require('../models/database.js');

// Visualizar trabajadores registrados
exports.visualizar = async (req, res) => {
    const query = 'SELECT * FROM `trabajadores`;';
    try {
        const [results] = await db.query(query);
        if (results.length > 0) {
            res.json({ message: 'Datos obtenidos', data: results });
        } else {
            res.json({ message: 'Datos no encontrados', data: [] });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener datos', error: err.message });
    }
};

// Insertar
exports.insertar = async (req, res) => {
    const { nombre, area } = req.body;
    const query = 'INSERT INTO `trabajadores` (`nombre`, `area`) VALUES (?, ?);';
    try {
        const [results] = await db.query(query, [nombre, area]);
        res.json({ message: 'Registrado con éxito', data: results });
    } catch (err) {
        res.status(500).json({ message: 'Error al registrar', error: err.message });
    }
};

// Actualizar
exports.actualizar = async (req, res) => {
    const { id } = req.params;
    const { nombre, area } = req.body;
    const query = `UPDATE trabajadores SET nombre = ?, area = ? WHERE id = ?`;

    try {
        const [results] = await db.query(query, [nombre, area, id]);
        if (results.affectedRows > 0) {
            res.json({ message: 'Registro actualizado correctamente' });
        } else {
            res.status(404).json({ message: 'Registro no encontrado' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error al intentar actualizar un registro', error: err.message });
    }
};

// Eliminar
exports.eliminar = async (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM `trabajadores` WHERE id = ?;';
    try {
        const [results] = await db.query(query, [id]);
        if (results.affectedRows > 0) {
            res.json({ message: 'Registro eliminado correctamente' });
        } else {
            res.json({ message: 'Registro no encontrado' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar un registro', error: err.message });
    }
};
