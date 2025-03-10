/**
 * Arquivos de pré carregamento (MAIS DESEMPENHO) e reforço de segurança na comunicação entre processos (IPC)
 */
 

// importação dos recursos do framework electron
// contextBriedge (segurança) ipcRendere(comunicação)
const {contextBridge, ipcRenderer}= require('electron')

// expor (autorizar a comunicação entre processos)
contextBridge.exposeInMainWorld('api', {
    clientWindow:() => ipcRenderer.send('client-window'),
    ordemWindow:() => ipcRenderer.send('ordem-window')
})