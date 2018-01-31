var express = require('express');
var app = express();
var Ticket = require('../models/ticket');
var Cobertura = require('../models/cobertura');
var Usuario = require('../models/usuario');
var Item = require('../models/item');

/**
 * Búsqueda por colección
 */
app.get('/coleccion/:tabla/:busqueda', (req, res, next) => {
    var tabla = req.params.tabla;
    var busqueda = req.params.busqueda;
    var expresionRegular = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, expresionRegular);
            break;
        case 'items':
            promesa = buscarItems(busqueda, expresionRegular);
            break;
        case 'coberturas':
            promesa = buscarCoberturas(busqueda, expresionRegular);
            break;
        case 'tickets':
            promesa = buscarTickets(busqueda, expresionRegular);
            break;
        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de colección de búsqueda sólo son: usuarios, items, tickets y coberturas',
                error: {
                    message: 'Tipo de tabla/colección no válida'
                }
            });
    }
    promesa.then(data => {
        return res.status(200).json({
            ok: true,
            [tabla]: data
        });
    });
});
/**
 * Búsqueda general
 */
app.get('/todo/:busqueda', (req, res, next) => {
    var busqueda = req.params.busqueda;
    var expresionRegular = new RegExp(busqueda, 'i');

    Promise.all([
        buscarUsuarios(busqueda, expresionRegular),
        buscarItems(busqueda, expresionRegular),
        buscarCoberturas(busqueda, expresionRegular),
        buscarTickets(busqueda, expresionRegular),
    ]).then(respuestas => {
        res.status(200).json({
            ok: true,
            usuarios: respuestas[0],
            items: respuestas[1],
            coberturas: respuestas[2],
            tickets: respuestas[3]
        });
    });
});
/*
Buscar usuarios
*/
function buscarUsuarios(busqueda, expresionRegular) {
    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre email role img')
            .or([{
                'nombre': expresionRegular
            }, {
                'email': expresionRegular
            }, {
                'area': expresionRegular
            }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }
            });
    });
}
/*
Buscar items
*/
function buscarItems(busqueda, expresionRegular) {
    return new Promise((resolve, reject) => {
        Item.find({})
            .or([{
                'nombre': expresionRegular
            }, {
                'marca': expresionRegular
            }])
            .populate('usuario', 'nombre email img')
            .exec((err, items) => {
                if (err) {
                    reject('Error al cargar items', err);
                } else {
                    resolve(items);
                }
            });
    });
}

/*
Buscar coberturas
*/
function buscarCoberturas(busqueda, expresionRegular) {
    return new Promise((resolve, reject) => {
        Cobertura.find({})
            .or([{
                'title': expresionRegular
            }, {
                'descripcion': expresionRegular
            }])
            .populate('usuario', 'nombre email img')
            .exec((err, coberturas) => {
                if (err) {
                    reject('Error al cargar coberturas', err);
                } else {
                    resolve(coberturas);
                }
            });
    });
}

/*
Buscar tickets
*/
function buscarTickets(busqueda, expresionRegular) {
    return new Promise((resolve, reject) => {
        Ticket.find({})
            .or([{
                'prioridad': expresionRegular
            },
            {
                'estado': expresionRegular
            }])
            .populate('usuario', 'nombre email img')
            .exec((err, tickets) => {
                if (err) {
                    reject('Error al cargar tickets', err);
                } else {
                    resolve(tickets);
                }
            });
    });
}

module.exports = app;