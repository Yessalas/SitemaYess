console.log("Processo principal")

const { app, BrowserWindow, nativeTheme, Menu, ipcMain, dialog, shell } = require('electron')

// Esta linha está relacionada ao preload.js
const path = require('node:path')

// Importação dos métodos conectar e desconectar (módulo de conexão)
const { conectar, desconectar } = require('./database.js')

// Importação do Schema Clientes da camada model
const clientModel = require('./src/models/Clientes.js')

// Importação do pacote jspdf (npm i jspdf)
const { jspdf, default: jsPDF } = require('jspdf')

// Importação da biblioteca fs (nativa do JavaScript) para manipulação de arquivos (no caso arquivos pdf)
const fs = require('fs')

// Janela principal
let win
const createWindow = () => {
    // a linha abaixo define o tema (claro ou escuro)
    nativeTheme.themeSource = 'light' //(dark ou light)
    win = new BrowserWindow({
        width: 800,
        height: 600,
        //autoHideMenuBar: true,
        //minimizable: false,
        resizable: false,
        //ativação do preload.js
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    // menu personalizado
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))

    win.loadFile('./src/views/index.html')
}

// Janela sobre
function aboutWindow() {
    nativeTheme.themeSource = 'light'
    // a linha abaixo obtém a janela principal
    const main = BrowserWindow.getFocusedWindow()
    let about
    // Estabelecer uma relação hierárquica entre janelas
    if (main) {
        // Criar a janela sobre
        about = new BrowserWindow({
            width: 360,
            height: 220,
            autoHideMenuBar: true,
            resizable: false,
            minimizable: false,
            parent: main,
            modal: true
        })
    }
    //carregar o documento html na janela
    about.loadFile('./src/views/sobre.html')
}

// Janela cliente
let client
function clientWindow() {
    nativeTheme.themeSource = 'light'
    const main = BrowserWindow.getFocusedWindow()
    if (main) {
        client = new BrowserWindow({
            width: 1010,
            height: 680,
            //autoHideMenuBar: true,
            //resizable: false,
            parent: main,
            modal: true,
            //ativação do preload.js
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        })
    }
    client.loadFile('./src/views/cliente.html')
    client.center() //iniciar no centro da tela   
}

// Janela OS
let os
function osWindow() {
    nativeTheme.themeSource = 'light'
    const main = BrowserWindow.getFocusedWindow()
    if (main) {
        os = new BrowserWindow({
            width: 1010,
            height: 720,
            // autoHideMenuBar: true,
            resizable: false,
            parent: main,
            modal: true
        })
    }
    os.loadFile('./src/views/os.html')
    os.center()
}

// Iniciar a aplicação
app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

// reduzir logs não críticos
app.commandLine.appendSwitch('log-level', '3')

// iniciar a conexão com o banco de dados (pedido direto do preload.js)
ipcMain.on('db-connect', async (event) => {
    let conectado = await conectar()
    // se conectado for igual a true
    if (conectado) {
        // enviar uma mensagem para o renderizador trocar o ícone, criar um delay de 0.5s para sincronizar a nuvem
        setTimeout(() => {
            event.reply('db-status', "conectado")
        }, 500) //500ms        
    }
})

// IMPORTANTE ! Desconectar do banco de dados quando a aplicação for encerrada.
app.on('before-quit', () => {
    desconectar()
})

// template do menu
const template = [
    {
        label: 'Cadastro',
        submenu: [
            {
                label: 'Clientes',
                click: () => clientWindow()
            },
            {
                label: 'OS',
                click: () => osWindow()
            },
            {
                type: 'separator'
            },
            {
                label: 'Sair',
                click: () => app.quit(),
                accelerator: 'Alt+F4'
            }
        ]
    },
    {
        label: 'Relatórios',
        submenu: [
            {
                label: 'Clientes',
                click: () => relatorioClientes()
            },
            {
                label: 'OS abertas'
            },
            {
                label: 'OS concluídas'
            }
        ]
    },
    {
        label: 'Ferramentas',
        submenu: [
            {
                label: 'Aplicar zoom',
                role: 'zoomIn'
            },
            {
                label: 'Reduzir',
                role: 'zoomOut'
            },
            {
                label: 'Restaurar o zoom padrão',
                role: 'resetZoom'
            },
            {
                type: 'separator'
            },
            {
                label: 'Recarregar',
                role: 'reload'
            },
            {
                label: 'Ferramentas do desenvolvedor',
                role: 'toggleDevTools'
            }
        ]
    },
    {
        label: 'Ajuda',
        submenu: [
            {
                label: 'Sobre',
                click: () => aboutWindow()
            }
        ]
    }
]

// recebimento dos pedidos do renderizador para abertura de janelas (botões) autorizado no preload.js
ipcMain.on('client-window', () => {
    clientWindow()
})

ipcMain.on('os-window', () => {
    osWindow()
})

// ============================================================
// == Clientes - CRUD Create
// recebimento do objeto que contem os dados do cliente
ipcMain.on('new-client', async (event, client) => {
    // Importante! Teste de recebimento dos dados do cliente
    console.log(client)
    // Cadastrar a estrutura de dados no banco de dados MongoDB
    try {
        // criar uma nova de estrutura de dados usando a classe modelo. Atenção! Os atributos precisam ser idênticos ao modelo de dados Clientes.js e os valores são definidos pelo conteúdo do objeto cliente
        const newClient = new clientModel({
            nomeCliente: client.nameCli,
            cpfCliente: client.cpfCli,
            emailCliente: client.emailCli,
            foneCliente: client.phoneCli,
            cepCliente: client.cepCli,
            logradouroCliente: client.addressCli,
            numeroCliente: client.numberCli,
            complementoCliente: client.complementCli,
            bairroCliente: client.neighborhoodCli,
            cidadeCliente: client.cityCli,
            ufcCliente: client.ufcCli
        })
        // salvar os dados do cliente no banco de dados
        await newClient.save()
        // Mensagem de confirmação
        dialog.showMessageBox({
            //customização
            type: 'info',
            title: "Aviso",
            message: "Cliente adicionado com sucesso",
            buttons: ['OK']
        }).then((result) => {
            //ação ao pressionar o botão (result = 0)
            if (result.response === 0) {
                //enviar um pedido para o renderizador limpar os campos e resetar as configurações pré definidas (rótulo 'reset-form' do preload.js
                event.reply('reset-form')
            }
        })
    } catch (error) {
        // se o código de erro for 11000 (cpf duplicado) enviar uma mensagem ao usuário
        if (error.code === 11000) {
            dialog.showMessageBox({
                type: 'error',
                title: "Atenção!",
                message: "CPF já está cadastrado\nVerifique se digitou corretamente",
                buttons: ['OK']
            }).then((result) => {
                if (result.response === 0) {
                    // limpar a caixa de input do cpf, focar esta caixa e deixar a borda em vermelho
                }
            })
        }
        console.log(error)
    }
})

// == Fim - Clientes - CRUD Create
// ============================================================


// ============================================================
// == Relatório de clientes ===================================

async function relatorioClientes() {
    try {
        // Passo 1: Consultar o banco de dados e obter a listagem de clientes cadastrados por ordem alfabética
        const clientes = await clientModel.find().sort({ nomeCliente: 1 })

        // Passo 2: Formatação do documento pdf
        const doc = new jsPDF('p', 'mm', 'a4')

        // Inserir imagem no documento pdf
        const imagePath = path.join(__dirname, 'src', 'public', 'img', 'logo.png')
        const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' })
        doc.addImage(imageBase64, 'PNG', 5, 8)

        doc.setFontSize(18)
        doc.text("Relatório de clientes", 14, 45)

        const dataAtual = new Date().toLocaleDateString('pt-BR')
        doc.setFontSize(12)
        doc.text(`Data: ${dataAtual}`, 165, 10)

        let y = 60
        doc.text("Nome", 14, y)
        doc.text("Telefone", 80, y)
        doc.text("E-mail", 130, y)
        y += 5

        doc.setLineWidth(0.5)
        doc.line(10, y, 200, y)

        y += 10

        clientes.forEach((c) => {
            if (y > 280) {
                doc.addPage()
                y = 20
                doc.text("Nome", 14, y)
                doc.text("Telefone", 80, y)
                doc.text("E-mail", 130, y)
                y += 5
                doc.setLineWidth(0.5)
                doc.line(10, y, 200, y)
                y += 10
            }

            doc.text(String(c.nomeCliente || "N/A"), 14, y)
            doc.text(String(c.foneCliente || "N/A"), 80, y)
            doc.text(String(c.emailCliente || "N/A"), 130, y)
            y += 10
        })

        const paginas = doc.internal.getNumberOfPages()
        for (let i = 1; i <= paginas; i++) {
            doc.setPage(i)
            doc.setFontSize(10)
            doc.text(`Página ${i} de ${paginas}`, 105, 290, { align: 'center' })
        }

        const tempDir = app.getPath('temp')
        const filePath = path.join(tempDir, 'clientes.pdf')
        doc.save(filePath)
        shell.openPath(filePath)
    } catch (error) {
        console.log(error)
    }
}


// == Fim - relatório de clientes =============================
// ============================================================


// ============================================================
// == CRUD Read ===============================================

// Validação de busca (preenchimento obrigatório)
ipcMain.on('validate-search', () => {
    dialog.showMessageBox({
        type: 'warning',
        title: "Atenção!",
        message: "Preencha o campo de busca",
        buttons: ['OK']
    })
})

ipcMain.on('search-name', async (event, name) => {
    //console.log("teste IPC search-name")
    //console.log(name) // teste do passo 2 (importante!)
    // Passos 3 e 4 busca dos dados do cliente no banco
    //find({nomeCliente: name}) - busca pelo nome
    //RegExp(name, 'i') - i (insensitive / Ignorar maiúsculo ou minúsculo)
    try {
        const dataClient = await clientModel.find({
            nomeCliente: new RegExp(name, 'i')
        })
        console.log(dataClient) // teste passos 3 e 4 (importante!)

        // melhoria da experiência do usuário (se o cliente não estiver cadastrado, alertar o usuário e questionar se ele quer cadastrar este novo cliente. Se não quiser cadastrar, limpar os campos, se quiser cadastrar recortar o nome do cliente do campo de busca e colar no campo nome)

        // se o vetor estiver vazio [] (cliente não cadastrado)
        if (dataClient.length === 0) {
            dialog.showMessageBox({
                type: 'warning',
                title: "Aviso",
                message: "Cliente não cadastrado.\nDeseja cadastrar este cliente?",
                defaultId: 0, //botão 0
                buttons: ['Sim', 'Não'] // [0, 1]
            }).then((result) => {
                if (result.response === 0) {
                    // enviar ao renderizador um pedido para setar os campos (recortar do campo de busca e colar no campo nome)
                    event.reply('set-client')
                } else {
                    // limpar o formulário
                    event.reply('reset-form')
                }
            })
        }

        // Passo 5:
        // enviando os dados do cliente ao rendererCliente
        // OBS: IPC só trabalha com string, então é necessário converter o JSON para string JSON.stringify(dataClient)
        event.reply('render-client', JSON.stringify(dataClient))

    } catch (error) {
        console.log(error)
    }
})

// == Fim - CRUD Read =========================================
// ============================================================


// ============================================================
// == CRUD Delete =============================================

ipcMain.on('delete-client', async (event, id) => {
    console.log(id) // teste do passo 2 (recebimento do id)
    try {
        //importante - confirmar a exclusão
        //client é o nome da variável que representa a janela
        const { response } = await dialog.showMessageBox(client, {
            type: 'warning',
            title: "Atenção!",
            message: "Deseja excluir este cliente?\nEsta ação não poderá ser desfeita.",
            buttons: ['Cancelar','Excluir'] //[0, 1]
        })
        if (response === 1) {
            console.log("teste do if de excluir")
            //Passo 3 - Excluir o registro do cliente
            const delClient = await clientModel.findByIdAndDelete(id)
            event.reply('reset-form')
        }
    } catch (error) {
        console.log(error)
    }
})

// == Fim - CRUD Delete =======================================
//===============================================
// ==Inicio CRUD UPDATE ===============================================
ipcMain.on('update-client', async (event, client) => {
    try {
        const updateClient = await clientModel.findByIdAndUpdate(
            client.idCli,

            {
                nomeCliente: client.nameCli,
                cpfCliente: client.cpfCli,
                emailCliente: client.emailCli,
                foneCliente: client.phoneCli,
                cepCliente: client.cepCli,
                logradouroCliente: client.addressCli,
                numeroCliente: client.numberCli,
                complementoCliente: client.complementCli,
                bairroCliente: client.neighborhoodCli,
                cidadeCliente: client.cityCli,
                ufcCliente: client.ufcCli
            },
            {
                new: true
            }
        )
        // Confirmação de mensagem funcione
        dialog.showMessageBox({
            type: 'info',
            title: "Aviso",
            message: "Dados do cliente alterados com sucesso",
            buttons: ['OK']
        }).then((result) => {
            if (result.response === 0) {
                event.reply('reset-form')
            }
        })
    } catch (error) {
        console.log(error)
    }


})



// ==FIM CRUD UPDATE ==================================================