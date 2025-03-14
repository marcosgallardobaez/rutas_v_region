import express from 'express';
import {
    formularioLogin,
    formularioRegistro,
    formularioOlvidePassword
} from '../controllers/adminController.js';

const router = express.Router();

router.get('/login', formularioLogin)
router.get('/registro', formularioRegistro)
router.get('/olvide-password', formularioOlvidePassword )

export default router;