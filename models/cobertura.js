var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var coberturaSchema = new Schema({
    descripcion: {
        type: String,
        required: false
    },
    direccion: {
        type: String,
        required: [true, 'El campo dirección es requerido']
    },
    title: {
        type: String,
        required: [true, 'El campo título es requerido']
    },
    start: {
        type: String,
        required: [true, 'El campo fecha inicio es requerido']
    },
    end: {
        type: String,
        required: [true, 'El campo fecha fin es requerido']
    },
    creada: {
        type: Number,
        required: false
    },
    movilidad: {
        type: Boolean,
        required: false
    },
    conductor: {
        required: false,
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    camara: {
        type: Boolean,
        required: false
    },
    camarografo: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    productores: {
        type: Boolean,
        required: false
    },
    productor: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    redactores: {
        type: Boolean,
        required: false
    },
    redactor: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    fotografia: {
        type: Boolean,
        required: false
    },
    insumos: {
        type: String,
        required: false
    },
    className: {
        type: String,
        required: [true, 'El campo color es requerido']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});

module.exports = mongoose.model('Cobertura', coberturaSchema);