import jwt from 'jsonwebtoken';
import { Admin } from '../models/index.js';

const protegerRuta = async (req, res, next) => {
    
    //verificar si el admin posee un token de sesión

    const {_token} = req.cookies

    if (!_token) {
        return res.redirect('/admin/login')
    }

    //comprobar si el token el válido

    try {
        const decoded = jwt.verify(_token, process.env.JWT_SECRET);
        
        const admin = await Admin.scope('eliminarPassword').findByPk(decoded.id)

        console.log(admin)

        //almacenar el admin en el request
        if(admin) {
            req.admin = admin
        } else {
            return res.redirect('/admin/login')
        }

        return next()

    } catch (error) {
        return res.clearCookie('_token').redirect('/admin/login')
    }

    next();
}

export default protegerRuta