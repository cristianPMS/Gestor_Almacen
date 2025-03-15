const mysql = require('mysql2');

console.log('Intentando conectar a la base de datos...');

// Crear la conexión a la base de datos
const connect = mysql.createConnection({
    host: 'bxpl7yedt716ivb7fyre-mysql.services.clever-cloud.com',
    user: 'ulrr4deblzilfr1t', // Usuario de tu base de datos
    password: '8W4KEaL64MeC1aIafdOw', // Contraseña de tu base de datos
    database: 'bxpl7yedt716ivb7fyre' // Nombre de tu base de datos
});

// Verificar la conexión
connect.connect((err) => {
    if (err) {
        console.log('Error de conexión:', err);
    } else {
        console.log('Conectado a la base de datos');
    }
});

// Usar promesas con la conexión para hacer consultas más fácilmente
const db = connect.promise(); // Esto permite usar async/await en las consultas SQL

// Exportar la conexión con promesas
module.exports = db;
