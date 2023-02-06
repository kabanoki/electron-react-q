const {app,BrowserWindow,Menu} = require('electron')
const path = require('path')
const isDev = require("electron-is-dev");

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 850,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
}

app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

const isMac = (process.platform === 'darwin');

const template = Menu.buildFromTemplate([
  ...(isMac ? [{
      label: app.name,
      submenu: [
         {role:'quit',label:`${app.name}を終了`}
      ]
    }] : []),{
    label: 'ファイル',
    submenu: [
      {label:'スタート',click: () => startQuiz() },
      {type:'separator'},
      {role:'quit', label:'終了'}
    ]
  }
]);

Menu.setApplicationMenu(template);

function startQuiz() {
  if(mainWindow !== null) {
    mainWindow.webContents.send('quiz-start', "");
  }
}
