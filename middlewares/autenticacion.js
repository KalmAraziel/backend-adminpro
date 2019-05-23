
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

//============================
// Verificar Token
//============================
exports.verificacionToken = (req, res, next) => {
    var token = req.query.token;
    jwt.verify(token , SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({       
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }
        // next();

        return res.status(401).json({       
            ok: false,
            mensaje: 'Token incorrecto',
            decoded: decoded
        });
    });
};
