const electron = require('electron')
const {app, BrowserWindow, Tray, ipcMain, Notification, Menu} = electron
let mainWindow
let tray = null
let notification = null
app.on('ready', ()=>{
    app.dock.hide()
    mainWindow = new BrowserWindow({
        width:400, height:500,
        frame: false,
        resizable: false,
        webPreferences: {
            nodeIntegration: true
        }
    })
    mainWindow.loadFile('index.html')
    mainWindow.hide()

    tray = new Tray('./images/iconTemplate.png')
    tray.setToolTip('Music App')

    tray.on('click', (event, bounds)=>{
        let {x, y} = bounds
        let {width, height} = mainWindow.getBounds()
        if(mainWindow.isVisible()){
            mainWindow.hide()
        }else{
            mainWindow.setBounds({
                x: x - width/2,
                y,
                width,
                height
            })
            mainWindow.show()
            
        }
    })

    tray.on('right-click', ()=>{
        const contextMenu = Menu.buildFromTemplate([{role: 'quit'}])
        tray.popUpContextMenu(contextMenu)
    })

    mainWindow.on('blur', ()=>{
        mainWindow.hide()
    })

    mainWindow.on('hide', ()=>tray.setHighlightMode('never'))
    mainWindow.on('show', ()=>tray.setHighlightMode('always'))
})

ipcMain.on('playing', (event, song)=>{
    if(Notification.isSupported()){
        notification = new Notification({
            title: "Playing Now",
            body: song,
            silent: true
        })
        notification.show()
    }
})

