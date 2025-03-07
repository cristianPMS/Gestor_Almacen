//rutas para controller 
const express= require('express');
const router = express.Router();
const extraer= require('../controllers/extraeController.js');
const { protegerRutas, verificarRol } = require('../middleware/protegerRutas.js');

router.get('/visualizar',protegerRutas,verificarRol('administrador'),extraer.mostrarTable);
router.post('/agregar',protegerRutas,verificarRol('administrador'),extraer.agregar);
router.put('/actualizar/:id',protegerRutas,verificarRol('administrador'),extraer.editar);
router.delete('/eliminar/:id',protegerRutas,verificarRol('administrador'),extraer.eliminar);



module.exports= router;