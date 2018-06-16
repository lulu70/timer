// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 640,
    height: 360,
    webPreferences: {
      nodeIntegration: false,
      preload: __dirname + '/preload.js'
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('./build/index.html')
  // mainWindow.loadURL('http://localhost:3000')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    app.quit()
    mainWindow = null
  })
  const menu = Menu.buildFromTemplate([
    {
      label: 'Timer',
      submenu: [
        {
          label: 'Preferences...',
          accelerator: process.platform == 'darwin' ? 'Command+,' : 'Ctrl+,',
          click() {
            preferencesWin == null && createPreferensecWindow()
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Quit Timer',
          accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
          click() {
            app.quit()
          }
        }
      ]
    },
    //add dev tools in development mode
    // process.env.NODE_ENV !== 'production' && {
    //   label: 'Developer Tools',
    //   submenu: [
    //     {
    //       label: 'Toggle DevTools',
    //       accelerator:
    //         process.platform == 'darwin' ? 'Command+Alt+J' : 'Ctrl+Alt+J,',
    //       click(item, focusedWindow) {
    //         focusedWindow.toggleDevTools()
    //       }
    //     },
    //     {
    //       role: 'reload'
    //     }
    //   ]
    // }
  ])
  Menu.setApplicationMenu(menu)
}

// Create the preferences Window...
let preferencesWin

function createPreferensecWindow() {
  // Create the browser window.
  preferencesWin = new BrowserWindow({
    width: 680,
    height: 500,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      preload: __dirname + '/preload.js'
    },
    title: 'Preferences'
  })

  // and load the index.html of the app.
  preferencesWin.loadFile('./build/index.html')
  // preferencesWin.loadURL('http://localhost:3000/preferences')
  // preferencesWin.loadURL('file://./build/index.html')

  // Open the DevTools.
  // preferencesWin.webContents.openDevTools()

  // Emitted when the window is closed.
  preferencesWin.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    preferencesWin = null
  })
}

//catch color from picker
ipcMain.on('bgColor', function(e, color) {
  mainWindow.webContents.send('bgColor', color)
})

ipcMain.on('textColor', function(e, color) {
  mainWindow.webContents.send('textColor', color)
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  app.quit()
})

app.on('activate', function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})
