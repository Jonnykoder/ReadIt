//Electron Module 
const { Menu, shell } = require('electron')


//Module function to create main app menu
module.exports = appWin => {

    //Menu Template
    let template = [
        {
            label: 'items',
            submenu: [
                {
                    label: 'Add new',
                    accelerator: 'CmdOrCtrl+O',
                    click: () => {
                        appWin.send('menu-show-modal') //transmit IPC send to "menu-show-modal" channel
                    }
                },
                {
                    label: 'Read Item',
                    accelerator: 'CmdOrCtrl+Enter',
                    click: () => {
                        appWin.send('menu-open-item')
                    }
                },
                {
                    label: 'Delete Item',
                    accelerator: 'CmdOrCtrl+Backspace',
                    click: () => {
                        appWin.send('menu-delete-item')
                    }
                },
                {
                    label: 'Open in Browser',
                    accelerator: 'CmdOrCtrl+Shift+Enter',
                    click: () => {
                        appWin.send('menu-open-item-native')
                    }
                },
                {
                    label: 'Search Items',
                    accelerator: 'CmdOrCtrl+S',
                    click: () => {
                        appWin.send('menu-focus-search')
                    }
                }
            ]
        },
        {
            role: 'editMenu'
        },
        {
            role: 'windowMenu'
        },
        {
            role: 'help',
            submenu: [
                {
                    label: 'Learn more',
                    click: () => {
                        shell.openExternal('https://github.com/stackacademytv/master-electron')
                    }
                }
            ]
        }
    ]

    //Create Mac app menu
    if (process.platform === 'darwin') template.unshift({ role: 'appMenu' })

    //Build Menu
    let menu = Menu.buildFromTemplate(template)

    //Set as main app menu
    Menu.setApplicationMenu(menu)

}