const express = require('express');
const router = express.Router();
const ingresar = require('../controllers/ingresarController.js');

router.get('/mostrar',ingresar.mostrar);
router.post('/ingresar',ingresar.agregar);
router.put('/actualizar/:id',ingresar.actualizar);
router.delete('/eliminar/:id',ingresar.eliminar);






module.exports=router;