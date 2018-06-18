// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, MenuItem, ipcMain } = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let controllerWindow

// function that return the html
const findHtml = win => {
  win === 'main'
    ? mainWindow.loadFile('./builds/main/index.html')
    : // mainWindow.loadURL('http://localhost:3000')
      controllerWindow.loadFile('./builds/controller/index.html')
  // controllerWindow.loadURL('http://localhost:3002')
}

//open with developer tools
const withDevTools = false

//catch messages from controller window
ipcMain.on('timer', (e, timer) => {
  mainWindow.webContents.send('timer', timer)
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createMainWindow()
  // createControllerWindow()
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  app.quit()
})

// app.on('activate', () => {
//   // On OS X it's common to re-create a window in the app when the
//   // dock icon is clicked and there are no other windows open.
//   mainWindow === null && createMainWindow()
// })

//create context menu
const contextMenu = Menu.buildFromTemplate([
  {
    role: 'cut',
  },
  {
    role: 'copy',
  },
  {
    role: 'paste',
  },
  {
    type: 'separator'
  },
  {
    label: 'Screen Modes',
    submenu: [
      {
        label: 'One Screen Mode',
        accelerator: process.platform == 'darwin' ? 'Command+1' : 'Ctrl+1',
        click() {
          mainWindow == null && createMainWindow()
          mainWindow != null && mainWindow.reload()
          controllerWindow != null && controllerWindow.close()
          mainWindow.webContents.send('twoScreenMode', false)
        }
      },
      {
        label: 'Two Screen Mode',
        accelerator: process.platform == 'darwin' ? 'Command+2' : 'Ctrl+2',
        click() {
          mainWindow == null && createMainWindow()
          mainWindow != null && mainWindow.reload()
          controllerWindow == null && createControllerWindow()
          mainWindow.webContents.send('twoScreenMode', true)
        }
      }
    ]
  }
])

const createMainWindow = () => {
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
  findHtml('main')

  // Open the DevTools.
  withDevTools && mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    app.quit()
    mainWindow = null
  })
  mainWindow.setPosition(760, 190)
  mainWindow.setBackgroundColor('#000000')
  const menu = Menu.buildFromTemplate([
    {
      label: 'Timer',
      submenu: [
        {
          label: 'One Screen Mode',
          accelerator: process.platform == 'darwin' ? 'Command+1' : 'Ctrl+1',
          click() {
            mainWindow == null && createMainWindow()
            mainWindow != null && mainWindow.reload()
            controllerWindow != null && controllerWindow.close()
            mainWindow.webContents.send('twoScreenMode', false)
          }
        },
        {
          label: 'Two Screen Mode',
          accelerator: process.platform == 'darwin' ? 'Command+2' : 'Ctrl+2',
          click() {
            mainWindow == null && createMainWindow()
            mainWindow != null && mainWindow.reload()
            controllerWindow == null && createControllerWindow()
            mainWindow.webContents.send('twoScreenMode', true)
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Close...',
          accelerator: process.platform == 'darwin' ? 'Command+W' : 'Ctrl+W',
          click() {
            const window = BrowserWindow.getFocusedWindow()
            window.close()
          }
        },
        {
          label: 'Quit...',
          accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
          click() {
            app.quit()
          }
        }
      ]
    }
  ])
  Menu.setApplicationMenu(menu)

  //attach context menu to windows
  mainWindow.webContents.on('context-menu', (e, { x, y }) => {
    contextMenu.popup(mainWindow, x, y)
  })
}

const createControllerWindow = () => {
  // Create the browser window.
  controllerWindow = new BrowserWindow({
    width: 680,
    height: 500,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      preload: __dirname + '/preload.js'
    }
  })

  // and load the index.html of the app.
  findHtml('controller')

  // Open the DevTools.
  withDevTools && controllerWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  controllerWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    controllerWindow = null
    mainWindow != null && mainWindow.webContents.send('twoScreenMode', false)
  })
  controllerWindow.setPosition(37, 115)
  controllerWindow.setBackgroundColor('#000000')
  controllerWindow.webContents.on('context-menu', (e, { x, y }) => {
    contextMenu.popup(controllerWindow, x, y)
  })
}
