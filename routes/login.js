var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;
// Iniciar variables
var app = express();

//Exportar Modelo
var Usuario = require('../models/usuario');
//============================
// 
//============================
app.post('', (req,res) => {
    var body = req.body;
    Usuario.findOne({email: body.email}, (err, usuarioBD) => {
        
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar Usuarios',
                errors: err
            });
        }

        if (!usuarioBD) {
            console.log('email');
            return res.status(400).json({
                ok: false,
                mensaje: 'credenciales incorrectas',
                errors: err
            });
        }

        if ( !bcrypt.compareSync(body.password, usuarioBD.password) ) {
            console.log('password');
            return res.status(400).json({
                ok: false,
                mensaje: 'credenciales incorrectas',
                errors: err
            });
        }
        //Quito password
        usuarioBD.password = ':)';
        // Crear TOKEN
        var token = jwt.sign({ usuario: usuarioBD }, SEED, {expiresIn: 140000});// 4 horas

        res.status(200).json({
            ok: true,
            usuario: usuarioBD,
            id: usuarioBD.id,
            token: token
        });
        
    });
    
});

module.exports = app;