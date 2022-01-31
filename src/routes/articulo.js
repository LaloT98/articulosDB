const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Articulos = require('../models/Article');
const Art = require('../models/Article');
const { isAuthenticated } = require('../helpers/auth');

const { format } = require('timeago.js');
const { unlink } = require('fs-extra');
const path = require('path');

path



///////////USUARIO///////////USUARIO///////////USUARIO///////////USUARIO///////////
///////////USUARIO///////////USUARIO///////////USUARIO///////////USUARIO///////////
///////////USUARIO///////////USUARIO///////////USUARIO///////////USUARIO///////////
router.get("/upload", isAuthenticated, (req, res) => {
    res.render("articulos/new-article")

})
router.post("/articulos/articulo-nuevo", isAuthenticated, async (req, res) => {
    const art = new Art()
    const { tipo, nombreA, autor, url } = req.body;
    const error = [];

    if (error.length > 0) {
        res.render('articulos/upload', { errors, tipo, nombreA, autor, url });
    }
    else {
        art.tipo = req.body.tipo;
        art.nombreA = req.body.nombreA;
        art.autor = req.body.autor;
        art.url = req.body.url;
        art.filename = req.file.filename;
        art.path = "/pdf/uploads/" + req.file.filename;
        art.originalname = req.file.originalname;
        art.mimetype = req.file.mimetype;
        art.size = req.file.size;
        art.user = req.user.id;
        art.matricula = req.user.matricula;
        await art.save();
        req.flash("success_msg", "Articulo guardado satisfactoriamente")
        res.redirect("/menu")
    }
})

router.get("/pdf/:id", isAuthenticated, async (req, res) => {
    const { id } = req.params
    const articulo = await Articulos.findById(id).lean();
    const fecha = format(articulo.date)
    res.render("articulos/verArticulo", { articulo, fecha })
})
router.get("/pdf/:id/delete", isAuthenticated, async (req, res) => {
    const articulo = await Articulos.findByIdAndDelete(req.params.id).lean();
    const DirArchivo = path.resolve("./src/public" + articulo.path)///
    req.flash('success_msg', 'Articulo ha sido borrado satisfactoriamente');
    res.redirect("/menu")
    await unlink(DirArchivo)
    
})

router.get("/pdf/:id/edit", isAuthenticated, async (req, res) => {
    const articulo = await Articulos.findById(req.params.id).lean();
    res.render("articulos/editarArticulo", { articulo });
})

router.get("/pdf/:id/editPDF", isAuthenticated, async (req, res) => {
    const articulo = await Articulos.findById(req.params.id).lean();
    res.render("articulos/upload", { articulo })
})

router.post("/pdf/:id/editPDF", isAuthenticated, async (req, res) => {
    const errors = [];
    if (req.file == null) {
        errors.push({ text: "Colocar un Archivo" });
    }
    if (errors.length > 0) {
        res.render("articulos/upload", { errors });
        req.flash("errorFatal", "Colocar un Archivo antes de guardar cambios")
    }

    else {
        const art = await Art.findById(req.params.id)
        await unlink(path.resolve("./src/public" + art.path))

        art.filename = req.file.filename;
        art.path = "/pdf/uploads/" + req.file.filename;
        art.originalname = req.file.originalname;
        art.mimetype = req.file.mimetype;
        art.size = req.file.size;
        await art.save();
        req.flash("success_msg", "Se cambio el PDF exitosamente")
    }





    res.redirect("/menu")
})

///RENOMBRAR DATOS DEL ARTICULO
router.put("/articulo/edit-article/:id", isAuthenticated, async (req, res) => {
    const { tipo, nombreA, autor, url } = req.body;
    await Articulos.findByIdAndUpdate(req.params.id, { tipo, nombreA, autor, url });
    res.redirect('/menu');
})
///////////USUARIO///////////USUARIO///////////USUARIO///////////USUARIO///////////
///////////USUARIO///////////USUARIO///////////USUARIO///////////USUARIO///////////
///////////USUARIO///////////USUARIO///////////USUARIO///////////USUARIO///////////

module.exports = router;