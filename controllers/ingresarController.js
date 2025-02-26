const db = require('../models/database.js');

// Mostrar registros de la tabla
exports.mostrar = async (req, res) => {
    try {
        // Realiza una consulta para obtener los datos de la tabla `material_extraido`
        // Uniendo las tablas `materiales` y `trabajadores` para obtener los nombres
        const query = `
            SELECT 
                me.id, 
                m.nombre_material, 
                t.nombre, 
                me.cantidad_ingresada, 
                me.fecha_ingreso
            FROM 
                material_ingresado me
            JOIN 
                materiales m ON me.id_material = m.id
            JOIN 
                trabajadores t ON me.id_trabajador = t.id;
        `;
        
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


// Agregar datos
exports.agregar = async (req, res) => {
    try {
        const { id_material, id_trabajador, cantidad_ingresada, fecha_ingreso } = req.body;
        
        // Validación básica
        if (!id_material || !id_trabajador || !cantidad_ingresada || !fecha_ingreso) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
        }

        const query = 'INSERT INTO `material_ingresado` (`id_material`, `id_trabajador`, `cantidad_ingresada`, `fecha_ingreso`) VALUES (?, ?, ?, ?);';
        
        const [results] = await db.query(query, [id_material, id_trabajador, cantidad_ingresada, fecha_ingreso]);

        // Retornar el ID del nuevo registro
        res.status(201).json({ message: 'Registrado con éxito', data: { id: results.insertId } });
    } catch (err) {
        res.status(500).json({ message: 'Lo siento, no hay suficienten en el inventario ', error: err.message });
    }
};

// Actualizar registro
exports.actualizar = async (req, res) => {
    try {
        const { id_material, id_trabajador, cantidad_ingresada, fecha_ingreso } = req.body;  // Recibir IDs directamente
        const { id } = req.params;

        console.log("Datos recibidos en el backend:");
        console.log("ID del registro a actualizar:", id);
        console.log("ID del material:", id_material);
        console.log("ID del trabajador:", id_trabajador);
        console.log("Cantidad extraída:", cantidad_ingresada);
        console.log("Fecha de extracción:", fecha_ingreso);

        // Validar que los IDs existan en la base de datos (opcional)
        const [materialResult] = await db.query('SELECT id FROM materiales WHERE id = ?', [id_material]);
        if (materialResult.length === 0) {
            console.log("Material no encontrado en la base de datos.");
            return res.status(404).json({ message: 'Material no encontrado' });
        }

        const [trabajadorResult] = await db.query('SELECT id FROM trabajadores WHERE id = ?', [id_trabajador]);
        if (trabajadorResult.length === 0) {
            console.log("Trabajador no encontrado en la base de datos.");
            return res.status(404).json({ message: 'Trabajador no encontrado' });
        }

        // Realizar la actualización
        const query = `
            UPDATE material_ingresado 
            SET id_material = ?, id_trabajador = ?, cantidad_ingresada = ?, fecha_ingreso = ? 
            WHERE id = ?;
        `;
        const [results] = await db.query(query, [id_material, id_trabajador, cantidad_ingresada, fecha_ingreso, id]);

        console.log("Resultado de la actualización:", results);

        if (results.affectedRows > 0) {
            res.json({ message: 'Registro actualizado exitosamente' });
        } else {
            res.status(404).json({ message: 'Registro no encontrado' });
        }
    } catch (err) {
        console.error("Error en la actualización:", err);
        res.status(500).json({ message: 'Error al actualizar el registro', error: err.message });
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
