import nodemailer from 'nodemailer';

const emailRegistro = async (datos) => {

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }

    });

    //destructuring
    const {nombre, email, token} = datos

    //enviar email

    await transport.sendMail({
        from: 'Rutasvregion.cl',
        to: email,
        subject: 'Confirma tu cuenta en Rutasvregion.cl',
        text: 'Confirma tu cuenta en Rutasvregion.cl',
        html: `
            <h1>Hola ${nombre}</h1>
            <p>Gracias por registrarte en Rutasvregion.cl.</p>
            <p>Para confirmar tu cuenta, haz click en el siguiente enlace:</p>
            <a href="${process.env.BACKEND_URL}:${process.env.PORT || 3000}/admin/confirmar/${token}">Confirmar mi cuenta</a>

            <p>Si no creaste esta cuenta, puedes ignorar este mensaje </p>
            `
    });

};

const emailOlvidePassword = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }

    });

    //destructuring
    const {nombre, email, token} = datos

    //enviar email

    await transport.sendMail({
        from: 'Rutasvregion.cl',
        to: email,
        subject: 'Restablece tu contraseña en Rutasvregion.cl',
        text: 'Restablece tu contraseña en Rutasvregion.cl',
        html: `
            <h1>Hola ${nombre}</h1>
            <p>Haz solicitado restablecer tu contraseña</p>
            <p>Por favor, crea una nueva contraseña haciendo click en el siguiente enlace:</p>
            <a href="${process.env.BACKEND_URL}:${process.env.PORT || 3000}/admin/olvide-password/${token}">Restablecer contraseña</a>

            <p>Si no solicitaste cambio de contraseña, puedes ignorar este mensaje </p>
            `
    });
};


export {
    emailRegistro,
    emailOlvidePassword
}