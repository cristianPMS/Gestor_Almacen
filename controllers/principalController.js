const db = require ('../models/database.js');

//mostramos la tabla principal 

exports.mostrarTabla = async (req, res) => {
    try {
        const query = 'SELECT * FROM `materiales`;';
        const [results] = await db.query(query);

        if (results.length > 0) {
            res.json({ message: 'datos obtenidos', data: results });
        } else {
            res.json({ message: 'sin datos', data: [] });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener los datos', error: err.message });
    }
};


//agregar datos a la tabla principal 

exports.agregarDatos = async (req, res) => {
    try {
        const { nombre_material, identificador, cantidad, categoria } = req.body;
        const query = 'INSERT INTO `materiales` (`nombre_material`, `identificador`, `cantidad`, `categoria`) VALUES (?, ?, ?, ?);';

        const [results] = await db.query(query, [nombre_material, identificador, cantidad, categoria]);

        res.json({ message: 'Registrado con éxito', data: results });
    } catch (err) {
        res.status(500).json({ message: 'Error al registrar los datos', error: err.message });
    }
};


//modificar un registro
exports.actualizar = async (req, res) => {
    try {
        const { nombre_material, identificador, cantidad, categoria } = req.body;
        const { id } = req.params;

        const query = `UPDATE materiales SET nombre_material = ?, identificador = ?, cantidad = ?, categoria = ? WHERE id = ?`;
        const [results] = await db.query(query, [nombre_material, identificador, cantidad, categoria, id]);

        if (results.affectedRows > 0) {
            return res.json({ message: 'Registro actualizado exitosamente' });
        } else {
            return res.status(404).json({ message: 'Registro no encontrado' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error al intentar actualizar el registro', error: err.message });
    }
};


//eliminar un registro por medio de su id 
exports.eliminar = async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'DELETE FROM `materiales` WHERE id = ?;';
        const [results] = await db.query(query, [id]);

        if (results.affectedRows > 0) {
            return res.json({ message: 'Categoría eliminada correctamente' });
        } else {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar un registro', error: err.message });
    }
};
