// routes/usuariosRouter.js
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController.js');

// Rutas para el registro y login
router.get('/mostrar',usuarioController.mostrar);
router.post('/register', usuarioController.register);
router.post('/login', usuarioController.login);
router.put('/actualizar/:id',usuarioController.actualizar);
router.delete('/eliminar/:id',usuarioController.delete);

module.exports = router;
