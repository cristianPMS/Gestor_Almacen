//----------------- Importación de dependencias -------------------
require("dotenv").config(); // Cargar variables de entorno
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser"); // Importar cookie-parser|
const {protegerRutas} = require('./middleware/protegerRutas.js');

//----------------- Archivos importados ---------------------------
const principalController = require("./router/principalRouter.js");
const extraerController = require("./router/extraerRouter.js");
const ingresarController = require("./router/ingresarRouter.js");
const trabajadoresController = require("./router/trabajadoresRouter.js");
const usuarios = require("./router/usuarioRouter.js");

//----------------- Configuración de Middleware -------------------
app.use(bodyParser.json()); // Parsear JSON
app.use(bodyParser.urlencoded({ extended: true })); // Parsear datos de formularios
app.use(express.static(path.join(__dirname, "vista"))); // Servir archivos estáticos
app.use(cors()); // Habilitar CORS
app.use(cookieParser()); // Habilitar el uso de cookies

//------------------ Rutas (Controladores) -----------------------
app.use("/principal", principalController);
app.use("/extraer", extraerController);
app.use("/ingresar", ingresarController);
app.use("/trabajador", trabajadoresController);
app.use("/usuario", usuarios);

//------------------ Rutas para servir archivos HTML --------------
app.get("", (req, res) => {
    res.sendFile(path.join(__dirname, "vista", "html", "login.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "vista", "html", "login.html"));
});

app.get("/agregar",  protegerRutas,(req, res) => {
    res.sendFile(path.join(__dirname, "vista", "html", "agregar.html"));
});

app.get("/index", protegerRutas, (req, res) => {
    res.sendFile(path.join(__dirname, "vista", "html", "index.html"));
});

app.get("/modificarIndex", protegerRutas, (req, res) => {
    res.sendFile(path.join(__dirname, "vista", "html", "editarIndex.html"));
});

app.get("/entrada",  protegerRutas,(req, res) => {
    res.sendFile(path.join(__dirname, "vista", "html", "entrada.html"));
});

app.get("/editarEntrada",  protegerRutas,(req, res) => {
    res.sendFile(path.join(__dirname, "vista", "html", "editarEntrada.html"));
});

app.get("/salida", protegerRutas, (req, res) => {
    res.sendFile(path.join(__dirname, "vista", "html", "salida.html"));
});

app.get("/editarSalida", protegerRutas,(req, res) => {
    res.sendFile(path.join(__dirname, "vista", "html", "editarSalida.html"));
});

app.get("/agregar_entrada", protegerRutas, (req, res) => {
    res.sendFile(path.join(__dirname, "vista", "html", "agregar_entrada.html"));
});

app.get("/agregar_salida", protegerRutas, (req, res) => {
    res.sendFile(path.join(__dirname, "vista", "html", "agregar_salida.html"));
});

app.get("/register",  protegerRutas,(req, res) => {
    res.sendFile(path.join(__dirname, "vista", "html", "register.html"));
});

app.get("/usuarios", protegerRutas, (req, res) => {
    res.sendFile(path.join(__dirname, "vista", "html", "usuarios.html"));
});

app.get("/editarUsuario",  protegerRutas,(req, res) => {
    res.sendFile(path.join(__dirname, "vista", "html", "editarUsuario.html"));
});

app.get("/trabajadores", protegerRutas, (req, res) => {
    res.sendFile(path.join(__dirname, "vista", "html", "trabajadores.html"));
});

app.get("/editarTrabajador", protegerRutas, (req, res) => {
    res.sendFile(path.join(__dirname, "vista", "html", "editarTrabajador.html"));
});

app.get("/registerTrabajador", protegerRutas,(req, res) => {
    res.sendFile(path.join(__dirname, "vista", "html", "registerTrabajador.html"));
});

app.get("/formularioIndex", protegerRutas, (req, res) => {
    res.sendFile(path.join(__dirname, "vista", "html", "formularioIndex.html"));
});

app.get("/usuarioIndex",  protegerRutas,(req, res) => {
    res.sendFile(path.join(__dirname, "vista", "html", "usuarioIndex.html"));
});

//----------------- Servidor -------------------
const PORT = process.env.PORT || 4000; // Usar el puerto desde .env o 4000 por defecto
app.listen(PORT, () => {
    console.log(`✅ Servidor activo en el puerto: ${PORT}`);
    console.log(`🌐 Accede en: http://localhost:${PORT}`);
});

