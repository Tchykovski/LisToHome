//Carregando módulos

const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();
const adminRoutes = require('./routes/adminRoutes');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
require('./models/Lista');
const Lista = mongoose.model('listas');
require('./models/Produto');
const Produto = mongoose.model('produtos');

//Configurações

//Sessão
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));


//Mensagens
app.use(flash());

//middlerware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

//Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Handlebars
app.engine('handlebars', handlebars.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');


//chamando o mongoose
mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://dev:dRFGCOn4E3GNZzCT@cluster0.elxpe.mongodb.net/LisToHome').then(() => {
    console.log('Conectado ao MongoDB');
}).catch((err) => {
    console.log('Erro ao conectar ao MongoDB: ' + err);
});



//PUBLIC
app.use(express.static(path.join(__dirname, 'public')));


//Rotas

app.get('/', (req, res) => {
    Lista.find().lean().then((listas) => {

        res.render('index', { listas: listas });
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao listar os produtos');
        res.redirect('/404');
    });
});


app.get('/404', (req, res) => {
    res.send('404');
});



app.get('/lista/:id', (req, res) => {
    Lista.findOne({ _id: req.params.id }).lean().then((lista) => {
        Produto.find({ lista: req.params.id }).lean().then((produtos) => {
                res.render('listaprodutos/index', { produtos: produtos, lista: lista });
            }).catch((err) => {
                req.flash('error_msg', 'Houve um erro ao listar os produtos');
                res.redirect('/404');
            });
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao listar os produtos');
        res.redirect('/404');
    });
});
   




       









    
    
    





app.use('/admin', adminRoutes);


//Outros
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
