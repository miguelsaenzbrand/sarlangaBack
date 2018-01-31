var express = require('express');

var mdAutenticacion = require('../middelwares/autenticacion');
var Cobertura = require('../models/cobertura');

var app = express();

/*
Obtiene todos los coberturas
*/
app.get('/', mdAutenticacion.verificaToken, (req, res) => {
    Cobertura.find({})
        .populate('usuario', 'nombre email img')
        .populate('conductor', 'nombre email img')
        .populate('camarografo', 'nombre email img')
        .populate('productor', 'nombre email img')
        .populate('redactor', 'nombre email img')
        .exec(
        (err, coberturas) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando Coberturas',
                    errrors: err
                });
            }
            Cobertura.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    coberturas: coberturas,
                    total: conteo
                });
            });
        });
});

/*
 * Retorna una cobertura
 */
app.get('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Cobertura.findById(id)
        .populate('usuario', 'nombre email img')
        .populate('conductor', 'nombre email img')
        .populate('camarografo', 'nombre email img')
        .populate('productor', 'nombre email img')
        .populate('redactor', 'nombre email img')
        .exec(
        (err, cobertura) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar el Cobertura',
                    errrors: err
                });
            }
            if (!cobertura) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error cobertura con el id ' + id + ' no existe',
                    errrors: {
                        message: 'No existe un cobertura con el ID ingresado'
                    }
                });
            }
            res.status(200).json({
                ok: true,
                cobertura: cobertura
            });
        });
});

/*
 * Crea cobertura
 */
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var fecha = Date.now();

    var cobertura = new Cobertura({
        descripcion: body.descripcion,
        direccion: body.direccion,
        title: body.title,
        start: body.start,
        end: body.end,
        creada: fecha,
        movilidad: body.movilidad,
        conductor: body.conductor,
        camara: body.camara,
        camarografo: body.camarografo,
        productores: body.productores,
        productor: body.productor,
        redactores: body.redactores,
        redactor: body.redactor,
        fotografia: body.fotografia,
        insumos: body.insumos,
        className: body.className,
        usuario: req.usuario._id
    });

    cobertura.save((err, coberturaGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error cargando Coberturas',
                errrors: err
            });
        }
        res.status(201).json({
            ok: true,
            cobertura: coberturaGuardado
        });
    });
});

/*
 * Actualiza cobertura
 */
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Cobertura.findById(id, (err, cobertura) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar cobertura',
                errrors: err
            });
        }
        if (!cobertura) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El cobertura con el id ' + id + ' no existe',
                errrors: {
                    message: 'No existe un cobertura con ese id'
                }
            });
        }

        cobertura.descripcion = body.descripcion,
            cobertura.direccion = body.direccion,
            cobertura.title = body.title,
            cobertura.start = body.start,
            cobertura.end = body.end,
            cobertura.movilidad = body.movilidad,
            cobertura.conductor = body.conductor,
            cobertura.camara = body.camara,
            cobertura.camarografo = body.camarografo,
            cobertura.productores = body.productores,
            cobertura.productor = body.productor,
            cobertura.redactores = body.redactores,
            cobertura.redactor = body.redactor,
            cobertura.fotografia = body.fotografia,
            cobertura.insumos = body.insumos,
            cobertura.className = body.className,
            cobertura.usuario = req.usuario._id

        cobertura.save((err, coberturaGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error actualizando cobertura',
                    errrors: err
                });
            }
            coberturaGuardado.password = '=)';
            res.status(200).json({
                ok: true,
                cobertura: coberturaGuardado
            });
        });
    });
});

/*
 * Borra Cobertura
 */
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Cobertura.findByIdAndRemove(id, (err, coberturaBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrando cobertura',
                errrors: err
            });
        }
        if (!coberturaBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un cobertura con ese id',
                errrors: {
                    message: 'No existe un cobertura con ese id'
                }
            });
        }
        res.status(200).json({
            ok: true,
            cobertura: coberturaBorrado
        });
    });
});
module.exports = app;