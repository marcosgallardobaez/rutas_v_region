import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hola Papito');
});

router.get('/login', (req, res) => {
    res.send('Ingresa a la plataforma');
})


export default router;