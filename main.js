console.log("Processo principal")
const { app, BrowserWindow, nativeTheme } = require('electron')

//janela principal
let win
const createWindow = () => {
    // a linhya abaixo define o tema(claro ou escuro)
    nativeTheme.themeSource = 'ligth'// dark ou light
    win = new BrowserWindow({
    width: 800,
    height: 600,
   // autoHideMenuBar: true,
    // minimizable: false
    resizable: false
  })

  win.loadFile('./src/views/index.html')
}
// iniciar a aplicação
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