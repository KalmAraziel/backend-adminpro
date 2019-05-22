var express = require('express');
// Iniciar variables
var app = express();

app.get('/', (req, resp, next) => {
    resp.status(200).json({       
        ok: true,
        mensaje: 'Peticion Realizada Correctamente'
    });
});


module.exports = app;