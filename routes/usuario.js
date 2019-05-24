var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var mdwAutenticacion = require('../middlewares/autenticacion');
// Iniciar variables
var app = express();

//Exportar Modelo
var Usuario = require('../models/usuario');
//============================
// Obtener todos los usuarios
//============================
app.get('/', (req, resp, next) => {
    
    var desde = req.query.desde || 0;
    desde = Number(desde);
    // llamada select nombre email img role from table; 
    Usuario.find({}, 'nombre email img role')
    .skip(desde)
    .limit(5)
    .exec(
        (err, usuarios ) => {
            if(err) {
                return resp.status(500).json({       
                    ok: false,
                    mensaje: 'Error cargando usuarios',
                    errors: err
                });
            }
            // total registros
            Usuario.count({}, (err, count)=> {
                // Todo bien 
                resp.status(200).json({       
                    ok: true,
                    total: count,
                    usuarios
                    
                });
            });
            
        }
    );   
});


//============================
// Crear nuevo usuario
// segundo parametro verificamos token
//============================
app.post('/', mdwAutenticacion.verificacionToken , (req, resp)  => {
    var body = req.body;
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save( (err, usuarioGuardado) => {
        if(err) {
            console.log(err);
            return resp.status(400).json({       
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }
        // Creado correctamente


        resp.status(201).json({       
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario
        });
    });    
});
//============================
// Actualizar usuario
//============================
app.put('/:id',  mdwAutenticacion.verificacionToken ,(req, resp) => {
    var id = req.params.id;
    var body = req.body;
    Usuario.findById(id, (err, usuario) => {
        if (err) { 
            return resp.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if ( !usuario ) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id ' + id + 'no existe',
                errors: { message: 'No existe un usuario con ese ID' }
            });
        }
        
        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado)=>{
            if (err) {
                return resp.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }
            usuarioGuardado.password = ":)";
            // actualiza usuario   

            resp.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });
        });
    });
});
//============================
// Eliminar usuario
//============================
app.delete('/:id', mdwAutenticacion.verificacionToken, (req, resp) => {
    // parametro por url
    var id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        
        if (err) {
            console.log(err);
            return resp.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            });
        }

        if (!usuarioBorrado) {
            console.log(err);
            return resp.status(400).json({  
                ok: false,
                mensaje: 'No existe un usuario con ese ID',
                errors: {
                    message: 'No existe un usuario con ese ID'
                }
            });
        }

        // Creado correctamente
        resp.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});

module.exports = app;