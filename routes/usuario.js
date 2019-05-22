var express = require('express');

// Iniciar variables
var app = express();

//Exportar Modelo
var Usuario = require('../models/usuario');
//============================
// Obtener todos los usuarios
//============================
app.get('/', (req, resp, next) => {
    // llamada select nombre email img role from table; 
    Usuario.find({}, 'nombre email img role')
    .exec(
        (err, usuarios ) => {
            if(err) {
                return resp.status(500).json({       
                    ok: false,
                    mensaje: 'Error cargando usuarios',
                    errors: err
                });
            } 
            // Todo bien 
            resp.status(200).json({       
                ok: true,
                usuarios
            });
        }
    );   
});
//============================
// Crear nuevo usuario
//============================
app.post('/',  (req, resp)  => {
    var body = req.body;
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: body.password,
        img: body.img,
        role: body.role
    });
    console.log(usuario);
    usuario.save( (err, usuarioGuardado) => {
        if(err) {
            console.log(err);
            return resp.status(500).json({       
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }
        // Creado correctamente
        resp.status(201).json({       
            ok: true,
            usuario: usuarioGuardado
        });

    });    
});

module.exports = app;