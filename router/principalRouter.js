const express = require('express');
const router = express.Router();
const principal= require('../controllers/principalController.js');
const { protegerRutas, verificarRol } = require('../middleware/protegerRutas.js');

//rutas 
router.get('/principal',protegerRutas,verificarRol('administrador') ,principal.mostrarTabla);
router.get('/usuario',protegerRutas,verificarRol('usuario') ,principal.mostrarTabla);
router.post('/agregar',protegerRutas,verificarRol('administrador'),principal.agregarDatos);
router.put('/actualizar/:id',protegerRutas,verificarRol('administrador'),principal.actualizar);
router.delete('/eliminar/:id',protegerRutas,verificarRol('administrador'),principal.eliminar);



module.exports=router;