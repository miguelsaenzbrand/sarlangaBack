var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

/*
Verificar Token
*/
exports.verificaToken = function (req, res, next) {
    var token = req.query.token;
    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token inválido',
                errrors: err
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
};

/*
* Verificar Administrador
*/
exports.verificaRole = function (req, res, next) {
    var usuario = req.usuario;
    if (usuario.role === 'ADMIN_ROLE') {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            mensaje: 'Token incorrecto',
            errrors: { message: 'No es administrador, no puede hacer eso' }
        });
    }
};

/*
* Verificar Admin o mismo Usuario
*/
exports.verificaAdminOmismoUsuario = function (req, res, next) {
    var usuario = req.usuario;
    var id = req.params.id;

    if (usuario.role === 'ADMIN_ROLE' || usuario._id === id) {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            mensaje: 'Token incorrecto',
            errrors: { message: 'No es administrador, no puede hacer eso' }
        });
    }
};