const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow} = electron;

let mainWindow;

// Listen if app is ready

app.on('ready', function () {
    // creat the main window
    mainWindow = new BrowserWindow({});
    // Load main HTML file
    mainWindow.loadURL(
        url.format ({
            pathname: path.join(__dirname, 'main.html'),
            protocol:'file:',
            slashes: true
        })
    )
});
