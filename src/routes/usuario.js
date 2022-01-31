const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');
const { isAuthenticated } = require('../helpers/auth');
const nodemailer = require("nodemailer");



///////////INDEX///////////INDEX///////////INDEX///////////INDEX///////////
///////////INDEX///////////INDEX///////////INDEX///////////INDEX///////////
router.get('/', (req, res) => {
    res.render('partials/index');
});
router.get('/about', (req, res) => {
    res.render('partials/about');
});
router.get('/users/logout', isAuthenticated, (req, res) => {
    req.logout();
    res.redirect('/')
});




///////////USUARIO///////////USUARIO///////////USUARIO///////////USUARIO///////////
///////////USUARIO///////////USUARIO///////////USUARIO///////////USUARIO///////////
///////////USUARIO///////////USUARIO///////////USUARIO///////////USUARIO///////////




router.post('/users/ingresar', passport.authenticate('Ingreso', {
    successRedirect: '/menu',
    failureRedirect: '/',
    failureFlash: true,
}));
///////////GUARDAR UN NUEVO USUARIO
router.post('/users/registrar', async(req, res, next) => {
    const errors = [];
    const { tipo, correo, CURP, CVU, RFC, nombre, apellidos, direccion, telefono, lugarNacimiento, edad, licenciatura, maestria, doctorado, especialidad, matricula, password, confirm_password } = req.body;
    if (tipo == null) {
        errors.push({ text: "Colocar un tipo de Usuario" });
    }
    if (licenciatura == null) {
        errors.push({ text: "Colocar al menos al menos la ingeneria" });
    }
    if (password != confirm_password) {
        errors.push({ text: "La contraseña no es igual" });
    }
    if (password.length < 4) {
        errors.push({ text: "colocar una contraseña mayor a 4 digitos" });
    }
    if (errors.length > 0) {
        res.render("users/registrarUsuario", { errors, tipo, correo, CURP, CVU, RFC, nombre, apellidos, direccion, telefono, lugarNacimiento, edad, licenciatura, maestria, doctorado, especialidad, matricula });
    } else {
        const matriculaUser = await User.findOne({ matricula: matricula });
        if (matriculaUser) {
            req.flash('error_msg', 'La matricula ya esta registrado');
            res.redirect('/users/registrar');
        }
        const newUser = new User({ tipo, correo, CURP, CVU, RFC, nombre, apellidos, direccion, telefono, lugarNacimiento, edad, licenciatura, maestria, doctorado, especialidad, matricula, password });
        await newUser.save();
        req.flash('sucess_msg', ' Usuario Registrado exitosamente');
        res.redirect('/');
    }
});





/*
router.post("/envia-correo", async(req, res) => {
    const { correo, nombre, matricula } = req.body

    contentHTML = `
        <h1>  Informacion del usuario </h1>
        <ul>
            <li>  Matricula: ${matricula} </li>
            <li>  Correo: ${correo} </li>
            <li>  Nombre: ${nombre} </li>
        </ul>
        `;
    console.log(contentHTML)
    const transporter = nodemailer.createTransport({
        host: "gmail.com",
        port: 26,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "eduardotzitzihuagarcia65@gmail.com", // generated ethereal user
            pass: "un18nacioLALO14629*", // generate
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const info = await transporter.sendMail({
        from: "'API Articulos' <eduardotzitzihuagarcia65@gmail.com>",
        to: "eduardotzitzihuagarcia65@gmail.com",
        subject: "pruba de contenido",
        html: contentHTML

    });
    console.log("mensaje enviado", info.messageId);


    res.redirect("/");

})*/


////////////////////recuperacion de contraseña
// router.put("/cambioContrasena", async(req, rep) => {
//     const { username } = req.body;
//     if (!(username)) {
//         return res.status(400).json({ message: 'usuario requerido' });
//     }

//     const message = "Se te envio un correo con un link para el reseteo de tu contraseña";
//     let verificationLink = `http://localhost:5000/newpassword/${token}`;
//     let emailStatus = 'OK';
//     const user


//     let info = await transporter.sendMail({
//         from: '"API articulos 👻" <api.articulos@noresponder.com>', // sender address
//         to: user.username,
//         subject: "REcuperacion de contraseña", // Subject line
//         html: `
//         <b>dar click en el enlace </b>
//         <a href = "${verificationLink}"> ${verificationLink} </a>
//         `,

//     });


// });



module.exports = router;