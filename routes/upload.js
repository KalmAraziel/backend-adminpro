var express = require('express');
// Iniciar variables
var app = express();

app.put('/', (req, resp, next) => {
    resp.status(200).json({       
        ok: true,
        mensaje: 'Peticion Realizada Correctamente - upload'
    });
});


module.exports = app;