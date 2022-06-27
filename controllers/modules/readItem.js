//Modules
/*
1. Offscreen Renderer
2. Load Item Url
3. Retrieve the item Screenshot and Title
*/
const electron = require('electron')
const { BrowserWindow } = electron

//Offscreen Renderer
let offScreenWindow;


//Exported readItem Module
module.exports = (url, callback) => {
    // console.log(`test export url  : ${url}`)
    //Create the offscreen window
    offScreenWindow = new BrowserWindow({
        width: 500,
        height: 500,
        show: false,
        webPreferences: {
            offscreen: true
        }
    })

    //load item URL
    offScreenWindow.loadURL(url)

    //wait for the content to load 
    offScreenWindow.webContents.on('did-finish-load', e => {

        //get the page title
        let title = offScreenWindow.getTitle()


        //get the screenshot(thumbnail)
        offScreenWindow.webContents.capturePage().then(image => {

            //get image as a dataUrl
            let screenshot = image.toDataURL()

            //Execute Callback with the new item object 
            callback({
                title, screenshot, url
            })

            //Cleanup
            offScreenWindow.close()
            offScreenWindow = null
        })
    })
}