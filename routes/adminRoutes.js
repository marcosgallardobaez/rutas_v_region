import express from 'express';
import {
    formularioLogin,
    formularioRegistro,
    registrar,
    formularioOlvidePassword,
    validarRegistro
} from '../controllers/adminController.js';

const router = express.Router();

router.get('/registro', formularioRegistro)
router.post('/registro', validarRegistro, registrar)

router.get('/login', formularioLogin)
router.get('/olvide-password', formularioOlvidePassword )

export default router;