const electron = require('electron');
const url = require('url');
const path = require('path');
const {app, BrowserWindow, Menu, dialog, ipcMain} = electron;

let mainWindow;

// Open dialog options
let openDialogOptions = {
    title : "Select CSV file", 
    buttonLabel : "Open",
    filters :[
        { name: 'CSV', extensions: ['csv'] }
    ],
     properties: ['openFile', 'openDirectory', 'multiSelections']
}

// Listen if app is ready
app.on('ready', createMainWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
  
app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createMainWindow()
    }
})

function createMainWindow() {
    mainWindow = new BrowserWindow({ 
        width: 800, height: 600,
        webPreferences: {  nodeIntegration: true } 
     }) //new BrowserWindow({});
    // Load main HTML file
    mainWindow.loadFile('main.html')
    // Debugging
    mainWindow.webContents.openDevTools()
    
    // create menus
    createMenu();
    
    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}


function createMenu() {
    let isMac = process.platform === 'darwin'
    const template = [
        ...(process.platform === 'darwin' ? [{
            label: app.getName(),
            submenu: [
              { role: 'about' },
              { type: 'separator' },
              { role: 'services' },
              { type: 'separator' },
              { role: 'hide' },
              { role: 'hideothers' },
              { role: 'unhide' },
              { type: 'separator' },
              { role: 'quit' }
            ]
          }] : []),
        {
            label: 'File',
            submenu: [
                {label: "New File"},
                {label: "New Window"},
                {type: 'separator' },
                {
                    label: "Open",
                    accelerator: 'CmdOrCtrl+O',
                    click (){
                        dialog.showOpenDialog(mainWindow, openDialogOptions, (filePaths) => {
                            let file = filePaths[0]
                            mainWindow.webContents.send('file-opened', file);
                            console.log(filePaths[0])
                        });
                     }
                },
                {label: "Open Recent"},
                {type: 'separator' },
                {label: "Save"},
                {label: "Save as..."},
                { type: 'separator' },
                 isMac ? { role: 'close' } : { role: 'quit' }
            ]
        },
        {
            label: 'Edit',
            submenu: [
              { role: 'undo' },
              { role: 'redo' },
              { type: 'separator' },
              { role: 'cut' },
              { role: 'copy' },
              { role: 'paste' },
              ...(isMac ? [
                { role: 'pasteAndMatchStyle' },
                { role: 'delete' },
                { role: 'selectAll' },
                { type: 'separator' },
                {
                  label: 'Speech',
                  submenu: [
                    { role: 'startspeaking' },
                    { role: 'stopspeaking' }
                  ]
                }
              ] : [
                { role: 'delete' },
                { type: 'separator' },
                { role: 'selectAll' }
              ])
            ]
        },
        {
            label: 'View',
            submenu: [
              { role: 'reload' },
              { role: 'forcereload' },
              { role: 'toggledevtools' },
              { type: 'separator' },
              { role: 'resetzoom' },
              { role: 'zoomin' },
              { role: 'zoomout' },
              { type: 'separator' },
              { role: 'togglefullscreen' }
            ]
        },
        {
            label: 'Window',
            submenu: [
              { role: 'minimize' },
              { role: 'zoom' },
              ...(isMac ? [
                { type: 'separator' },
                { role: 'front' },
                { type: 'separator' },
                { role: 'window' }
              ] : [
                { role: 'close' }
              ])
            ]
        },
        {
        role: 'help',
            submenu: [
                {
                    label: 'Learn More',
                    click () { 
                        require('electron').shell.openExternalSync('https://electronjs.org')
                    }
                }
            ]
        } 
    ];
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
}

// ********
// This section demonstrates how to pass data back and 
// forth between the main process and a render process
// (a web page/html file)

// Listens for an 'update' event from a renderer
ipcMain.on('update', (event, arg) => {
    // sends arg to the renderer
    win.webContents.send('target', arg)
    console.log('arg:'+arg)
  })
  
  ipcMain.on('asynchronous-message', (event, count) => {
    console.log(count) // prints "ping"
    // event.reply('asynchronous-reply', 'pong') // Doesn't work for some reason???
    const data = []
    for (let i = 0; i < count; i += 1) {
      data.push(Math.random())
    }
    win.webContents.send('asynchronous-reply', data)
  })
  
  ipcMain.on('file-opened', (event, arg) => {
    console.log('arg-----:'+arg) // prints "ping"
    event.returnValue = 'pong'
  })