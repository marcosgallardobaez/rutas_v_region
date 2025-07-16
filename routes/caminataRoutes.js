import express from 'express';
import {
    panel,
    crear
} from '../controllers/caminataController.js';

const router = express.Router();

router.get('/caminatas', panel)

router.get('/crear', crear)

export default router;