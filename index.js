import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import flash from 'connect-flash';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import adminRoutes from './routes/adminRoutes.js';
import visitRoutes  from "./routes/visitRoutes.js";
import db from './config/db.js';

//configurar __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


//crear app
const app = express();

//habilitar lectura de datos de formularios
app.use(express.urlencoded({ extended: true}))


//configuración de sesiones y flash
app.use(session({
    secret: 'supersecretkey',
    resave: false,
    saveUninitialized: false
}));


//configuracion flash mensajes
app.use(flash());

//variables globales para mensajes
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.errors = req.flash('errors');
    next();
});

//habilitar cookieParser
app.use(cookieParser());

//habilitar CSRF
app.use(csrf({cookie: true})); //configurado de forma global


//conectar a la base de datos
try {
    await db.authenticate();
    db.sync();
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

//habilitar archivos estaticos
app.use(express.static( 'public'));

//definir puerto e inicio de servidor
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`)
});