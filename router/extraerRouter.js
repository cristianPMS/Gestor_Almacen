//rutas para controller 
const express= require('express');
const router = express.Router();
const extraer= require('../controllers/extraeController.js');

router.get('/visualizar',extraer.mostrarTable);
router.post('/agregar',extraer.agregar);
router.put('/actualizar/:id',extraer.editar);
router.delete('/eliminar/:id',extraer.eliminar);



module.exports= router;