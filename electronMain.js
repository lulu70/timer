// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, ipcMain } = require('electron')


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
  // mainWindow.loadFile('./build/index.html')
  mainWindow.loadURL('http://localhost:3000')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    // app.quit()
    mainWindow = null
  })
  mainWindow.setPosition(760, 190)
  const menu = Menu.buildFromTemplate([
    {
      label: 'Timer',
      submenu: [
        {
          label: 'One Screen Mode',
          accelerator: process.platform == 'darwin' ? '1' : '1',
          click() {
            if (mainWindow == null) {
              createWindow()
            }
            if (preferencesWin != null) {
              preferencesWin.close()
            }
            mainWindow.webContents.send('twoScreenMode', false)
          }
        },
        {
          label: 'Two Screen Mode',
          accelerator: process.platform == 'darwin' ? '2' : '2',
          click() {
            if (mainWindow == null) {
              createWindow()
            }
            if (preferencesWin == null) {
              createPreferensecWindow()
            }
            mainWindow.webContents.send('twoScreenMode', true)
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Close Timer',
          accelerator: process.platform == 'darwin' ? 'Command+W' : 'Ctrl+W',
          click() {
            const window = BrowserWindow.getFocusedWindow()
            window.close()
          }
        },
        {
          label: 'Quit Timer',
          accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
          click() {
            app.quit()
          }
        }
      ]
    }
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
  // preferencesWin.loadFile('./build/index.html')
  preferencesWin.loadURL('http://localhost:3002')
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
  preferencesWin.setPosition(37, 115)
}

//catch messages from preferences window

ipcMain.on('timer', function(e, timer) {
  mainWindow.webContents.send('timer', timer)
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function() {
  createWindow()
  createPreferensecWindow()
})

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (!process.platform == 'darwin') app.quit()
})

// app.on('activate', function() {
//   // On OS X it's common to re-create a window in the app when the
//   // dock icon is clicked and there are no other windows open.
//   if (mainWindow === null) {
//     createWindow()
//   }
// })
