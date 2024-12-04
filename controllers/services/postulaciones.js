const connection = require('./database');

const Postulaciones = {
    create: (data, callback) => {
        connection.query('INSERT INTO postulaciones SET ?', data, callback);
    },

    findByEmpresa: (nombreEmpresa, callback) => {
        connection.query('SELECT * FROM postulaciones WHERE nombreEmpresa = ?', [nombreEmpresa], callback);
    },

    delete: (id, callback) => {
        connection.query('DELETE FROM postulaciones WHERE id = ?', [id], callback);
    }
};

module.exports = Postulaciones;