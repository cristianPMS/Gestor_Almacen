//----------------- Importacion de dependencias -------------------
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

//----------------- Archivos importados ---------------------------
const principalController = require('./router/principalRouter.js');
const extraerController = require('./router/extraerRouter.js');
const ingresarController = require('./router/ingresarRouter.js');
const trabajadoresController = require('./router/trabajadoresRouter.js');
const usuarios =require('./router/usuarioRouter.js');


//----------------- Configuración de Middleware -------------------
app.use(bodyParser.json()); // Parsear el cuerpo de las solicitudes JSON
app.use(express.static(path.join(__dirname, 'vista'))); // Servir archivos estaticos (CSS, JS, etc.)

//------------------ Rutas (Controladores) -----------------------
// Menu principal
app.use('/principal', principalController);
// Menu Extraer material
app.use('/extraer',extraerController);
//Menu Ingresar material
app.use('/ingresar',ingresarController);
//Menu de los Trabajadores
app.use('/trabajador',trabajadoresController);
//Menu de Usuarios
app.use('/usuario',usuarios);

// Rutas para servir las páginas HTML
app.get('', (req, res) => {
    res.sendFile(path.join(__dirname, 'vista', 'html', 'login.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'vista', 'html', 'login.html'));
});

app.get('/agregar', (req, res) => {
    res.sendFile(path.join(__dirname, 'vista', 'html', 'agregar.html'));
});

app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'vista', 'html', 'index.html'));
});

app.get('/entrada', (req, res) => {
    res.sendFile(path.join(__dirname, 'vista', 'html', 'entrada.html'));
});

app.get('/salida', (req, res) => {
    res.sendFile(path.join(__dirname, 'vista', 'html', 'salida.html'));
});

app.get('/agregar_entrada', (req, res) => {
    res.sendFile(path.join(__dirname, 'vista', 'html', 'agregar_entrada.html'));
});

app.get('/agregar_salida', (req, res) => {
    res.sendFile(path.join(__dirname, 'vista', 'html', 'agregar_salida.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'vista', 'html', 'register.html'));
});

app.get('/usuarios', (req, res) => {
    res.sendFile(path.join(__dirname, 'vista', 'html', 'usuarios.html'));
});

app.get('/trabajadores', (req, res) => {
    res.sendFile(path.join(__dirname, 'vista', 'html', 'trabajadores.html'));
});

app.get('/registerTrabajador', (req, res) => {
    res.sendFile(path.join(__dirname, 'vista', 'html', 'registerTrabajador.html'));
});

app.get('/formularioIndex', (req, res) => {
    res.sendFile(path.join(__dirname, 'vista', 'html', 'formularioIndex.html'));
});

//----------------- Servidor -------------------
app.set("port", 4000); // Configuración del puerto del servidor
app.listen(app.get("port"), () => {
    console.log("Servidor activo en el puerto: " + app.get("port"));
});
