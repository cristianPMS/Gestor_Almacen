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

        // Verificar si el material ya existe
        const checkQuery = 'SELECT COUNT(*) AS count FROM `materiales` WHERE `nombre_material` = ?;';
        const [existing] = await db.query(checkQuery, [nombre_material]);

        if (existing[0].count > 0) {
            return res.status(400).json({ message: 'Lo siento, al parecer estas intentando agregar un registro que ya esta dado de alta' });
        }

        // Insertar si no existe
        const insertQuery = 'INSERT INTO `materiales` (`nombre_material`, `identificador`, `cantidad`, `categoria`) VALUES (?, ?, ?, ?);';
        const [results] = await db.query(insertQuery, [nombre_material, identificador, cantidad, categoria]);

        res.json({ message: 'Registrado con éxito', data: results });
    } catch (err) {
        res.status(500).json({ message: 'Error al registrar el material', error: err.message });
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
        res.status(500).json({ message: 'Este Nombre ya esta ocupado', error: err.message });
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
        res.status(500).json({ message: 'No se pudo eliminar, hay un registro registrado en otro campo', error: err.message });
    }
};
