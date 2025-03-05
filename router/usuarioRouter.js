// routes/usuariosRouter.js
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController.js');
const { protegerRutas, verificarRol } = require('../middleware/protegerRutas.js');


// Rutas para el registro y login
router.get('/mostrar',protegerRutas,verificarRol('administrador'),usuarioController.mostrar);
router.post('/register', protegerRutas,verificarRol('administrador'),usuarioController.register);
router.post('/login', usuarioController.login);
router.put('/actualizar/:id',protegerRutas,verificarRol('administrador'),usuarioController.actualizar);
router.delete('/eliminar/:id',protegerRutas,verificarRol('administrador'),usuarioController.delete);

router.get('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',  
        sameSite: 'Strict',
        path: '/'
    });
    res.redirect('/login');  
});






module.exports = router;
