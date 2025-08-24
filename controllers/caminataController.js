import { validationResult } from 'express-validator';
import { raw } from 'express';
import { Dificultad, Tipo, Ubicacion, Caminata } from '../models/index.js';

const panel = (req, res) => {
    res.render('caminatas/caminatas', {
        pagina: 'Caminatas'
    });
}

const crear = async (req, res) => {
    const csrfToken = req.csrfToken();

    try {
        //obtener las dificultades y tipos
        const [dificultades, tipos, ubicaciones] = await Promise.all([
            Dificultad.findAll({ raw: true}),  //Cuando obtienes datos con findAll(), Sequelize los devuelve con muchas propiedades adicionales (dataValues, _previousDataValues, etc.), pero Handlebars solo puede acceder a datos planos.
            Tipo.findAll({ raw: true }),//raw: true hace que Sequelize devuelva objetos simples, eliminando la estructura interna.
            Ubicacion.findAll({ raw: true})
        ]);

        res.render('caminatas/crear', {
        pagina: 'Crear Caminata',
        csrfToken,
        ocultarBarra: true,
        dificultades,
        tipos,
        ubicaciones, 
    });

    } catch (error) {
        console.error('Error al obtener datos para el formulario:', error);
        res.status(500).send('Error al cargar el formulario de creación de caminatas');
    }

    
};

const guardar = async (req, res) => {
    const csrfToken = req.csrfToken();

    const { titulo, descripcion, tipo, dificultad, fecha, horaInicio, horaTermino, cupos, precio, ubicacionId,
        //campos de ubicacion
        nombre, direccion, comuna, provincia, region, pais, lat, lng
     } = req.body;

    const {id: adminId} = req.admin
    const tipoId = tipo;
    const dificultadId = dificultad;
    
    
     ////resultado validación
    let resultado = validationResult(req);
    if (!resultado.isEmpty()) {
    //consulta modelo de dificultad y tipo
    const [dificultades, tipos, ubicaciones] = await Promise.all([
        Dificultad.findAll({ raw: true }),
        Tipo.findAll({ raw: true }),
        Ubicacion.findAll({ raw: true})
    ]);

    res.render('caminatas/crear', {
        pagina: 'Crear Caminata',
        csrfToken,
        ocultarBarra: true,
        dificultades,
        tipos,
        ubicaciones,
        errores: resultado.array()
    });
    }

    try {
        //crear la ubicacion primero
        let ubicacionIdFinal = ubicacionId;

        //si no se selecciona una ubicación existente, creamos una nueva
        if (!ubicacionId || ubicacionId.trim() === '') {
        const nuevaUbicacion = await Ubicacion.create({
            nombre,
            direccion,
            comuna,
            provincia,
            region,
            pais,
            lat,
            lng
        });
        ubicacionIdFinal = nuevaUbicacion.id

    }


        const caminataGuardar = await Caminata.create({
            titulo,
            descripcion,
            dificultadId,
            tipoId,
            fecha,
            horaInicio,
            horaTermino,
            cupos,
            precio,
            ubicacionId: ubicacionIdFinal,
            adminId,
            imagen: '',
            publicado: false
        })
        console.log('Caminata guardada:', caminataGuardar)
    } catch (error) {
        console.log(error)
    }

    console.log('Guardando Formulario');

};

export {
    panel,
    crear,
    guardar
}
