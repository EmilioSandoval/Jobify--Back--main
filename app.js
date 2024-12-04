const express = require('express');
const morgan = require('morgan');
const mysql = require('mysql');
const myConnection = require('express-myconnection');
const cors = require('cors');
const routes = require('./routes/routes');

const app = express();

// SETTINGS
app.set('port', process.env.PORT || 5000);

// MIDDLEWARES
app.use(morgan('dev'));
app.use(myConnection(mysql, {
    host: 'localhost',
    user: 'root',
    password: 'Ultimatexbox16',
    port: 3306,
    database: 'a9dq91kuumptvfvd',
}, 'single'));
app.use(express.json());
app.use(cors());

// ROUTES
app.use('/api', routes);

// START SERVER
app.listen(app.get('port'), () => {
    console.log(`Se corrio de manera correcta en el servidor 5000 ${app.get('port')}`);
});
