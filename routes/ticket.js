var express = require('express');

var mdAutenticacion = require('../middelwares/autenticacion');
var Ticket = require('../models/ticket');

var app = express();

/*
Obtiene todos los tickets
*/
app.get('/', mdAutenticacion.verificaToken, (req, res) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Ticket.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email img')
        .populate('asignado', 'nombre email img')
        .exec(
            (err, tickets) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando Tickets',
                        errrors: err
                    });
                }
                Ticket.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        tickets: tickets,
                        total: conteo
                    });
                });
            });
});

/*
 * Obtiene un ticket
 */
app.get('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Ticket.findById(id)
        .populate('usuario', 'nombre email img')
        .populate('asignado', 'nombre email img')
        .exec((err, ticket) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar ticket',
                    errrors: err
                });
            }
            if (!ticket) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El ticket con el id ' + id + ' no existe',
                    errrors: {
                        message: 'No existe un ticket con ese ID'
                    }
                });
            }
            res.status(200).json({
                ok: true,
                ticket: ticket
            });
        });
});

/*
 * Retorna un número de coincidencia de estado
 */
app.get('/estado/conteo/:estado', mdAutenticacion.verificaToken, (req, res) => {
    var estado = req.params.estado
    Ticket.find({
            estado: estado
        }).count()
        .exec(
            (err, tickets) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando Tickets',
                        errrors: {
                            message: 'El parámetro estado solo permite, nuevo, pendiente y cerrrado'
                        }
                    });
                }
                res.status(200).json({
                    ok: true,
                    ticketTotales: tickets
                });
            });
});

/*
Crea ticket
*/
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var fecha = Date.now();

    var ticket = new Ticket({
        asignado: body.asignado,
        detalle: body.detalle,
        estado: 'nuevo',
        creado: fecha,
        incidencia: body.incidencia,
        prioridad: body.prioridad,
        usuario: req.usuario._id
    });

    ticket.save((err, ticketGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error guardando Tickets',
                errrors: err
            });
        }
        res.status(200).json({
            ok: true,
            ticket: ticketGuardado
        });
    });
});

/*
Actualiza ticket
*/
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Ticket.findById(id, (err, ticket) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar ticket',
                errrors: err
            });
        }
        if (!ticket) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El ticket con el id ' + id + ' no existe',
                errrors: {
                    message: 'No existe un ticket con ese id'
                }
            });
        }

        ticket.asignado = body.asignado,
            ticket.detalle = body.detalle,
            ticket.estado = body.estado,
            ticket.incidencia = body.incidencia,
            ticket.prioridad = body.prioridad,
            ticket.usuario = req.usuario._id

        ticket.save((err, ticketGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error actualizando ticket',
                    errrors: err
                });
            }
            ticketGuardado.password = '=)';
            res.status(200).json({
                ok: true,
                ticket: ticketGuardado
            });
        });
    });
});

/*
Borra Ticket
*/
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Ticket.findByIdAndRemove(id, (err, ticketBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrando ticket',
                errrors: err
            });
        }
        if (!ticketBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un ticket con ese id',
                errrors: {
                    message: 'No existe un ticket con ese id'
                }
            });
        }
        res.status(200).json({
            ok: true,
            ticket: ticketBorrado
        });
    });
});
module.exports = app;