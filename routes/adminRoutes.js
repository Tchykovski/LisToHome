const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Lista');
const Lista = mongoose.model('listas');
require('../models/Produto');
const Produto = mongoose.model('produtos');
const {isAdmin} = require('../helpers/isAdmin');



router.get('/',  (req, res) => {
    res.render('admin/index');
});



//mostra todas as listas 
router.get('/listas',   (req, res) => {
    Lista.find().lean().then((listas) => {
        res.render('admin/listas', { listas: listas });
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao listar as listas');
        res.redirect('/admin');
    });

});


//mostra formulário de edição
router.get('/listas/edit/:id',  (req, res) => {
Lista.findOne({ _id: req.params.id }).lean().then((lista) => {
    res.render('admin/editLista', { lista: lista });
}).catch((err) => {
    req.flash('error_msg', 'Essa lista não existe');
    res.redirect('/admin/listas');
});
});


router.post('/listas/edit',  (req, res) => {
    Lista.findOne({ _id: req.body.id }).then((lista) => {
        lista.nome = req.body.nome;

        lista.save().then(() => {
            req.flash('success_msg', 'Lista editada com sucesso');
            res.redirect('/admin/listas');
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao salvar a edição da lista');
            res.redirect('/admin/listas');
        });
    })
});




       


//formulario add lista
router.get('/listas/add',  (req, res) => {
    res.render('admin/addlistas');
});

router.post('/listas/nova', (req, res) => {

var erros = [];

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null || req.body.nome.length < 3) {
        erros.push({ texto: 'Nome inválido' });
    }


    if (erros.length > 0) {
        res.render('admin/addlistas', { erros: erros });
    } else{

    const novaLista = {
    nome: req.body.nome,
    }
          
     new Lista(novaLista)
    .save()
    .then(() => {

        req.flash('success_msg', 'Lista criada com sucesso');
        res.redirect('/admin/listas')

    }).catch((err) => {

        req.flash('error_msg', 'Houve um erro ao salvar a lista, tente novamente');
        res.redirect('/admin')
    });
    }
    


});


router.post('/lista/delete', (req, res) => {
    Lista.deleteOne({ _id: req.body.id }).then(() => {
        req.flash('success_msg', 'Lista deletada com sucesso');
        res.redirect('/admin/listas');
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao deletar a lista');
        res.redirect('/admin/listas');
    });
});




router.get('/produtos',  (req, res) => {
    Produto.find().lean().populate('lista').sort({ date: 'desc' }).then((produtos) => {
        res.render('admin/produtosgeral', { produtos: produtos });
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao listar os produtos');
        res.redirect('/admin');
    }
    );
});


router.get('/produtos/add',  (req, res) => {
    Lista.find().lean().then((listas) => {
        res.render('admin/addprodutosgeral', { listas: listas });
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao listar as listas');
        res.redirect('/admin');
    });
 })

 router.post('/produtos/nova', (req, res) => {
  var erros = [];
  if (req.body.lista == "0"){
    erros.push({ texto: 'Lista inválida' });
  }

if (erros.length>0){    
    res.render('admin/addprodutosgeral', {erros: erros});
}else {
    const novoProduto = {
        nome: req.body.nome,
        preco: req.body.preco,
        quantidade: req.body.quantidade,
        lista: req.body.lista
    }
    new Produto(novoProduto)
    .save()
    .then(() => {
        req.flash('success_msg', 'Produto criado com sucesso');
        res.redirect('/admin/produtosgeral');

    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao salvar o produto, tente novamente');
        res.redirect('/admin/produtosgeral');
    });
}


 })

    router.get('/produtos/edit/:id',  (req, res) => {
        Produto.findOne({ _id: req.params.id }).lean().then((produto) => {
            Lista.find().lean().then((listas) => {
                res.render('admin/editprodutosgeral', { produto: produto, listas: listas });
            }).catch((err) => {
                req.flash('error_msg', 'Essa lista não existe');
                res.redirect('/admin/listas');
            });
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao listar os produtos');
            res.redirect('/admin/produtosgeral');
        });
    });

    router.post('/produto/edit', (req, res) => {
        Produto.findOne({ _id: req.body.id }).then((produto) => {
            produto.nome = req.body.nome;
            produto.preco = req.body.preco;
            produto.quantidade = req.body.quantidade;
            produto.lista = req.body.lista;

            produto.save().then(() => {
                req.flash('success_msg', 'Produto editado com sucesso');
                res.redirect('/admin/produtos');
            }).catch((err) => {
                req.flash('error_msg', 'Houve um erro ao salvar a edição do produto');
                res.redirect('/admin/produtos');
            });
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao editar o produto');
            res.redirect('/admin/produtos');
        });
    });



    router.get('/produtos/delete/:id',  (req, res) => {
        Produto.deleteOne({ _id: req.params.id }).then(() => {
            req.flash('success_msg', 'Produto deletado com sucesso');
            res.redirect('/admin/produtos');
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao deletar o produto');
            res.redirect('/admin/produtos');
        });
    });




module.exports = router;