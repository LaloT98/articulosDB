const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    tipo: { type: String, trim: true },

    nombre: { type: String, trim: true },
    apellidos: { type: String, trim: true },
    direccion: { type: String, trim: true },
    telefono: { type: String, trim: true },
    lugarNacimiento: { type: String, trim: true },
    CURP: { type: String, trim: true },
    RFC: { type: String, trim: true },
    edad: { type: String, trim: true },

    CVU: { type: String, trim: true },
    licenciatura: { type: String, trim: true },
    maestria: { type: String, trim: true },
    doctorado: { type: String, trim: true },
    especialidad: { type: String, trim: true },

    matricula: { type: String, required: true, unique: true, trim: true },
    correo: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema)