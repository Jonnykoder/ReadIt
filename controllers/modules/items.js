const { shell } = require('electron');
const fs = require('fs')


//DOM Nodes
let items = document.getElementById('items'),
    readItem = document.getElementsByClassName('read-item');


// Get ReaderJS content
let readerJS
fs.readFile(`${__dirname}/reader.js`, (err, data) => {
    readerJS = data.toString()
})

//Track items in the storage 
exports.storage = JSON.parse(localStorage.getItem('items-data')) || []

// Listen for 'done' message from the reader window 
window.addEventListener('message', e => {

    if (e.data.action === 'delete-reader-item') {
        this.delete(e.data.itemIndex)

        //Close the reader window for the user
        e.source.close()
    }


})




//Delete the selected item
exports.delete = itemIndex => {
    //Remove the item from the DOM
    items.removeChild(this.getSelectedItem().node)

    //Remove the item from the storage
    this.storage.splice(itemIndex, 1)

    //Persist the storage
    this.save()

    //Select the previous item or new top item
    if (this.storage.length) {

        //Get new selected item index
        let = newSelectedItemIndex = (itemIndex === 0) ? 0 : itemIndex - 1

        //Select item at new index
        document.getElementsByClassName('read-item')[newSelectedItemIndex].classList.add('selected')
    }
}

//get the selected item index
exports.getSelectedItem = () => {

    //Get selected node
    let currentItem = document.getElementsByClassName('read-item selected')[0]

    // Get the item index 
    let itemIndex = 0
    let child = currentItem
    while ((child = child.previousElementSibling) != null) itemIndex++

    //Return selected item and index
    return { node: currentItem, index: itemIndex }
}

//Persist storage
exports.save = () => {
    localStorage.setItem('items-data', JSON.stringify(this.storage))
}

//set the item as selected
exports.select = e => {

    //Remove currently selected item class
    this.getSelectedItem().node.classList.remove('selected')

    //add class to the selected object
    e.currentTarget.classList.add('selected')
}

//Open selected item in native browser 
exports.openNative = () => {
    //Only if we have items (in case of menu open)
    if (!this.storage.length) return //if there is no items in the storage array 

    //Get selected item
    let selectedItem = this.getSelectedItem()

    // Get the selected item's URL
    let contentURL = selectedItem.node.dataset.url

    //open in user's default system browser 
    shell.openExternal(contentURL)
}

//Open Selected Item
exports.open = () => {
    //Only if we have items (in case of menu open)
    if (!this.storage.length) return //if there is no items in the storage array 

    //Get selected item
    let selectedItem = this.getSelectedItem()

    // Get the selected item's URL
    let contentURL = selectedItem.node.dataset.url

    //Open selected Item in a proxy browser window
    let readerWin = window.open(contentURL, '', `
        maxWidth=2000,
        maxHeight=2000, 
        width = 1200, 
        height =800 , 
        backgroundColor = #DEDEDE, 
        nodeIntegration=0,
        contextIsolation = 1
    `)

    //Inject Javascript with specific item index(selectedItem. index)
    readerWin.eval(readerJS.replace('{{index}}', selectedItem.index))
}

//Move to the newly selected item
exports.changeSelection = direction => {
    //Get selected item
    let currentItem = this.getSelectedItem()

    //Handle up or down
    if (direction === 'ArrowUp' && currentItem.previousElementSibling) {
        currentItem.node.classList.remove('selected')
        currentItem.node.previousElementSibling.classList.add('selected')
    } else if (direction === 'ArrowDown' && currentItem.nextElementSibling) {
        currentItem.node.classList.remove('selected')
        currentItem.node.nextElementSibling.classList.add('selected')
    }
}

//adding of item 
exports.addItem = (item, isNew = false) => {
    //Create a new DOM node
    let itemNode = document.createElement('div')

    // Set Item url as data attribute
    itemNode.setAttribute('data-url', item.url)

    // //Assign the "read-item" class to itemNode var
    itemNode.setAttribute('class', 'read-item')

    // //Add the innerHTML value
    itemNode.innerHTML = `<img src="${item.screenshot}"><h2>${item.title}</h2>`

    // //Append new node to "items"
    items.appendChild(itemNode)

    //Attach a click handler to select 
    itemNode.addEventListener('click', this.select)

    // Attach doubleclick handler to open 
    itemNode.addEventListener('dblclick', this.open)

    //If this is the first item , select it 
    if (readItem.length === 1) {
        itemNode.classList.add('selected')
    }

    //add items to the local storage and persist that array to local
    if (isNew) {
        this.storage.push(item)
        this.save()
    }
}


//Add items from storage when app loads 
this.storage.forEach(item => {
    this.addItem(item)
})