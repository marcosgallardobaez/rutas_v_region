import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './config/db.js';
import adminRoutes from './routes/adminRoutes.js';
import visitRoutes  from "./routes/visitRoutes.js";


//crear app
const app = express();


//configurar __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//conectar a la base de datos
try {
    await db.authenticate();
    console.log('Conexión exitosa a la base de datos');
} catch (error) {
    console.log(error)
}

//configuracion de Handlebars
app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    partialsDir: path.join(__dirname, 'views', 'partials')
}));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

//rutas
app.use('/', visitRoutes)
app.use('/admin', adminRoutes);

//definir puerto e inicio de servidor
const port = 3000;

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`)
});