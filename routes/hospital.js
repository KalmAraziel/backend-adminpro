var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var mdwAutenticacion = require('../middlewares/autenticacion');
// Iniciar variables
var app = express();

//Exportar Modelo
var Hospital = require('../models/hospital');
//============================
// Obtener todos los Hospitals
//============================
app.get('/', (req, resp, next) => {    
    Hospital.find({})
    .exec(
        (err, hospitales ) => {
            if(err) {
                return resp.status(500).json({       
                    ok: false,
                    mensaje: 'Error cargando Hospitales',
                    errors: err
                });
            }
            // Todo bien 
            resp.status(200).json({       
                ok: true,
                hospitales
            });
        }
    );   
});


//============================
// Crear nuevo Hospital
// segundo parametro verificamos token
//============================
app.post('/', mdwAutenticacion.verificacionToken , (req, resp)  => {
    var body = req.body;
    var hospital = new Hospital({
        nombre: body.nombre,               
        usuario: req.usuario._id
    });

    hospital.save( (err, hospitalGuardado) => {
        if(err) {
            console.log(err);
            return resp.status(400).json({       
                ok: false,
                mensaje: 'Error al crear Hospital',
                errors: err
            });
        }
        // Creado correctamente
        resp.status(201).json({       
            ok: true,
            hospital: hospitalGuardado            
        });
    });    
});
//============================
// Actualizar Hospital
//============================
app.put('/:id',  mdwAutenticacion.verificacionToken ,(req, resp) => {
    var id = req.params.id;
    var body = req.body;
    Hospital.findById(id, (err, hospital) => {
        if (err) { 
            return resp.status(500).json({
                ok: false,
                mensaje: 'Error al buscar Hospital',
                errors: err
            });
        }

        if ( !hospital ) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'El hospital con el id ' + id + 'no existe',
                errors: { message: 'No existe un Hospital con ese ID' }
            });
        }
        
        hospital.nombre = body.nombre;        
        hospital.usuario = req.usuario._id;
        hospital.save((err, hospitalGuardado)=>{
            if (err) {
                return resp.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar Hospital',
                    errors: err
                });
            }
            // actualiza Hospital   

            resp.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });
        });
    });
});
//============================
// Eliminar Hospital
//============================
app.delete('/:id', mdwAutenticacion.verificacionToken, (req, resp) => {
    // parametro por url
    var id = req.params.id;
    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {
        
        if (err) {
            console.log(err);
            return resp.status(500).json({
                ok: false,
                mensaje: 'Error al borrar Hospital',
                errors: err
            });
        }

        if (!hospitalBorrado) {
            console.log(err);
            return resp.status(400).json({  
                ok: false,
                mensaje: 'No existe un Hospital con ese ID',
                errors: {
                    message: 'No existe un Hospital con ese ID'
                }
            });
        }

        // Creado correctamente
        resp.status(200).json({
            ok: true,
            Hospital: hospitalBorrado
        });
    });
});

module.exports = app;