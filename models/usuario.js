var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// tabla
var usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    email: { type: String, unique: true, required: [true, 'El email es necesario'] },
    password: { type: String, required: [true, 'El contraseña es necesaria'] },
    img: {type: String, required: false},
    role: { type: String, required: true, default: 'USER_ROLE' }

});
// Se exporta el modelo
module.exports = mongoose.model('Usuario',usuarioSchema);