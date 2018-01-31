var express = require('express');

var mdAutenticacion = require('../middelwares/autenticacion');
var Notificacion = require('../models/notificacion');

var app = express();

/*
Obtiene todos los notificaciones
*/
app.get('/', mdAutenticacion.verificaToken, (req, res) => {
    var desde = req.query.desde || 0;
    var notificacionUsuario = req.query.usuario;
    desde = Number(desde);

    Notificacion.find({
        asignado: notificacionUsuario
    })
        .sort({
            field: 'desc',
            _id: -1
        })
        .skip(desde)
        .limit(5)
        .populate('asignado', 'nombre email img')
        .populate('ticket', 'incidencia prioridad creado')
        .populate('cobertura', 'title creado')
        .populate('usuario', 'nombre email img')
        .exec(
        (err, notificaciones) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando Notificaciones',
                    errrors: err
                });
            }
            res.status(200).json({
                ok: true,
                notificaciones: notificaciones
            });
        });
});

/*
 * Obtiene un notificacion
 */
app.get('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Notificacion.findById(id)
        .populate('usuario', 'nombre email img')
        .populate('asignado', 'nombre email img')
        .populate('ticket', 'incidencia prioridad creado')
        .populate('cobertura', 'title creado')
        .exec((err, notificacion) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar notificacion',
                    errrors: err
                });
            }
            if (!notificacion) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'La notificacion con el id ' + id + ' no existe',
                    errrors: {
                        message: 'No existe una notificacion con ese ID'
                    }
                });
            }
            res.status(200).json({
                ok: true,
                notificacion: notificacion
            });
        });
});

/*
Crea notificacion
*/
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var fecha = Date.now();

    var notificacion = new Notificacion({
        asignado: body.asignado,
        ticket: body.ticket,
        cobertura: body.cobertura,
        estado: true,
        creado: fecha,
        usuario: req.usuario._id
    });

    notificacion.save((err, notificacionGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error guardando Notificacion',
                errrors: err
            });
        }
        res.status(200).json({
            ok: true,
            notificacion: notificacionGuardado
        });
    });
});

/*
Actualiza notificacion
*/
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;
    var fecha = Date.now();

    Notificacion.findById(id, (err, notificacion) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar notificacion',
                errrors: err
            });
        }
        if (!notificacion) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La notificacion con el id ' + id + ' no existe',
                errrors: {
                    message: 'No existe una notificacion con ese id'
                }
            });
        }

        notificacion.asignado = body.asignado,
            notificacion.ticket = body.ticket,
            notificacion.cobertura = body.cobertura,
            notificacion.estado = body.estado,
            notificacion.creado = fecha,
            notificacion.usuario = req.usuario._id

        notificacion.save((err, notificacionGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error actualizando notificacion',
                    errrors: err
                });
            }
            notificacionGuardado.password = '=)';
            res.status(200).json({
                ok: true,
                notificacion: notificacionGuardado
            });
        });
    });
});

/*
Borra Notificacion
*/
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Notificacion.findByIdAndRemove(id, (err, notificacionBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrando notificacion',
                errrors: err
            });
        }
        if (!notificacionBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe una notificacion con ese id',
                errrors: {
                    message: 'No existe una notificacion con ese id'
                }
            });
        }
        res.status(200).json({
            ok: true,
            notificacion: notificacionBorrado
        });
    });
});
module.exports = app;