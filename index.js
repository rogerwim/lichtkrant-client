const electron = require('electron');
const { app, BrowserWindow, ipcMain } = electron;
const net = require('net');

let win;
function createWindow() {
    win = new BrowserWindow({
        width: 900,
        height: 600,
        webPreferences: {
            preload: app.getAppPath() + "/preload.js",
            webviewTag: true
        }
    });
    win.removeMenu();
    win.loadFile('public/index.html');
    win.on('closed', () => {
        win = null;
    });
}

app.whenReady().then(createWindow);

let client;
ipcMain.on("disconnect", (event, arg) => {
    client.destroy();
});
ipcMain.on('connect', (event, arg) => {
    client = new net.Socket();
    client.connect({
        port: arg.port,
        host: arg.ip
    } , function() {
    });

    client.on('data', function(data) {
        win.webContents.send('data', data.toString());
    });

    client.on('close', function() {
        win.webContents.send("close");
    });

    client.on("connect", function() {
        win.webContents.send("connected");
    });

    client.on('error', function(err) {
        win.webContents.send("error", err);
    });
});

ipcMain.on("send", (event, arg) => {
    client.write(arg);
});