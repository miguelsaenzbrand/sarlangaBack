var express = require('express');
var Usuario = require('../models/usuario');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middelwares/autenticacion');

var app = express();

/*
Obtiene todos los usuarios
*/
app.get('/', mdAutenticacion.verificaToken, (req, res) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    if (desde == 1104) {
        Usuario.find({}, 'nombre email img role google')
            .exec(
            (err, usuarios) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando Usuarios',
                        errors: err
                    });
                }
                Usuario.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        usuarios: usuarios,
                        total: conteo
                    });
                });
            });
    } else {
        Usuario.find({}, 'nombre email img role google')
            .skip(desde)
            .limit(5)
            .exec(
            (err, usuarios) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando Usuarios',
                        errors: err
                    });
                }
                Usuario.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        usuarios: usuarios,
                        total: conteo
                    });
                });
            });
    }
});

/*
Obtiene un usuario
*/
app.get('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Usuario.findById(id)
        .populate('usuario', 'nombre img email')
        .exec(
        (err, usuario) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar el Usuario',
                    errors: err
                });
            }
            if (!usuario) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error usuario con el id' + id + 'no existe',
                    errors: {
                        message: 'No existe un usuario con el ID ingresado'
                    }
                });
            }
            usuario.password = '=)'
            res.status(200).json({
                ok: true,
                usuario: usuario
            });
        });
});

/*
Crea usuario
*/
app.post('/', (req, res) => {
    var body = req.body;
    var fecha = Date.now();

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role,
        telefono: body.telefono,
        direccion: body.direccion,
        area: body.area,
        creado: fecha,
        modificado: fecha
    });
    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error creando Usuario',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario
        });
    });
});

/*
Actualiza usuario
*/
app.put('/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaAdminOmismoUsuario], (req, res) => {
    var id = req.params.id;
    var body = req.body;
    var fecha = Date.now();

    Usuario.findById(id, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id ' + id + ' no existe',
                errors: {
                    message: 'No existe un usuario con ese id'
                }
            });
        }
        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;
        usuario.telefono = body.telefono;
        usuario.direccion = body.direccion;
        usuario.area = body.area;
        usuario.modificado = fecha;

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error actualizando usuario',
                    errors: err
                });
            }
            usuarioGuardado.password = '=)'
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });
        });
    });
});
/*
 * Borra Usuario
 */
app.delete('/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaRole], (req, res) => {
    var id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrando usuario',
                errors: err
            });
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con ese id',
                errors: {
                    message: 'No existe un usuario con ese id'
                }
            });
        }
        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});
module.exports = app;