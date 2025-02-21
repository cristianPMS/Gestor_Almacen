const express = require('express');
const router = express.Router();
const principal= require('../controllers/principalController.js');

//rutas 
router.get('/principal',principal.mostrarTabla);
router.post('/agregar', principal.agregarDatos);
router.put('/actualizar/:id',principal.actualizar);
router.delete('/eliminar/:id',principal.eliminar);



module.exports=router;