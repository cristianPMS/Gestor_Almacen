// controllers/usuariosController.js
const bcrypt = require('bcrypt');
const db = require('../models/database.js');

//mostrar
exports.mostrar = async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM `usuarios`;');

        if (results.length > 0) {
            res.json({ message: 'Datos obtenidos', data: results });
        } else {
            res.json({ message: 'Sin datos', data: [] });
        }
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Registro de usuario
exports.register = async (req, res) => {
    try {
        const { usuario, password, rol } = req.body;

        // Verificar si el usuario ya existe
        const [existingUser] = await db.execute("SELECT * FROM usuarios WHERE usuario = ?", [usuario]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "El usuario ya existe" });
        }

        // Generar hash de la contraseña
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        // Insertar usuario en la base de datos
        await db.execute("INSERT INTO usuarios (usuario, password, rol) VALUES (?, ?, ?)", [usuario, hash, rol]);

        res.json({ message: "Usuario registrado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login de usuario
exports.login = async (req, res) => {
    try {
        const { usuario, password } = req.body;

        // Buscar usuario en la base de datos
        const [rows] = await db.execute("SELECT * FROM usuarios WHERE usuario = ?", [usuario]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Credenciales inválidas" });
        }

        const user = rows[0]; // El primer usuario que coincida

        // Comparar la contraseña ingresada con la almacenada en la BD
        const compare = await bcrypt.compare(password, user.password);

        if (compare) {
            res.json({ message: "Login exitoso", usuario: user.usuario, rol: user.rol });
        } else {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//update 


exports.actualizar = async (req, res) => { 
    try {
        const { usuario, password, rol } = req.body;
        const { id } = req.params;

        let query = `UPDATE usuarios SET usuario=?, rol=? WHERE id=?`;
        let values = [usuario, rol, id];

        // Si el usuario proporciona una nueva contraseña, la encriptamos antes de actualizarla
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            query = `UPDATE usuarios SET usuario=?, password=?, rol=? WHERE id=?`;
            values = [usuario, hashedPassword, rol, id];
        }

        db.query(query, values, (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error al intentar actualizar el registro', error: err.message });
            }
            if (results.affectedRows > 0) {
                return res.json({ message: 'Registro actualizado con éxito' });
            } else {
                return res.status(404).json({ message: 'Registro no encontrado' });
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
};

//delete 
exports.delete = async (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM `usuarios` WHERE id=?;';

    try {
        const [results] = await db.execute(query, [id]);

        if (results.affectedRows) {
            res.json({ message: 'Registro eliminado correctamente' });
        } else {
            res.status(404).json({ message: 'Registro no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el registro', error: error.message });
    }
};