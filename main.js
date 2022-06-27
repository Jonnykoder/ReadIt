// Modules
const electron = require('electron')
const { app, BrowserWindow, Menu, MenuItem, ipcMain } = electron
const ejse = require('ejs-electron')
const windowStateKeeper = require('electron-window-state')
const readItem = require('./controllers/modules/readItem')
const Swal = require('sweetalert2')
const appMenu = require('./controllers/modules/menu')
let mainWindow

//listen for the new item request 
ipcMain.on('new-item', (e, itemUrl) => {
  // console.log(`Message Received: ${itemUrl} `)

  readItem(itemUrl, item => {
    e.sender.send('new-item-success', item)
  })
})

// Create a new BrowserWindow when `app` is ready
function createWindow() {

  //Window state keeper
  let state = windowStateKeeper({
    defaultWidth: 500, defaultHeight: 650
  })

  //Create a new contextMenu rightclick
  const contextMenu = Menu.buildFromTemplate(require('./controllers/modules/contextMenu'))

  mainWindow = new BrowserWindow({
    x: state.x, y: state.y,
    width: state.width, height: state.height,
    minWidth: 350, maxWidth: 650, minHeight: 300,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true
    }
  })

  //Create main app menu
  appMenu(mainWindow.webContents)

  // Load index.html into the new BrowserWindow
  mainWindow.loadFile('./views/main.ejs')

  //Manage new window state
  state.manage(mainWindow)

  // Open DevTools - Remove for PRODUCTION!
  // mainWindow.webContents.openDevTools();

  // Listen for window being closed
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  //get the event context menu  
  mainWindow.webContents.on('context-menu', (e) => {
    contextMenu.popup()
  })


}

// Electron `app` is ready
app.on('ready', createWindow)

// Quit when all windows are closed - (Not macOS - Darwin)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on('activate', () => {
  if (mainWindow === null) createWindow()
})
