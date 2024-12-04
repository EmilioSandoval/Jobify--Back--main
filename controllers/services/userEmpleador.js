const connection = require('./database');

const UserEmpleador = {
    create: (data, callback) => {
        connection.query('INSERT INTO userEmpleador SET ?', data, callback);
    },

    findByEmail: (email, callback) => {
        connection.query('SELECT * FROM userEmpleador WHERE correo = ?', [email], callback);
    },

    findAll: (callback) => {
        connection.query('SELECT * FROM userEmpleador', callback);
    },

    update: (data, email, callback) => {
        connection.query('UPDATE userEmpleador SET ? WHERE correo = ?', [data, email], callback);
    },

    delete: (email, callback) => {
        connection.query('DELETE FROM userEmpleador WHERE correo = ?', [email], callback);
    },

    findById: (id, callback) => {
        connection.query('SELECT * FROM userEmpleador WHERE id = ?', [id], callback);
    }
};

module.exports = UserEmpleador;