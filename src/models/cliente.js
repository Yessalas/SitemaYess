/**
 * Modelo de dados para construção das coleções("tabelas")
 * Clientes
 */

// importação dos recursos do framework mongoose
const{model,Schema}= require('mongoose')
const { type } = require('os')

// criação da estrutura da coleção clientes
const clienteSchema = new Schema({
    nomeCliente :{
        type: String
    },
    cpfCliente:{
        type: String,
        unique:true,
        index: true
    },
    emailCliente:{
        type: String
    },
    foneCliente:{
        type: String
    },
    cepCliente:{
        type: String
    },
    logradouroCliente:{
        type: String
    },
    numeroCliente:{
        type: String
    },
    complementoCliente:{
        type: String
    },
    bairroCliente:{
        type: String
    },
    cidadeCliente:{
        type: String
    },
    ufcCliente:{
        type: String
    },

},{versionKey: false})// não cersionar os dados armazenados

// Exportar para o main o modelo de dados
// Obs: Clientes será o nome da coleção
module.exports = model('Clientes', clienteSchema)
