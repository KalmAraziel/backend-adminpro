var express = require('express');
// Iniciar variables
var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

//==============================
// Busqueda Especifica Coleccion
//==============================
app.get('/coleccion/:tabla/:busqueda', ( req, res ) => {
    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regExp = new RegExp(busqueda, 'i');
    var promesa;

    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regExp);
            break;
        case 'medicos':
            promesa = buscarMedicos(busqueda, regExp);
            break;
        case 'hospitales':
            promesa = buscarHospitales(busqueda, regExp);
            break;
        default:
            return res.status(400).json({
                ok: false,
                message: 'Los tipos de busqueda solo son : usuarios, medicos y hospitales',
                error: {message: 'Tipo de tabla/coleccion no valido'}                
            });            
    }
    // [tabla] toma el nombe de lo que tiene esa variable ej: medicos 
    promesa.then( data => {        
        res.status(200 ).json({
            ok: true,
            [tabla]: data            
        });
    });
});

//==============================
// Busqueda General
//==============================
app.get('/todo/:busqueda', (req, resp, next) => {
    // sacar desde url 
    var busqueda = req.params.busqueda;
    var regExp = new RegExp(busqueda, 'i');
    
    // ejecutamos todas las promesas     
    Promise.all([
        buscarHospitales(busqueda,regExp),
        buscarMedicos(busqueda,regExp),
        buscarUsuarios(busqueda,regExp)
    ]).then( respuestas => {
        resp.status(200).json({
            ok: true,
            hospitales: respuestas[0],
            medicos: respuestas[1],
            usuarios: respuestas[2]
        });
    });            
});


function buscarHospitales (busqueda, regex) {
    return new Promise( (resolve, reject) => {        
        Hospital.find( { nombre: regex })
        .populate('usuario', 'nombre email')
        .exec((err, hospitales) => { 
            if (err) {
                reject('Error al cargar Hospitales ' + erro);
            }
            resolve(hospitales);
        });
    });    
}

function buscarMedicos (busqueda, regex) {
    return new Promise( (resolve, reject) => {        
        Medico.find( { nombre: regex })
        .populate('usuario', 'nombre email')
        .populate('hospital', 'nombre')
        .exec( (err, medicos)  => { 
            if (err) {
                reject('Error al cargar Medicos ' + err);
            }
            resolve(medicos);
        });
    });    
}

function buscarUsuarios (busqueda, regex) {
    return new Promise( (resolve, reject) => {        
        Usuario.find({}, 'nombre email role')
        .or([{ 'nombre': regex }, { 'email': regex}])
        .exec( (err, usuarios) => {
            if (err) {
                reject(err);
            }
            resolve(usuarios);
        });
    });
    
}

module.exports = app;