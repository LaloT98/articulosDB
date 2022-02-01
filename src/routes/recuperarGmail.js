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
        (process.env.clientId || config.clientId),
        (process.env.clientSecret || config.clientSecret),
        (process.env.uriEmail || config.uriEmail)
    );
    OAuth2_client.setCredentials({ refresh_token: (process.env.refreshToken || config.refreshToken) })


    if (usuario) {
        const contentHTML = `
    <h2> Hola ${usuario.nombre} </h2>
    <h3> Te enviamos la informacion solicitada para el ingresar a tu cuenta</h3>
    
    <h4> matricula      : ${usuario.matricula} </h4>
    <h4> Contraseña     : ${usuario.password}</h4>
    <h4> Tipo de Usuaio : ${usuario.tipo} </h4>
    
    
    

    <h5>Estamos trabajando para mejorar la plataforma web, por tu comprension gracias </h5>


    <h5> si deseas cambiar la contraseña, deberas ingresar con tu cuenta y cambiar dentro de la plataforma </h5>
    https://app-articulosdb.herokuapp.com

    

    `;
        async function sendMail() {
            try {
                const accessToken = await OAuth2_client.getAccessToken()
                const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        type: "OAuth2",
                        user: (process.env.userEmail || config.userEmail),
                        clientId: (process.env.clientId || config.clientId),
                        clientSecret: (process.env.clientSecret || config.clientSecret),
                        refreshToken: (process.env.refreshToken || config.refreshToken),
                        accessToken: accessToken
                    },
                });
                const mail_options = {
                    from: `API Articulos <${(process.env.userEmail || config.userEmail)}>`,
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
})

module.exports = router