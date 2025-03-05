const express= require('express');
const router= express.Router();
const trabajador= require('../controllers/trabajadoresController.js');
const { protegerRutas, verificarRol } = require('../middleware/protegerRutas.js');


//rutas 
router.get('/visualizar',protegerRutas,verificarRol('administrador'),trabajador.visualizar);
router.post('/insertar',protegerRutas,verificarRol('administrador'),trabajador.insertar);
router.put('/actualizar/:id',protegerRutas,verificarRol('administrador'),trabajador.actualizar);
router.delete('/eliminar/:id',protegerRutas,verificarRol('administrador'),trabajador.eliminar);






module.exports= router;