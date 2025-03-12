console.log("Processo principal")

const { app, BrowserWindow, nativeTheme, Menu, ipcMain } = require('electron')
// esta linha esta relacionada ao preload.js 
const path= require('node:path')

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
        // ativação do preload,jd
        webPreferences:{
          preload: path.join(__dirname, 'preload.js')
        }
    })

    // menu personalizado
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))

    win.loadFile('./src/views/index.html')

    // recebimento dos pedidos de abertura de janelas(renderizador)
    ipcMain.on('client-window', () => {
      clientWindow()
    })

    ipcMain.on('ordem-window', () => {
      ordemWindow()
    })
}
// --------------- Fim janela principal ------------------------------------
// janela sobre 
function aboutWindows(){
  nativeTheme.themeSource = 'light'
  // a linha abaixo obtém a janela principal
  const main = BrowserWindow.getFocusedWindow()
  let about
  // Estabelecer hierarquica entre janelas
  if (main){
    // criar a janela sobre
    about = new BrowserWindow({
        width: 360,
        height: 250,
       // autoHideMenuBar: true,
        resizable: false,
        minimizable: false,
        parent: main,
        modal: true
    })
  }
  // carregar o documento na janela
  about.loadFile('./src/views/sobre.html')
}
//----------------- Fim janela Sobre-----------------------------------------------

// ----------------------- Janela cliente --------------------------------------------
let client
function clientWindow() {
    nativeTheme.themeSource = 'light'
    const main = BrowserWindow.getFocusedWindow()
    if(main) {
        client = new BrowserWindow({
            width: 1010,
            height: 680,
            autoHideMenuBar: true,
            resizable: false,
            parent: main,
            modal: true
        })
    }
    client.loadFile('./src/views/cliente.html') 
    client.center() //iniciar no centro da tela   
}
// ----------------------- Fim Janela cliente --------------------------------------------
// ----------------------- Janela OS --------------------------------------------
let ordem 
function ordemWindow(){
  nativeTheme.themeSource = 'light'
  const main  = BrowserWindow.getFocusedWindow()
  if (main){
    ordem = new BrowserWindow({
      width:1010,
      height: 720,
      autoHideMenuBar: true,
      resizable: false,
      parent: main,
      modal:true
    })
  }
  ordem.loadFile('./src/views/OS.html')
  os.center()
}
// ----------------------- Janela OS --------------------------------------------
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
// reduzir logs não criticos 
app.commandLine.appendSwitch('log-le','3')

// template do menu
const template = [
    {
        label: 'Cadastro',
        submenu:[
          {
            label: 'Clientes',
            click: () => clientWindow()
          },
          {
            label: 'OS',
            click: () => ordemWindow()
          },
          {
            type: 'separator'
          },
          {
            label:'Sair',
            click:() => app.quit(),
            accelerator: 'Alt+F4'
          }
        ]
    },
    {
        label: 'Relatórios',
        submenu: [
          {
            label:'Clientes'
          },
          {
            label:'OS abertas'
          },
          {
            label:'Os concluidas'
          }
          
        ]
    },    
    {
        label: 'Ferramentas',
        submenu:[
          {
            label: 'Aplicar zoom',
            role: 'zoomIn'
          },
          {
            label:'Reduzir',
            role:'zoomOut'
          },
          {
            label:'Restaurar o zoom padrão',
            role:'resetZoom'
          },
          {
            type: 'separator',

          },
          {
            label: 'Recarregador',
            role: 'reload'
          },
          {
            label:'Ferramentas do desenvolvedor',
            role:'toggleDevTools'
          }
        ]
    },
    {
        label: 'Ajuda',
        submenu:[
          {
            label:'Sobre',
            click: () => aboutWindows()
          }
        ]
    }
]