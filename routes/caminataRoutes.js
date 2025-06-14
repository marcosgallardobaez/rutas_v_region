import express from 'express';
import {
    panel
} from '../controllers/caminataController.js';

const router = express.Router();

router.get('/caminatas', panel)

export default router;