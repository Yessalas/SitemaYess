/**
 * Processo principal
 * Estudo do banco de dados MongoDB (CRUD)
 * @author Yesenia Salas
 */

// importação do módulo de conexão
const { conectar, desconectar } = require('./database.js')

// importação do modelo de dados do cliente
const clienteModel = require('./src/models/cliente.js')

// Função para cadastrar um novo cliente
// ATENÇÃO! Para trabalhar com banco de dados usar sempre async-await e try-catch
const salvarCliente = async (nomeCli, foneCli, cpfCli) => {
    try {
        //setar a estrutura de dados com os valores
        //Obs: Usar os mesmo nomes da estrutura
        const novoCliente = new clienteModel({
            nomeCliente: nomeCli,
            foneCliente: foneCli,
            cpfCliente: cpfCli
        })
        // a linha abaixo salva os dados no banco de dados
        await novoCliente.save()
        console.log("Cliente adicionado com sucesso")
    } catch (error) {
        //tratamento personalizado dos erros(exceções)
        if (error.code = 11000) {
            console.log(`Erro: O CPF ${cpfCli} já está cadastrado`)
        } else {
            console.log(error)
        }
    }
}

// Função para listar todos os clientes
// .sort({ nomeCliente: 1 }) Listar em ordem alfabética (nome)
const listarClientes = async () => {
    try {
        const clientes = await clienteModel.find().sort({ nomeCliente: 1 })
        console.log(clientes)
    } catch (error) {
        console.log(error)
    }
}

// Função para buscar um cliente pelo nome
// find({nomeCliente: new RegExp(nome, i)}) ignorar na busca letras maíusculas ou minúsculas (i - case insensitive) 
const buscarClienteNome = async (nome) => {
    try {
        const clienteNome = await clienteModel.find(
            {
                nomeCliente: new RegExp(nome, 'i')
            }
        )
        console.log(clienteNome)
    } catch (error) {
        console.log(error)
    }
}

// Função para buscar um cliente pelo CPF
const buscarClienteCPF = async (cpf) => {
    try {
        const clienteCPF = await clienteModel.find(
            {
                cpfCliente: new RegExp(cpf)
            }
        )
        console.log(clienteCPF)
    } catch (error) {
        console.log(error)
    }
}

// Função para editar os dados do cliente
// Atenção!!! Usar o id do cliente
const atualizarCliente = async (id, nomeCli, foneCli, cpfCli) => {
    try {
        const clienteEditado = await clienteModel.findByIdAndUpdate(
            id,
            {
                nomeCliente: nomeCli,
                foneCliente: foneCli,
                cpfCliente: cpfCli
            },
            {
                new: true,
                runValidators: true
            }
        )
        console.log("Dados do cliente alterados com sucesso")
    } catch (error) {
        //tratamento personalizado dos erros(exceções)
        if (error.code = 11000) {
            console.log(`Erro: O CPF ${cpfCli} já está cadastrado`)
        } else {
            console.log(error)
        }
    }
}

// Função para excluir o cliente
// Atenção!!! Usar o id do cliente
const excluirCliente = async (id) => {
    try {
        const clienteDeletado = await clienteModel.findByIdAndDelete(id)
        console.log("Cliente excluído com sucesso.")
    } catch (error) {
        console.log(error)
    }
}

//========================================================
//========================================================
const iniciarSistema = async () => {
    console.clear()
    console.log("Estudo do MongoDB")
    console.log("-------------------------------------")
    await conectar()
    // CRUD Create (inserção no banco de dados)
    await salvarCliente("Julia Ramos", "99999-4321", "123456787895")

    // CRUD Read (listar todos os clientes)
    await listarClientes()

    // CRUD Read (busca pelo nome do cliente)
    //await buscarClienteNome()

    // CRUD Read (busca pelo cpf do cliente)
    //await buscarClienteCPF()

    // CRUD Update (id do cliente)
    //await atualizarCliente()

    // CRUD Delete (id do cliente)
    // await excluirCliente()
    await desconectar()
}

iniciarSistema()