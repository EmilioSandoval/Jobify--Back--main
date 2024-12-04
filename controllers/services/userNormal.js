const connection = require('./database');

const UserNormal = {
    create: (data, callback) => {
        connection.query('INSERT INTO userNormal SET ?', data, callback);
    },

    findByEmail: (email, callback) => {
        connection.query('SELECT * FROM userNormal WHERE correo = ?', [email], callback);
    },

    findAll: (callback) => {
        connection.query('SELECT * FROM userNormal', callback);
    },

    update: (data, email, callback) => {
        connection.query('UPDATE userNormal SET ? WHERE correo = ?', [data, email], callback);
    },

    delete: (id, callback) => { 
        connection.query('DELETE FROM userNormal WHERE id = ?', [id], callback);
    },

    findById: (id, callback) => {
        connection.query('SELECT * FROM userNormal WHERE id = ?', [id], callback);
    }
};

module.exports = UserNormal;