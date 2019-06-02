var express = require("express");
var fileUpload = require("express-fileupload");
var fileSystem = require("fs");
// Iniciar variables
var app = express();

// default options fileUpload
app.use(fileUpload());

// Modelos
var Hospital = require("../models/hospital");
var Medico = require("../models/medico");
var Usuario = require("../models/usuario");

app.put("/:tipo/:id", (req, resp, next) => {
  var tipo = req.params.tipo;
  var id = req.params.id;

  //tipos de coleccion
  var tiposValidos = ["hospitales", "medicos", "usuarios"];
  
  if (tiposValidos.indexOf(tipo) < 0) {
    resp.status(400).json({
      ok: false,
      mensaje: "Formato no valido",
      errors: {
        message: "Debe selecionar un tipo valido "
      }
    });
  }

  if (!req.files) {
    resp.status(400).json({
      ok: false,
      mensaje: "No selecciono imagen",
      errors: { message: "Debe selecionar una imagen" }
    });
  }
  // obtener nombre del archivo
  var archivo = req.files.imagen;
  var nombreArchivoCortado = archivo.name.split(".");
  //ultima posicion
  var extencionArchivo = nombreArchivoCortado[nombreArchivoCortado.length - 1];
  console.log("extencionArchivo: ", extencionArchivo);
  // solo estas extensiones son aceptadas
  var extensionesValidas = ["png", "jpg", "gif", "jpg"];
  if (extensionesValidas.indexOf(extencionArchivo) < 0) {
    resp.status(400).json({
      ok: false,
      mensaje: "Formato no valido",
      errors: {
        message: "Debe selecionar un formato valido png, jpg, gif, jpg"
      }
    });
  }
  // nombre archivo personalizado id + num random
  var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extencionArchivo}`;
  // Mover archivo a uploads
  var path = `./uploads/${tipo}/${nombreArchivo}`;

  archivo.mv(path, err => {
    if (err) {
      resp.status(500).json({
        ok: false,
        mensaje: "Error al mover archivo",
        errors: err
      });
    }
    subirPorTipo(tipo, id, nombreArchivo, resp);
    /*
        resp.status(200).json({
            ok: true,
            mensaje: 'Peticion Realizada Correctamente - upload ' + nombreArchivo
        });
        */
  });
});

function subirPorTipo(tipo, id, nombreArchivo, res) {
  if (tipo === "usuarios") {
    Usuario.findById(id, (err, usuarioBd) => {
      if (usuarioBd.id !== null) {
        var pathAnterior = "./uploads/usuarios/" + usuarioBd.img;
        console.log("pathAnterior: ", pathAnterior);
        // eliminar imagen anterior
        if (fileSystem.existsSync(pathAnterior)) {
          fileSystem.unlink(pathAnterior, err => {
            if (err) {
              return res.status(500).json({
                ok: false,
                mensaje: "Error al eliminar imagen anterior",
                errors: err
              });
            }
          });
        }
        usuarioBd.img = nombreArchivo;
        usuarioBd.password = ":)";
        usuarioBd.save((err, usuarioActualizado) => {
          if (err) {
            return res.status(500).json({
              ok: false,
              mensaje: "Error al actualizar imagen medico",
              errors: err
            });
          }
          return res.status(200).json({
            ok: true,
            mensaje: "Imagen de usuario actualizada",
            usuario: usuarioActualizado
          });
        });
      } else {
        return res.status(500).json({
          ok: false,
          mensaje: "Error usuario no encontrado",
          errors: err
        });
      }
    });
  }

  if (tipo === "medicos") {
    Medico.findById(id, (err, medicoBd) => {
      if (medicoBd.id !== null) {
        var pathAnterior = "./uploads/medicos/" + medicoBd.img;
        console.log("pathAnterior: ", pathAnterior);
        // eliminar imagen anterior
        if (fileSystem.existsSync(pathAnterior)) {
          fileSystem.unlink(pathAnterior, err => {
            if (err) {
              return res.status(500).json({
                ok: false,
                mensaje: "Error al eliminar imagen anterior",
                errors: err
              });
            }
          });
        }
        medicoBd.img = nombreArchivo;
        medicoBd.save((err, medicoActualizado) => {
          if (err) {
            return res.status(500).json({
              ok: false,
              mensaje: "Error al actualizar imagen medico",
              errors: err
            });
          }
          return res.status(200).json({
            ok: true,
            mensaje: "Imagen de medico actualizada",
            medico: medicoActualizado
          });
        });
      } else {
        return res.status(500).json({
          ok: false,
          mensaje: "No se encontro al medico",
          errors: err
        });
      }
      
    });
  }

  if (tipo === "hospitales") {
    Hospital.findById(id, (err, hospitalBd) => {
      if (hospitalBd.id !== null) {
        var pathAnterior = "./uploads/hospitales/" + hospitalBd.img;
        console.log("pathAnterior: ", pathAnterior);
        // eliminar imagen anterior
        if (fileSystem.existsSync(pathAnterior)) {
          fileSystem.unlink(pathAnterior, err => {
            if (err) {
              return res.status(500).json({
                ok: false,
                mensaje: "Error al eliminar imagen anterior",
                errors: err
              });
            }
          });
        }
        hospitalBd.img = nombreArchivo;
        hospitalBd.save((err, hospitalActualizado) => {
          if (err) {
            return res.status(500).json({
              ok: false,
              mensaje: "Error al actualizar imagen hospital",
              errors: err
            });
          }
          return res.status(200).json({
            ok: true,
            mensaje: "Imagen de hospital actualizada",
            hospital: hospitalActualizado
          });
        });
      } else {
        return res.status(500).json({
          ok: false,
          mensaje: "No se encontro el hospital",
          errors: err
        });
      }
      
    });
  }
}

module.exports = app;
