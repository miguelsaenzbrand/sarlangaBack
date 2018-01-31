var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ticketSchema = new Schema({
    descripcion: {
        type: String,
        required: false
    },
    estado: {
        type: String,
        required: false
    },
    creado: {
        type: Number,
        required: false
    },
    modificado: {
        type: Number,
        required: false
    },
    img: {
        type: String,
        required: false
    },
    marca: {
        type: String,
        required: false
    },
    modelo: {
        type: String,
        required: false
    },
    nombre: {
        type: String,
        required: [true, 'El atributo nombre es requerido']
    },
    numeroserie: {
        type: String,
        required: false
    },
    observaciones: {
        type: String,
        required: false
    },
    patrimonio: {
        type: Boolean,
        required: false
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});

module.exports = mongoose.model('Item', ticketSchema);