import Admin from "../models/Admin.js";
import { check, validationResult } from "express-validator";
import { generarId } from "../helpers/token.js";

const formularioLogin = (req, res) => {
    res.render('admin/login')
}

const formularioRegistro = (req, res) => {
    res.render('admin/registro', {
        errores: [],
        datos: {}
    })
};

const validarRegistro = [
    check('nombre')
        .notEmpty()
        .withMessage('El nombre es obligatorio'),
    check('email')
        .isEmail()
        .withMessage('Ingresa un email válido')
        .custom(async (email) => {
            //verificar si el email ya existe
            const existeEmail = await Admin.findOne({ where: { email } });
            if (existeEmail) {
                throw new Error('El email ya está registrado');
            }
        }),
    check('password')
        .isLength({ min: 6})
        .withMessage('La contraseña debe tener al menos 6 caracteres'),
    check('repetirPassword')
        .custom((value, {req}) => value === req.body.password)
        .withMessage('Las contraseñas no coinciden')
];

const registrar = async (req, res) => {

    const {nombre, email, password} = req.body;

    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.render('admin/registro', {
            errores: errores.array().map(error => error.msg),
            datos: { nombre, email } 
        });
    }

    try {
        //crear un nuevo admin solo con los campos necesarios
        const admin = await Admin.create({
            nombre: nombre.trim(),
            email: email.toLowerCase().trim(),
            password: password.trim(),
            token: generarId()
        });

        res.render('admin/registro', {
            success_msg: 'Administrador registrado correctamente. Redirigiendo al inicio de sesión...',
            errores: [],
            datos: {}
        });
    } catch (error) {
        console.error('Error al crear al administrador:', error);
        req.flash('error_msg', 'Hubo un error al registrar el administrador');
        res.redirect('/admin/registro')
    }

   
};

const formularioOlvidePassword = (req, res) => {
    res.render('admin/olvide-password')
};

export {
    formularioLogin,
    formularioRegistro,
    registrar,
    formularioOlvidePassword,
    validarRegistro
}