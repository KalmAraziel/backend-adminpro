// Required librerias 
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Iniciar variables
var app = express();

// BodyParser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());



// Importar Rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenRoutes = require('./routes/imagenes');
// Conexion a BD
mongoose.connect('mongodb://localhost:27017/hospitalDB', {useNewUrlParser: true},
    (err, res) => {
        if (err) throw err;
        console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
    }
);

//Server index config
/* Para poder navedar www.asd.com/uploads y ver imagenes
var serveIndex = require("serve-index");
app.use(express.static(__dirname + "/"));
app.use("/uploads", serveIndex(__dirname + "/uploads"));
*/

//Rutas
// url "/' se mapea a appRoutes
app.use('/usuario', usuarioRoutes); 
app.use('/login', loginRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use("/img", imagenRoutes);
app.use('/', appRoutes);


// Escuchar Peticiones

app.listen(3000, () => {
    console.log('Express corriendo en puerto 3000: \x1b[32m%s\x1b[0m',' online ');
});