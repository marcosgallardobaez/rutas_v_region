import Admin from "../models/Admin.js";
import { check, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { generarId, generarJWT } from "../helpers/token.js";
import { emailRegistro, emailOlvidePassword } from "../helpers/email.js";

const formularioLogin = (req, res) => {
    const csrfToken = req.csrfToken();
    res.render('admin/login', {
        success_msg: req.flash('success_msg'),
        csrfToken,
        errores: [],
        datos: {}
    })
};

const autenticar = async (req, res) => {
    console.log('Autenticando...')

    //validación de usuario 
    await check('email')
        .isEmail()
        .withMessage('El email es obligatorio')
        .run(req);
    await check('password')
        .notEmpty()
        .withMessage('La contraseña es obligatoria')
        .run(req);

const resultado = validationResult(req);

    //verificar si hay errores
    if (!resultado.isEmpty()) {
        return res.render('admin/login', {
            csrfToken: req.csrfToken(),
            errores: resultado.array()

        });
    }

    const { email, password } = req.body

    //busca el usuario por el email en la base de datos
    const admin = await Admin.findOne({ where: { email}})
    //comprobar si existe el usuario
    if(!admin) {
        return res.render('admin/login', {
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'El administrador no existe'}]
        });
    }

    //verificar si la cuenta es correcta
    const esPasswordCorrecto = await admin.verificarPassword(password);
    console.log('¿La contraseña es correcta?', esPasswordCorrecto)
    
    //si la contraseña no es correcta, mostrar mensaje de error
    if(!esPasswordCorrecto) {
        return res.render('admin/login', {
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'La contraseña es incorrecta'}]
        });
    }
    
    //comprobar si el admin está confirmado
    if(!admin.confirmado) {
        return res.render('admin/login', {
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'Tu cuenta no ha sido confirmada'}]
        });
    }

     //generar jwt para autenticar al admin
     const token = generarJWT({id: admin.id, nombre: admin.nombre});

     console.log('JWT generado:', token);

    //si todo es correcto, redirigir al dashboard o sesión exitosa
    // return res.render('admin/dashboard');

    //confirmar autenticación para activar middleware
    req.session.isAuth = true;
    req.session.admin = {
        id: admin.id,
        nombre: admin.nombre,
        email: admin.email
    };

    return res.cookie('_token',token, {
        httpOnly: true,
    }).redirect('/caminatas/caminatas')
   

};

const formularioRegistro = (req, res) => {
    const csrfToken = req.csrfToken();
    console.log('CSRF Token generado:', csrfToken);
    res.render('admin/registro', {
        csrfToken,
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
            csrfToken: req.csrfToken(),
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

        res.render('admin/confirmar-cuenta', {
            csrfToken: req.csrfToken(),
            success_msg: 'Administrador registrado correctamente. Redirigiendo al inicio de sesión...',
            errores: [],
            datos: {}
        });

        //Enviar email de registro
    emailRegistro({
        nombre: admin.nombre,
        email: admin.email,
        token: admin.token
    })

    } catch (error) {
        console.error('Error al crear al administrador:', error);
        req.flash('error_msg', 'Hubo un error al registrar el administrador');
        res.redirect('/admin/registro')
    }

    
   
};

const confirmarRegistro = async (req, res) => {
    const { token } = req.params;

    try {
        const admin = await Admin.findOne({ where: { token} });

        if (!admin) {
            return res.render('admin/confirmar', {
                error_msg: 'El token no es válido. Por favor verifica tu correo o registrate nuevamente.',
                confirmado: false
            });
        }

        //confirmar cuenta
        admin.token = null;
        admin.confirmado = true;
        await admin.save();

        res.render('admin/confirmar',{
            success_msg: 'Cuenta confirmada exitosamente. Ahora puedes iniciar sesión.',
            confirmado: true
            });
    } catch (error) {
        console.error('Error al confirmar la cuenta:', error);
        res.render('admin/confirmar', {
            error_msg: 'Hubp un error al confirmar tu cuenta. Por favor intentalo más tarde.',
            confirmado: false
        });
    }
}

const formularioOlvidePassword = (req, res) => {
    const csrfToken = req.csrfToken();
    console.log('CSRF Token generado:', csrfToken);
    res.render('admin/olvide-password', {
        csrfToken,
        errores: [],
        datos: {}
    });
};

const resetPassword = async (req, res) => {
    //validar el email
    await check('email')
        .isEmail()
        .withMessage('Ingresa un email válido')
        .run(req);

    const resultado = validationResult(req);

    //verificar si hay errores
    if (!resultado.isEmpty()) {
        return res.render('admin/olvide-password', {
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            admin: { email: req.body.email} //en caso de que haya errores, esta linea devuelve el email para no volver a escribirlo
        });
    }

    try {
        //buscar al admin por su email
        const admin = await Admin.findOne({ where: { email: req.body.email } });

        if (!admin) {
            return res.render('admin/olvide-password', {
                csrfToken: req.csrfToken(),
                errores: [{ msg: 'El email no está registrado' }],
                admin: { email: req.body.email }
            });
        }

        //generar un nuevo token 
        admin.token = generarId();
        await admin.save();

        //enviar el correo con instrucciones para resetear la contraseña
        await emailOlvidePassword({
            nombre: admin.nombre,
            email: admin.email,
            token: admin.token
        });

        //redirigir con mensaje de éxito
        req.flash('success_msg', 'Hemos enviado un correo con las instrucciones para restablecer tu contraseña.');
        return res.redirect('/admin/olvide-password');
    } catch (error) {
        console.error('Error en resetPassword:', error);
        return res.render('admin/olvide-password', {
            pagina: 'Restablecer Contraseña',
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'Hubo un error al procesar la solicitud. Por favor intenta nuevamente.' }],
            admin: { email: req.body.email } 
        });
    }
  
};

const comprobarToken = async (req, res) => {
    const { token } = req.params;

    const admin = await Admin.findOne({ where: { token} })
    if (!admin) {
        return res.render('admin/confirmar', {
            error_msg: 'Hubo un error al validar tu información. Intenta de nuevo más tarde.',
            confirmado: false
        });
    }

    //mostrar formulario para restablecer la contraseña
    res.render('admin/reset-password', {
        pagina: 'Restablecer Contraseña',
        csrfToken: req.csrfToken(),
        token
    });
};

const nuevoPassword = async (req, res) => {
    console.log('Guardando nuevo password...')

    //validar password
    await check('password')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres')
        .run(req);

    const resultado = validationResult(req);
    //verificar que no haya errores
    if (!resultado.isEmpty()) {
        //errores
        return res.render('admin/reset-password', {
            pagina: 'Restablecer Contraseña',
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        })
    }

    //extraer el token de la url(params) y el password ingresada(body)
    const { token } = req.params;
    const { password } = req.body;

    //identificar al admin 
    const admin = await Admin.findOne({ where: { token } })

    //hashear el  nuevo password
    const salt = await bcrypt.genSalt(10)
    admin.password = await bcrypt.hash(password, salt)
    admin.token = null;

    await admin.save();

    //renderizar páina de confirmación
    req.flash('success_msg', 'La contraseña se ha restablecido correctamente. Ahora puedes iniciar sesión');
    res.redirect('/admin/login');
    
};



export {
    formularioLogin,
    autenticar,
    formularioRegistro,
    validarRegistro,
    registrar,
    confirmarRegistro,
    formularioOlvidePassword,
    resetPassword,
    nuevoPassword,
    comprobarToken
};