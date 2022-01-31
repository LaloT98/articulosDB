const mongoose = require('mongoose');
const { type } = require('os');
const { Schema } = mongoose;

const NoteSchema = new Schema({
    tipo: { type: String, required: true },
    nombreA: { type: String, required: true },
    autor: { type: String, required: true },
    url: { type: String, required: true },

    filename: { type: String },
    path: { type: String },
    originalname: { type: String },
    mimetype: { type: String },
    size: { type: String },
    user: { type: String },
    matricula: { type: String },


    date: { type: Date, default: Date.now }

})

module.exports = mongoose.model('Articulos', NoteSchema);