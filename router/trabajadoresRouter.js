const express= require('express');
const router= express.Router();
const trabajador= require('../controllers/trabajadoresController.js');

//rutas 
router.get('/visualizar',trabajador.visualizar);
router.post('/insertar',trabajador.insertar);
router.put('/actualizar/:id',trabajador.actualizar);
router.delete('/eliminar/:id',trabajador.eliminar);






module.exports= router;