const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost', 
  user: 'root',
  password: 'Ultimatexbox16',
  database: 'a9dq91kuumptvfvd'
});

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión a la base de datos exitosa!');
});

module.exports = connection;