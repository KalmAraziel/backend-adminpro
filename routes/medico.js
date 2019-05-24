var express = require('express');
var mdwAutenticacion = require('../middlewares/autenticacion');
// Iniciar variables
var app = express();
//Exportar Modelo
var Medico = require('../models/medico');

//============================
// Obtener todos los Medicos
//============================
app.get('/', (req, resp, next) => {    
    var desde = req.query.desde || 0;
    desde = Number(desde);    
    Medico.find({})
    .skip(desde)
    .limit(5)
    .populate('usuario', 'nombre email')
    .populate('hospital', 'nombre')
    .exec(
        (err, medicos ) => {
            if(err) {
                return resp.status(500).json({       
                    ok: false,
                    mensaje: 'Error cargando Medicos',
                    errors: err
                });
            }
            // Todo bien
            Medico.count({}, (err, count) => {
                resp.status(200).json({       
                    ok: true,
                    total: count,
                    medicos
                });
            });
            
        }
    );   
});


//============================
// Crear nuevo Medico
// segundo parametro verificamos token
//============================
app.post('/', mdwAutenticacion.verificacionToken , (req, resp)  => {
    var body = req.body;
    var medico = new Medico({
        nombre   : body.nombre,               
        usuario  : req.usuario._id,       
        hospital :  body.hospital
    });

    medico.save( (err, medicoGuardado) => {
        if(err) {
            console.log(err);
            return resp.status(400).json({       
                ok: false,
                mensaje: 'Error al crear Medico',
                errors: err
            });
        }
        // Creado correctamente
        resp.status(201).json({       
            ok: true,
            medico: medicoGuardado            
        });
    });    
});
//============================
// Actualizar Medico
//============================
app.put('/:id',  mdwAutenticacion.verificacionToken ,(req, resp) => {
    var id = req.params.id;
    var body = req.body;
    Medico.findById(id, (err, medico) => {
        if (err) { 
            return resp.status(500).json({
                ok: false,
                mensaje: 'Error al buscar Medico',
                errors: err
            });
        }

        if ( !medico ) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'El medico con el id ' + id + 'no existe',
                errors: { message: 'No existe un Medico con ese ID' }
            });
        }
        
        medico.nombre = body.nombre;        
        medico.usuario = req.usuario._id;
        medico.hospital =  body.hospital;

        medico.save((err, medicoGuardado)=>{
            if (err) {
                return resp.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar Medico',
                    errors: err
                });
            }
            // actualiza Medico   
            resp.status(200).json({
                ok: true,
                medico: medicoGuardado
            });
        });
    });
});
//============================
// Eliminar Medico
//============================
app.delete('/:id', mdwAutenticacion.verificacionToken, (req, resp) => {
    // parametro por url
    var id = req.params.id;
    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
        
        if (err) {
            console.log(err);
            return resp.status(500).json({
                ok: false,
                mensaje: 'Error al borrar Medico',
                errors: err
            });
        }

        if (!medicoBorrado) {
            console.log(err);
            return resp.status(400).json({  
                ok: false,
                mensaje: 'No existe un Medico con ese ID',
                errors: {
                    message: 'No existe un Medico con ese ID'
                }
            });
        }

        // Creado correctamente
        resp.status(200).json({
            ok: true,
            Medico: medicoBorrado
        });
    });
});

module.exports = app;