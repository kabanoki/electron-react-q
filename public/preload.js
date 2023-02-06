const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  onReceiveMessage: (listener) => {
    ipcRenderer.on(
      'quiz-start',(e, message) => listener(e,message));
  },
})
