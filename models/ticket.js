var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ticketSchema = new Schema({
    asignado: {
        type: Schema.Types.ObjectId,
        required: [true, 'El atributo prioridad es requerido'],
        ref: 'Usuario'
    },
    detalle: {
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
    incidencia: {
        type: String,
        required: false
    },
    prioridad: {
        type: String,
        required: [true, 'El atributo prioridad es requerido']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});

module.exports = mongoose.model('Ticket', ticketSchema);