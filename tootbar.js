
const { remote } = require('electron');
const { Menu, MenuItem, dialog } = remote;

var importButton, exportButton;

// Open dialog options
let openDialogOptions = {
  title : "Select CSV file", 
  buttonLabel : "Open",
  filters :[
      { name: 'CSV', extensions: ['csv'] }
  ],
   properties: ['openFile', 'openDirectory', 'multiSelections']
}

function handleImportButton() {
    console.log("import click")
    dialog.showOpenDialog(openDialogOptions, (filePaths) => {
      let file = filePaths[0]
      window.webContents.send('file-opened', file);
      console.log(filePaths[0])
  });
}

function handleExportButton() {
    console.log("import click")
}

function initContextMenu() {
  menu = new Menu();
  menu.append(new MenuItem({
    label: 'Copy',
    click: function() {
      clipboard.writeText(editor.getSelection(), 'copy');
    }
  }));
  menu.append(new MenuItem({
    label: 'Cut',
    click: function() {
      clipboard.writeText(editor.getSelection(), 'copy');
      editor.replaceSelection('');
    }
  }));
  menu.append(new MenuItem({
    label: 'Paste',
    click: function() {
      editor.replaceSelection(clipboard.readText('copy'));
    }
  }));

  window.addEventListener('contextmenu', function(ev) { 
    ev.preventDefault();
    menu.popup(remote.getCurrentWindow(), ev.x, ev.y);
  }, false);
}

onload = function() {

  initContextMenu();

  importButton = document.getElementById("import");
  exportButton = document.getElementById("export");
  
  importButton.addEventListener("click", handleImportButton);
  exportButton.addEventListener("click", handleExportButton);
}