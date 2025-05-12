import express from 'express';
import {
    formularioLogin,
    formularioRegistro,
    validarRegistro,
    registrar,
    confirmarRegistro,
    formularioOlvidePassword,
    resetPassword,
    autenticar
    
} from '../controllers/adminController.js';

const router = express.Router();

router.get('/registro', formularioRegistro)
router.post('/registro', validarRegistro, registrar)

router.get('/confirmar/:token', confirmarRegistro)

router.get('/login', formularioLogin)

router.get('/olvide-password', formularioOlvidePassword )
router.post('/olvide-password', resetPassword)

router.get('/login', formularioLogin)
router.post('/login', autenticar)

export default router;