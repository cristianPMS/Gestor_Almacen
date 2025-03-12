const mysql = require('mysql2');

console.log('Intentando conectar a la base de datos...');

// Crear la conexión a la base de datos
const connect = mysql.createConnection({
    host: 'bg2rxbcqqcnyb4vvvu3q-mysql.services.clever-cloud.com',
    user: 'utngeehqzhfz5mfb', // Usuario de tu base de datos
    password: 'kVl7c21Jct07HTMNMMoh', // Contraseña de tu base de datos
    database: 'bg2rxbcqqcnyb4vvvu3q' // Nombre de tu base de datos
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
