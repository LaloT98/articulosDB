const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../helpers/auth');
const User = require('../models/User');
const Articulos = require('../models/Article');
const { format } = require('timeago.js');


router.get("/menu", isAuthenticated, async(req, res) => {
    const usuario = await User.findById(req.user.id).lean()
    const articulos = await Articulos.find({ user: req.user.id }).sort({ date: 'desc' }).lean();
    const fecha = format(usuario.date)
    if (usuario.tipo == "USUARIO") {
        res.render("articulos/menu", { articulos, usuario, fecha });
    }
    if (usuario.tipo == "ADMINISTRADOR") {
        res.render("admin/menu", { usuario, fecha });
    }
});

router.get('/informacion', isAuthenticated, async(req, res) => {
    const usuario = await User.findById(req.user.id).lean()
    res.render('articulos/informacionUsuario', { usuario });
});

router.get('/menu/reporte/administradores', isAuthenticated, async(req, res) => {
    const usuario = await User.findById(req.user.id).lean()
    const TodosAdministradores = await User.find({ tipo: "ADMINISTRADOR" }).sort({ date: 'desc' }).lean();
    if (usuario.tipo == "USUARIO") {
        res.redirect("/menu")
    }
    if (usuario.tipo == "ADMINISTRADOR") {
        res.render("admin/menuAdministradores", { TodosAdministradores });
    }
});

router.get('/menu/reporte/usuarios', isAuthenticated, async(req, res) => {
    const usuario = await User.findById(req.user.id).lean()
    const TodosUsuarios = await User.find({ tipo: "USUARIO" }).sort({ date: 'desc' }).lean();
    if (usuario.tipo == "USUARIO") {
        res.redirect("/menu")
    }
    if (usuario.tipo == "ADMINISTRADOR") {
        res.render("admin/menuUsuarios", { TodosUsuarios });
    }
});

router.get('/menu/reporte/articulos', isAuthenticated, async(req, res) => {
    const usuario = await User.findById(req.user.id).lean()
    const TodosArticulos = await Articulos.find().sort({ user: 'desc', tipo: 'desc', date: 'desc' }).lean();
    if (usuario.tipo == "USUARIO") {
        res.redirect("/menu")
    }
    if (usuario.tipo == "ADMINISTRADOR") {
        res.render("admin/menuArticulos", { TodosArticulos });
    }
});

router.get('/menu/reporte/todo', isAuthenticated, async(req, res) => {
    const usuario = await User.findById(req.user.id).lean()
    const TodosArticulos = await Articulos.find().sort({ user: 'desc', tipo: 'desc', date: 'desc' }).lean();
    const TodosUsuarios = await User.find({ tipo: "USUARIO" }).sort({ date: 'desc' }).lean();
    const TodosAdministradores = await User.find({ tipo: "ADMINISTRADOR" }).sort({ date: 'desc' }).lean();
    if (usuario.tipo == "USUARIO") {
        res.redirect("/menu")
    }
    if (usuario.tipo == "ADMINISTRADOR") {
        res.render("admin/menuTodo", { TodosArticulos, TodosUsuarios, TodosAdministradores });
    }
});

router.get('/menu/registrar', isAuthenticated, async(req, res) => {
    const usuario = await User.findById(req.user.id).lean();
    if (usuario.tipo == "USUARIO") {
        res.redirect("/menu")
    }
    if (usuario.tipo == "ADMINISTRADOR") {
        res.render('users/RegistrarUsuario');
    }

});

module.exports = router;