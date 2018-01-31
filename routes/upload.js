var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

var Usuario = require('../models/usuario');
var Item = require('../models/item');

app.use(fileUpload());

app.put('/:tipo/:id', function (req, res) {
    var tipo = req.params.tipo;
    var id = req.params.id;
    //Tipo de colecciones validos
    var tiposValidos = ['usuarios', 'items'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no válida',
            errrors: {
                message: {
                    message: 'Tipo de colección no válida'
                }
            }
        });
    }
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No seleccionó nada',
            errrors: {
                message: 'Debe seleccionar una imagen'
            }
        });
    }
    //Obtengo el nombre del archivo
    var archivo = req.files.imagen;
    var nombreArchivoSplit = archivo.name.split('.');
    var extensionArchivo = nombreArchivoSplit[nombreArchivoSplit.length - 1];
    //Extensiones válidas
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extensión no permitida',
            errrors: {
                message: 'Debe seleccionar un archivo con extensión png, jpg, gif o jpeg'
            }
        });
    }
    //Nombre archivo personalizado
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    //Mover el arhcivo a un path
    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errrors: err
            });
        }
        subirPorTipo(tipo, id, nombreArchivo, res);
    });
});

function subirPorTipo(tipo, id, nombreArchivo, res) {
    if (tipo == 'usuarios') {
        Usuario.findById(id, (err, usuario) => {
            if (!usuario) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El usuario no existe',
                    errrors: {
                        message: 'El usuario no existe'
                    }
                });
            }
            var pathViejo = './uploads/usuarios/' + usuario.img;
            //si existe la imagen la elimina
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }
            usuario.img = nombreArchivo;
            usuario.save((err, usuarioActualizado) => {
                usuarioActualizado.password = '=)';
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error guardando imagen',
                        errrors: err
                    });
                }
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                });
            });
        });
    }
    if (tipo == 'items') {
        Item.findById(id, (err, item) => {
            if (!item) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El item no existe',
                    errrors: {
                        message: 'El item no existe'
                    }
                });
            }
            var pathViejo = './uploads/items/' + item.img;
            //si existe la imagen la elimina
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }
            item.img = nombreArchivo;
            item.save((err, itemActualizado) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error guardando imagen',
                        errrors: err
                    });
                }
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de item actualizada',
                    item: itemActualizado
                });
            });
        });
    }
}
module.exports = app;