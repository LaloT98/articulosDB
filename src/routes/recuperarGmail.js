const express = require("express");
const nodemailer = require("nodemailer")
const { google } = require("googleapis")
const OAuth2 = google.auth.OAuth2
const router = express.Router();
const config = require("../config/config")
const User = require('../models/User');


router.post("/envia-correo", async(req, res) => {
    const { correo, CURP } = (req.body)
    usuario = await User.findOne({ correo: correo, CURP: CURP })


    const OAuth2_client = new OAuth2(
        config.clientId || process.env.clientId,
        config.clientSecret || process.env.clientSecret,
        config.uriEmail || process.env.uriEmail
    )
    OAuth2_client.setCredentials({ refresh_token: (config.refreshToken || process.env.refreshToken) })


    if (usuario) {
        const contentHTML = `
    <h2> Hola ${usuario.nombre} </h2>
    <h3> Te enviamos la informacion solicitada para el ingresar a tu cuenta</h3>
    

    <ul>
        <li> matricula      : ${usuario.matricula} </li>
        <li> Contraseña     : ${usuario.password} </li>
        <li> Tipo de Usuaio : ${usuario.tipo} </li>
    </ul>

    <h4> si deseas cambiar la contraseña, deberas ingresar con tu cuenta y cambiar dentro de la plataforma </h4>
    https://app-articulosdb.herokuapp.com

    <h4>Estamos trabajando para mejorar la plataforma web, por tu comprension gracias </h4>

    `;
        async function sendMail() {
            try {
                const accessToken = await OAuth2_client.getAccessToken()
                const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        type: "OAuth2",
                        user: config.userEmail || process.env.userEmail,
                        clientId: config.clientId || process.env.clientId,
                        clientSecret: config.clientSecret || process.env.clientSecret,
                        refreshToken: config.refreshToken || process.env.refreshToken,
                        accessToken: accessToken || process.env.accessToken
                    },
                });
                const mail_options = {
                    from: `API Articulos <${(config.userEmail || process.env.userEmail)}>`,
                    to: usuario.correo,
                    subject: 'Recuperacion de Cuenta ',
                    html: contentHTML
                };
                const result = await transporter.sendMail(mail_options)
                return result;

            } catch (err) {
                console.log(err);
            }
        }
        sendMail()
        res.render("users/email")

    } else {
        res.render("users/email")

    }
    /*
        sendMail()
            .then((result) => res.status(200).send("enviado"))
            .catch((error) => console.log(error.message))
            // res.send("Enviado")
            */
})

module.exports = router