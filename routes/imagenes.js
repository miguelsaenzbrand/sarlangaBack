var express = require('express');
var fs = require('fs');
var path = require('path');

var app = express();

app.get('/:tipo/:img', (req, res, next) => {
    var tipo = req.params.tipo;
    var img = req.params.img;
    var routeImage = `./uploads/${tipo}/${img}`;
    var imagenDefecto = `./assets/no-img.jpg`;
    fs.exists(routeImage, function (exists) {
        if (exists) {
            res.sendFile(path.resolve(routeImage))
        } else {
            res.sendFile(path.resolve(imagenDefecto))
        }
    });
});

module.exports = app;