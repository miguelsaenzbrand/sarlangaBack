var express = require('express');
var app = express();
var Ticket = require('../models/ticket');
var Cobertura = require('../models/cobertura');
var Usuario = require('../models/usuario');
var Item = require('../models/item');
var mdAutenticacion = require('../middelwares/autenticacion');

app.get('/', mdAutenticacion.verificaToken, (req, res) => {
    Promise.all([
        ultimoUsuario(),
        ultimoItem(),
        ultimoTicket(),
        ultimaCobertura()
    ]).then(respuestas => {
        res.status(200).json({
            ok: true,
            usuario: respuestas[0],
            item: respuestas[1],
            ticket: respuestas[2],
            cobertura: respuestas[3]
        });
    });
});

function ultimoUsuario() {
    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre email img creado area')
            .sort({ field: 'asc', _id: -1 })
            .limit(1)
            .exec((err, usuario) => {
                if (err) {
                    reject('Error al cargar usuario', err);
                } else {
                    resolve(usuario);
                }
            });
    });
}

function ultimoItem() {
    return new Promise((resolve, reject) => {
        Item.find()
            .sort({ field: 'asc', _id: -1 })
            .limit(1)
            .populate('usuario', 'nombre img')
            .exec((err, item) => {
                if (err) {
                    reject('Error al cargar item', err);
                } else {
                    resolve(item);
                }
            });
    });
}

function ultimoTicket() {
    return new Promise((resolve, reject) => {
        Ticket.find()
            .sort({ field: 'asc', _id: -1 })
            .limit(1)
            .populate('usuario', 'nombre img')
            .populate('asignado', 'nombre img')
            .exec((err, ticket) => {
                if (err) {
                    reject('Error al cargar ticket', err);
                } else {
                    resolve(ticket);
                }
            });
    });
}

function ultimaCobertura() {
    return new Promise((resolve, reject) => {
        Cobertura.find()
            .sort({ field: 'asc', _id: -1 })
            .limit(1)
            .populate('usuario', 'nombre img')
            .populate('conductor', 'nombre img')
            .populate('camarografo', 'nombre img')
            .populate('redactor', 'nombre img')
            .populate('productor', 'nombre img')
            .exec((err, cobertura) => {
                if (err) {
                    reject('Error al cargar cobertura', err);
                } else {
                    resolve(cobertura);
                }
            });
    });
}
module.exports = app;