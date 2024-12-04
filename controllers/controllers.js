const controller = {};

var empleadorEmail;
var empleadorEmpresa;
var password;
var empresaName; 
var address;
var razonSocial;
var description;
var date;

var userEmail;
var userPassword;
var userName;
var userLastName;
var userBirthday;
var userAge;
var userAddress;
var phoneNumber;
var userRegisterDate;

var adminUser;
var adminPassword;

// Importa las funciones de los modelos
const UserEmpleador = require('./servers/userEmpleador'); 
const UserNormal = require('./servers/userNormal'); 
const Vacantes = require('./servers/vacantes'); 
const Postulaciones = require('./servers/postulaciones'); 

controller.index = (req, res) => {
    res.render('index', {});
}

// USER EMPLEADOR

controller.empleadorRegisterPage = (req, res) => {
    res.render('empleadorRegister', {});
}

controller.empleadorRegister = (req, res) => {
    const data = req.body;

    UserEmpleador.findByEmail(data.email, (err, empleadorEmail) => {
        if (err) {
            console.log(err);
            // Manejo de errores
        }

        if (empleadorEmail.length > 0) { 
            res.render('empleadorRegister', { existentUser: true });
        } else {
            UserEmpleador.create(data, (err, result) => {
                if (err) {
                    console.log(err);
                    // Manejo de errores
                }
                res.render('empleadorLogin', { successRegister: true });
            });
        }
    });
}

controller.empleadorLoginPage = (req, res) => {
    res.render('empleadorLogin')
}

controller.empleadorLogin = (req, res) => {
    const data = req.body;
    let loginExitoso = false;
    let empleadorFound = false;

    UserEmpleador.findAll((err, empleadorCredentials) => {
        if (err) {
            console.log(err);
            // Manejo de errores
        }

        for (var i = 0; i < empleadorCredentials.length; i++) {
            if (data.email == empleadorCredentials[i].correo && data.password == empleadorCredentials[i].contrasena) {
                empleadorEmail = data.email;
                empleadorEmpresa = empleadorCredentials;
                loginExitoso = true;
                empleadorFound = true;
                break; 
            };
        };
        
        if (empleadorFound) {
            res.redirect('/empleador-auth');
        } else {
            res.render('empleadorLogin', { loginExitoso: loginExitoso });
        }

    });
}

controller.empleadorAuth = (req, res) => {
    Vacantes.findByEmail(empleadorEmail, (err, data) => {
        if (err) {
            console.error("Error al obtener vacantes:", err);
            // Manejo de errores
        }
        res.render('empleadorAuth', { data });
    });

    UserEmpleador.findByEmail(empleadorEmail, (err, empresa) => {
        if (err) {
            console.error("Error al obtener datos de la empresa:", err);
            // Manejo de errores
        }
        empleadorEmpresa = empresa[0].nombreEmpresa;
    });
}

controller.empleadorMyAccount = (req, res) => {
    UserEmpleador.findByEmail(empleadorEmail, (err, accountInfo) => {
        if (err) {
            console.log(err);
            // Manejo de errores
        }

        if (!accountInfo || !accountInfo[0]) {
            console.log('Datos no encontrado');
            // Manejo de errores
        }

        password = accountInfo[0].contrasena;
        empresaName = accountInfo[0].nombreEmpresa;
        address = accountInfo[0].domicilio;
        razonSocial = accountInfo[0].razonSocial;
        description = accountInfo[0].descripcion;
        date = accountInfo[0].fechaRegistro;  

        res.render('empleadorMyAccount', { empleadorEmail, password, empresaName, address, razonSocial, description, date });
    });
}

controller.empleadorUpdateAccount = (req, res) => {
    const data = req.body;

    UserEmpleador.update(data, data.email, (err, result) => {
        if (err) {
            console.log(err);
            // Manejo de errores
        }
        res.redirect('/empleador-mi-perfil');
    });
}

controller.empleadorDeleteAccount = (req, res) => {
    UserEmpleador.delete(empleadorEmail, (err, result) => {
        if (err) {
            console.log(err);
            // Manejo de errores
        }
        res.redirect('/');
    });
}

controller.empleadorInbox = (req, res) => {
    Postulaciones.findByEmpresa(empleadorEmpresa, (err, data) => { 
        if (err) {
            console.error("Error al obtener postulaciones:", err);
            // Manejo de errores
        }
        res.render('empleadorInbox', { data });
    });
}

controller.empleadorDeleteInbox = (req, res) => {
    const inboxId = req.params.inboxId

    Postulaciones.delete(inboxId, (err, result) => {
        if (err) {
            console.error("Error al eliminar la postulación:", err);
            // Manejo de errores
        }
        // ...
    });
}

controller.postJobPage = (req, res) => {
    res.render('postJob', {});
}

controller.postJob = async (req, res) => {
    const data = req.body;
    const file = req.files;

    try {
        if (!file || Object.keys(file).length === 0) { 
            return res.status(400).json({ message: 'No se ha seleccionado ningún archivo.' });
        } else {
            const uploadedFile = file.multimedia;
            const fileName = data.title + '_' + Date.now() + '.' + uploadedFile.name.split('.').pop();

            uploadedFile.mv('./src/public/uploads/' + fileName, (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Error al mover el archivo.' });
                }

                const vacanteData = {
                    ...data,
                    correo: empleadorEmail,
                    empresa: empleadorEmpresa,
                    capacitacion: fileName
                };

                Vacantes.create(vacanteData, (err, result) => {
                    if (err) {
                        console.error("Error al crear la vacante:", err);
                        // Manejo de errores
                    }
                    res.redirect('/empleador-auth');
                });
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

controller.deleteJob = (req, res) => {
    const vacanteId = req.params.vacanteId

    Vacantes.delete(vacanteId, (err, result) => {
        if (err) {
            console.error("Error al eliminar la vacante:", err);
            // Manejo de errores
        }
        // ...
    });
}

controller.updateJob = ((req, res) => {
    const data = req.body

    Vacantes.update(data, data.accountId, (err, result) => {
        if (err) {
            console.error("Error al actualizar la vacante:", err);
            // Manejo de errores
        }
        res.redirect('/empleador-auth');
    });
});

// USER NORMAL
controller.userRegisterPage = (req, res) => {
    res.render('userRegister', {});
}

controller.userRegister = (req, res) => {
    const data = req.body;

    UserNormal.findByEmail(data.email, (err, userEmail) => {
        if (err) {
            console.log(err);
            // Manejo de errores
        }

        if (userEmail.length > 0) { 
            res.render('userRegister', { existentUser: true });
        } else {
            UserNormal.create(data, (err, result) => {
                if (err) {
                    console.log(err);
                    // Manejo de errores
                }
                res.render('userLogin', { successRegister: true });
            });
        }
    });
}

controller.userLoginPage = (req, res) => {
    res.render('userLogin')
}

controller.userLogin = (req, res) => {
    const data = req.body;
    let loginExitoso = false;
    let userFound = false;
    
    UserNormal.findAll((err, userCredentials) => {
        if (err) {
            console.log(err);
            // Manejo de errores
        }

        for (var i = 0; i < userCredentials.length; i++) {
            if (data.email == userCredentials[i].correo && data.password == userCredentials[i].contrasena) {
                userEmail = data.email;
                loginExitoso = true;
                userFound = true;
                break; 
            }
        }
        
        if (userFound) {
            res.redirect('/usuario-auth');
        } else {
            res.render('userLogin', { loginExitoso: loginExitoso });
        }
    });
}

controller.userAuth = (req, res) => {
    Vacantes.findAll((err, data) => {
        if (err) {
            console.error("Error al obtener vacantes:", err);
            // Manejo de errores
        }
        res.render('userAuth', { data });
    });
}

controller.userMyAccount = (req, res) => {
    UserNormal.findByEmail(userEmail, (err, accountInfo) => {
        if (err) {
            console.log(err);
            // Manejo de errores
        }

        if (!accountInfo || !accountInfo[0]) {
            console.log('Datos no encontrado');
            // Manejo de errores
        }

        userPassword = accountInfo[0].contrasena;
        userName = accountInfo[0].nombre;
        userLastName= accountInfo[0].apellidos;
        userBirthday = accountInfo[0].fechaNacimiento;
        userAge = accountInfo[0].edad;
        userAddress = accountInfo[0].domicilio;  
        phoneNumber = accountInfo[0].numTelefono;   
        userRegisterDate = accountInfo[0].fechaRegistro;   

        res.render('userMyAccount', {userEmail, userPassword, userName, userLastName, userBirthday, userAge, userAddress, phoneNumber, userRegisterDate});
    });
}

controller.userUpdateAccount = (req, res) => {
    const data = req.body;

    UserNormal.update(data, data.email, (err, result) => {
        if (err) {
            console.log(err);
            // Manejo de errores
        }
        res.redirect('/usuario-mi-perfil');
    });
}

controller.userApplies = (req, res) => {
    // ... (código para obtener las postulaciones del usuario) ...
}

controller.userApplyJob = (req, res) => {
    const vacanteId = req.params.vacanteId;
    const empresa = req.params.empresa;

    UserNormal.findByEmail(userEmail, (err, userData) => {
        if (err) {
            console.error("Error al obtener datos del usuario:", err);
            // Manejo de errores
        }

        const postulacionData = {
            titulo: vacanteId,
            nombre: userData[0].nombre,
            apellidos: userData[0].apellidos,
            fechaNacimiento: userData[0].fechaNacimiento,
            edad: userData[0].edad,
            domicilio: userData[0].domicilio,
            numTelefono: userData[0].numTelefono,
            correo: userEmail,
            nombreEmpresa: empresa
        };

        Postulaciones.create(postulacionData, (err, result) => {
            if (err) {
                console.error("Error al crear la postulación:", err);
                // Manejo de errores
            }
            // ... 
        });
    });

    Vacantes.findById(vacanteId, (err, data) => {
        if (err) {
            console.error("Error al obtener datos de la vacante:", err);
            // Manejo de errores
        }

        const userPostulacionData = {
            titulo: vacanteId,
            salario: data[0].salario,
            horario: data[0].horario,
            requisitos: data[0].requisitos,
            descripcion: data[0].descripcion,
            empresa: data[0].empresa,
            correo: userEmail
        };

        // ... (código para guardar la postulación en la tabla userPostulaciones) ...
    });
}

controller.userDeleteApply = (req, res) => {
    const applyTitle = req.params.applyTitle

    // ... (código para eliminar la postulación) ...
}

// USER ADMIN
controller.adminLoginPage = (req, res) => {
    res.render('adminLogin');
}

controller.adminLogin = (req, res) => {
    // ... (código para loguear al admin) ...
}

controller.adminAuth = (req, res) => {
    UserNormal.findAll((err, data) => {
        if (err) {
            console.error("Error al obtener usuarios:", err);
            // Manejo de errores
        }
        res.render('adminAuth', { data });
    });
}

controller.adminDeleteUser = (req, res) => {
    const cuentaId = req.params.cuentaId

    UserNormal.delete(cuentaId, (err, result) => {
        if (err) {
            console.error("Error al eliminar el usuario:", err);
            // Manejo de errores
        }
        res.redirect('/admin-auth');
    });
}

controller.adminEditUser = (req, res) => {
    const data = req.body;
    // ... (código para editar usuario) ...
}

controller.adminAuthEmpleadores = (req, res) => {
    UserEmpleador.findAll((err, data) => {
        if (err) {
            console.error("Error al obtener empleadores:", err);
            // Manejo de errores
        }
        res.render('adminAuthEmpleadores', { data });
    });    
}

controller.adminDeleteEmpleador = (req, res) => {
    const cuentaId = req.params.cuentaId
    
    UserEmpleador.delete(cuentaId, (err, result) => {
        if (err) {
            console.error("Error al eliminar el empleador:", err);
            // Manejo de errores
        }
        res.redirect('/admin-auth-empleadores');
    });    
}

controller.adminEditEmpleador = (req, res) => {
    const data = req.body;
    // ... (código para editar empleador) ...
}

module.exports = controller;