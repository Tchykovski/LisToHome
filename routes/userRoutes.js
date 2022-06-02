const express = require('express');
const { append } = require('express/lib/response');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Usuario');
const Usuario = mongoose.model('usuarios');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const isAdmin = require('../helpers/isAdmin');




router.get('/registro', (req, res) => {
    res.render('usuarios/registro');
});


router.post('/registro', (req, res) => {

const erros = [];

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({ texto: 'Nome inválido' });
    }

    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        erros.push({ texto: 'Email inválido' });
    }

    if (!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null) {
        erros.push({ texto: 'Senha inválida' });
    }

    if (req.body.senha.length < 4) {
        erros.push({ texto: 'Senha muito curta' });
    }

    if(req.body.senha != req.body.confirm_senha) {
        erros.push({ texto: 'Senhas não coincidem' });
    }

    if (erros.length > 0) {
        res.render('usuarios/registro', { erros: erros });
    }
    else {
        Usuario.findOne({ email: req.body.email }).then((usuario) => {
            if (usuario) {
                req.flash('error_msg', 'Email já cadastrado');
                res.redirect('/usuarios/registro');
            } else {

                const salt = bcrypt.genSaltSync(10);
                const senhaC = bcrypt.hashSync(req.body.senha, salt);



                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: senhaC,
                    isAdmin: req.body.isAdmin
                });

               

                novoUsuario.save().then(() => {
                    req.flash('success_msg', 'Usuário criado com sucesso');
                    res.redirect('/');

                }).catch((err) => {
                    req.flash('error_msg', 'Houve um erro ao salvar o usuário');
                    res.redirect('/usuarios/registro');
                });
            }
        });
    }

})



router.get('/login', (req, res) => {
    res.render('usuarios/login');
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/usuarios/login',
        failureFlash: true
    })(req, res, next);
});



router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      req.flash('success_msg', 'Deslogado com sucesso');
      res.redirect('/');
    });
  });




module.exports = router;