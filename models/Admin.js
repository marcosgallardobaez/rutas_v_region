import { DataTypes } from "sequelize";
import bcrypt from 'bcrypt';
import db from '../config/db.js';

const Admin = db.define('admin', {
    nombre: {
        type: DataTypes.STRING,
        allownull: false
    },

    email: {
        type: DataTypes.STRING,
        allownull: false
    },

    password: {
        type: DataTypes.STRING,
        allownull: false
    },

    token: DataTypes.STRING,
    confirmado: DataTypes.BOOLEAN
}, {
    hooks: {
        beforeCreate: async function(admin) {
            const salt = await bcrypt.genSalt(10)
            admin.password = await bcrypt.hash(admin.password, salt)
        }
    }



});

Admin.prototype.verificarPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

export default Admin;