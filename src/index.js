const express = require('express');
const path = require('path');
const multer = require('multer');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require("connect-flash");
const passport = require('passport');
const uuid = require('uuid');


//Inicializaciones
const app = express();
require('./database');
require("./config/passport");

//Configuraciones
app.set('port', process.env.PORT || 5000);
app.set("views", path.join(__dirname, "views"));
app.engine(".hbs", exphbs.engine({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
}));
app.set("view engine", ".hbs");

//MIDDLEWARES

//Funciones ejecutadas antes que llegen al servidor
// app.use(morgan("dev"))
app.use(express.urlencoded({ extended: false })); ///para que entienda los datos de un formulario
app.use(express.json());
const storage = multer.diskStorage({
    destination: path.join(__dirname, "public/pdf/uploads"),
    filename: (req, file, cb, filename) => {
        cb(null, uuid.v4() + path.extname(file.originalname));
    }
});
app.use(multer({ storage: storage }).single("pdf"));

app.use(methodOverride('_method'));
app.use(session({
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//Variables globales
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.errorFatal = req.flash("errorFatal");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
    app.locals.format = req.format;
    next();
});

//rutas de mi servidor
app.use(require('./routes/usuario'));
app.use(require('./routes/articulo'));
app.use(require('./routes/admin'));
app.use(require('./routes/recuperarGmail'));

//archivos estaticoss
app.use(express.static(path.join(__dirname, 'public')));
//inicar servidor o servidor escuchando
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});