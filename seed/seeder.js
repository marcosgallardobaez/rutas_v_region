import db from '../config/db.js';
import {exit} from 'node:process';
import dificultades from './dificultad.js';
import tipos from './tipo.js';
import { Dificultad, Tipo } from '../models/index.js';


console.log('🟡 Ejecutando seeder...');

const importarDatos = async () => {

    try {

        //autenticar en la base de datos
        await db.authenticate()

        //generar columnas 
        await db.sync()

        //insertar datos en las tablas
        await Promise.all([
            console.log('⚙️  Insertando dificultades...'),
            Dificultad.bulkCreate(dificultades),
            console.log('✅ Dificultades insertadas'),
            Tipo.bulkCreate(tipos)
        ])

        console.log('Datos importados con éxito')
        exit(0)
    } catch (error) {
        console.log('error al importar los datos:', error)
        exit(1)
    }
};

if (process.argv[2] === "-i"){
    importarDatos()
};

const eliminarDatos = async () => {
    try {
        //sincronizar la base de datos 
        await db.sync({force: true})
        console.log('Datos eliminados con éxito')
        exit(0)
    } catch (error) {
        console.log('Error al eliminar los datos:', error)
        exit(1)
    }
};

if (process.argv[2] === "-e"){
    eliminarDatos()
};