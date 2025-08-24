import express from 'express';
import { body } from 'express-validator';
import {
    panel,
    crear,
    guardar
} from '../controllers/caminataController.js';
import protegerRuta from '../middlewares/protegerRuta.js';

const router = express.Router();

router.get('/caminatas', protegerRuta, panel)

router.get('/crear', protegerRuta, crear)
router.post('/crear', protegerRuta,
    body('titulo').notEmpty().withMessage('El título de la caminata es obligatorio'),
    body('descripcion').notEmpty().withMessage('La descripción de la caminata es obligatoria'),
    body('dificultad').notEmpty().withMessage('La dificultad de la caminata es obligatoria'),
    body('tipo').notEmpty().withMessage('El tipo de caminata es obligatorio'),
    body('fecha').notEmpty().withMessage('La fecha de la caminata es obligatoria'),
    body('horaInicio').notEmpty().withMessage('La hora de inicio es obligatoria'),
    body('horaTermino').notEmpty().withMessage('La hora de fin es obligatoria'),
    body('cupos').notEmpty().withMessage('Los cupos de la caminata son obligatorios'),
    body('precio').notEmpty().withMessage('El precio de la caminata es obligatorio'),
    body('nombre').notEmpty().withMessage('El nombre de la ubicación es obligatorio'),
    body('direccion').notEmpty().withMessage('La dirección de la caminata es obligatoria'),
    body('comuna').notEmpty().withMessage('La comuna de la caminata es obligatoria'),
    body('provincia').notEmpty().withMessage('La provincia de la caminata es obligatoria'),
    body('region').notEmpty().withMessage('La región de la caminata es obligatoria'),
    body('pais').notEmpty().withMessage('El país de la caminata es obligatorio'),
    body('lat').notEmpty().withMessage('La latitud de la caminata es    obligatoria'),
    body('lng').notEmpty().withMessage('La longitud de la caminata es obligatoria'),
    
    guardar)

export default router;