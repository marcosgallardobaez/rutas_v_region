import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Dificultad = db.define('dificultades', {

    nombre: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
});

export default Dificultad;