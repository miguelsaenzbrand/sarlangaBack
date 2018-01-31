var express = require('express');

var mdAutenticacion = require('../middelwares/autenticacion');
var Item = require('../models/item');

var app = express();

/*
Obtiene todos los items
*/
app.get('/', (req, res) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Item.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
        (err, items) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando Items',
                    errrors: err
                });
            }
            Item.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    items: items,
                    total: conteo
                });
            });
        });
});

/*
Obtiene un item
*/
app.get('/:id', (req, res) => {
    var id = req.params.id;

    Item.findById(id)
        .populate('usuario', 'nombre img email')
        .exec(
        (err, item) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar el Item',
                    errrors: err
                });
            }
            if (!item) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error item con el id ' + id + ' no existe',
                    errrors: {
                        message: 'No existe un item con el ID ingresado'
                    }
                });
            }
            res.status(200).json({
                ok: true,
                item: item
            });
        });
});
/*
Crea item
*/
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var fecha = Date.now();

    var item = new Item({
        descripcion: body.descripcion,
        estado: body.estado,
        creado: fecha,
        modificado: fecha,
        marca: body.marca,
        modelo: body.modelo,
        nombre: body.nombre,
        numeroserie: body.numeroserie,
        observaciones: body.observaciones,
        patrimonio: body.patrimonio,
        usuario: req.usuario._id
    });

    item.save((err, itemGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error cargando Items',
                errrors: err
            });
        }
        res.status(201).json({
            ok: true,
            item: itemGuardado
        });
    });
});
/*
Actualiza item
*/
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;
    var fecha = Date.now();

    Item.findById(id, (err, item) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar item',
                errrors: err
            });
        }
        if (!item) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El item con el id ' + id + ' no existe',
                errrors: {
                    message: 'No existe un item con ese id'
                }
            });
        }

        item.descripcion = body.descripcion,
            item.estado = body.estado,
            item.modificado = fecha,
            item.marca = body.marca,
            item.modelo = body.modelo,
            item.nombre = body.nombre,
            item.numeroserie = body.numeroserie,
            item.observaciones = body.observaciones,
            item.patrimonio = body.patrimonio,
            item.usuario = req.usuario._id

        item.save((err, itemGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error actualizando item',
                    errrors: err
                });
            }
            itemGuardado.password = '=)';
            res.status(200).json({
                ok: true,
                item: itemGuardado
            });
        });
    });
});
/*
Borra Item
*/
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Item.findByIdAndRemove(id, (err, itemBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrando item',
                errrors: err
            });
        }
        if (!itemBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un item con ese id',
                errrors: {
                    message: 'No existe un item con ese id'
                }
            });
        }
        res.status(200).json({
            ok: true,
            item: itemBorrado
        });
    });
});
module.exports = app;