import express from 'express';
import adminRoutes from './routes/adminRoutes.js';

//crear app
const app = express();


//rutas

app.use('/', adminRoutes)

//definir puerto e inicio de servidor
const port = 3000;

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`)
});