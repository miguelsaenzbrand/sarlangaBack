var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var notificacionSchema = new Schema({
    asignado: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: 'Usuario'
    },
    ticket: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: 'Ticket'
    },
    cobertura: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: 'Cobertura'
    },
    estado: {
        type: Boolean,
        required: false
    },
    creado: {
        type: Number,
        required: false
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
}, {
        collection: 'notificaciones'
    });

module.exports = mongoose.model('Notificacion', notificacionSchema);