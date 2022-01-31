const mongoose = require('mongoose');
const config = require("./config/config")

mongoose.connect(process.env.MONGODB_URI || config.mongoID)
    .then(db => console.log('Base de datos Conectada'))
    .catch(err => console.error(err));