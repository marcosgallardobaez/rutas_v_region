import Admin from "./Admin.js";
import Caminata from "./Caminata.js";
import Ubicacion from "./Ubicacion.js";
import Dificultad from "./Dificultad.js";
import Tipo from "./Tipo.js";

Caminata.belongsTo(Ubicacion, {foreignKey: 'ubicacionId', onDelete: 'Cascade'});
Ubicacion.hasMany(Caminata, {foreignKey: 'ubicacionId', onDelete: 'Cascade'});

Caminata.belongsTo(Dificultad, {foreignKey: 'dificultadId', onDelete: 'Cascade'});

Caminata.belongsTo(Tipo, {foreignKey: 'tipoId', onDelete: 'Cascade'});

Caminata.belongsTo(Admin, {foreignKey: 'adminId', onDelete:'Cascade'});

export {
    Admin,
    Caminata,
    Ubicacion,
    Dificultad,
    Tipo
};