const connection = require('./database');

const Vacantes = {
    create: (data, callback) => {
        connection.query('INSERT INTO vacantes SET ?', data, callback);
    },

    findById: (id, callback) => {
        connection.query('SELECT * FROM vacantes WHERE id = ?', [id], callback);
    },

    findByEmail: (email, callback) => {
        connection.query('SELECT * FROM vacantes WHERE correo = ?', [email], callback);
    },

    findAll: (callback) => {
        connection.query('SELECT * FROM vacantes', callback);
    },

    update: (data, id, callback) => {
        connection.query('UPDATE vacantes SET ? WHERE id = ?', [data, id], callback);
    },

    delete: (id, callback) => {
        connection.query('DELETE FROM vacantes WHERE id = ?', [id], callback);
    }
};

module.exports = Vacantes;