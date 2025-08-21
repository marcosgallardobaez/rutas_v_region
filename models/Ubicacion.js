import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Ubicacion = db.define('ubicaciones', {
   
    nombre: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    direccion: {
        type: DataTypes.STRING(80),
        allowNull: false
    },
    comuna: {
        type: DataTypes.STRING(80),
        allowNull: false
    },
    provincia: {
        type: DataTypes.STRING(80),
        allowNull: false
    },
    region: {
        type: DataTypes.STRING(80),
        allowNull: false
    },
    pais: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    lat: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lng: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

export default Ubicacion;