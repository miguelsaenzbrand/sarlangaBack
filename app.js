var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')

var app = express()

//CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));
// parse application/json
app.use(bodyParser.json());

var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var ticketRoutes = require('./routes/ticket');
var coberturaRoutes = require('./routes/cobertura');
var itemRoutes = require('./routes/item');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');
var activityRoutes = require('./routes/activity');
var notificacionRoutes = require('./routes/notificacion');

app.use('/usuario', usuarioRoutes);
app.use('/item', itemRoutes);
app.use('/ticket', ticketRoutes);
app.use('/cobertura', coberturaRoutes);
app.use('/login', loginRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);
app.use('/activity', activityRoutes);
app.use('/notificacion', notificacionRoutes);
app.use('/', appRoutes);

mongoose.connection.openUri('mongodb://localhost:27017/sugvoDB', (err, res) => {
    if (err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
});

app.listen(3000, () => {
    console.log('Run server on port 3000: \x1b[32m%s\x1b[0m', 'online');
});