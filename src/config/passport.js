const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');




passport.use("Ingreso", new LocalStrategy(
    {
        usernameField: "matricula",
        passwordField: "password",
        passReqToCallback: true
    },

    async (req, matricula, password, done) => {
        const user = await User.findOne({ matricula: matricula });
        if (user) {
            const contrasena = await User.findOne({ matricula: matricula, password: password });
            if (contrasena) {
                return done(null, user); 
            }
            else { return done(null, false, { message: "Contraseña Incorrecta" }); }
        }
        else { return done(null, false, { message: "Matricula No Encontrada" }); }
    }));



passport.serializeUser((user, done) => { done(null, user.id); });
passport.deserializeUser((id, done) => { User.findById(id, (err, user) => { done(err, user) }); });
