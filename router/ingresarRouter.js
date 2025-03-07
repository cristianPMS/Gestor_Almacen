const express = require('express');
const router = express.Router();
const ingresar = require('../controllers/ingresarController.js');
const { protegerRutas, verificarRol } = require('../middleware/protegerRutas.js');


router.get('/mostrar',protegerRutas,verificarRol('administrador'),ingresar.mostrar);
router.post('/ingresar',protegerRutas,verificarRol('administrador'),ingresar.agregar);
router.put('/actualizar/:id',protegerRutas,verificarRol('administrador'),ingresar.actualizar);
router.delete('/eliminar/:id',protegerRutas,verificarRol('administrador'),ingresar.eliminar);






module.exports=router;