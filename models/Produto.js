const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Produto = new Schema({
    nome: {
        type: String,
        required: true
    },
    preco: {
        type: String,
        required: true
    },
    quantidade: {
        type:Number,
        required: true
    },
    lista: {
        type: Schema.Types.ObjectId,
        ref: 'listas',
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

mongoose.model('produtos', Produto);