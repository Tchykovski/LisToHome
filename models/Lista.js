const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const date =  Date.now();

const formatter =  Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'long'
});



const Lista = new Schema({
    nome: {
        type: String,
        required: true
    },
    date: {
        type: String,
        default: formatter.format(date)
    }
});

mongoose.model('listas', Lista);