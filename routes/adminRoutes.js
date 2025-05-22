import express from 'express';
import {
    formularioLogin,
    formularioRegistro,
    validarRegistro,
    registrar,
    confirmarRegistro,
    formularioOlvidePassword,
    resetPassword,
    autenticar,
    comprobarToken,
    nuevoPassword
    
} from '../controllers/adminController.js';


const router = express.Router();

router.get('/login', formularioLogin)
router.post('/login', autenticar)

router.get('/registro', formularioRegistro)
router.post('/registro', validarRegistro, registrar)

router.get('/confirmar/:token', confirmarRegistro)

router.get('/olvide-password', formularioOlvidePassword )
router.post('/olvide-password', resetPassword)

router.get('/reset-password/:token', comprobarToken);
router.post('/reset-password/:token', nuevoPassword)



export default router;