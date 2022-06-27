//User Interface logic here 


const { ipcRenderer } = require('electron')
const items = require('./modules/items')

// assigning DOM object by their variables
let showModal = document.getElementById('show-modal'),
    closeModal = document.getElementById('close-modal'),
    modal = document.getElementById('modal'),
    itemUrl = document.getElementById('url'),
    addItem = document.getElementById('add-item'),
    notice = document.getElementById('notice'),
    searchItem = document.getElementById('search');

let classNameData = document.getElementsByClassName('read-item');

// Open modal from menu
ipcRenderer.on('menu-show-modal', () => {
    showModal.click()
})

//Open selected item from menu
ipcRenderer.on('menu-open-item', () => {
    items.open()
})

//Delete item from Menu
ipcRenderer.on('menu-delete-item', () => {
    let selectedItem = items.getSelectedItem()
    items.delete(selectedItem.index)
})

//Open item in native browser from menu
ipcRenderer.on('menu-open-item-native', () => {
    items.openNative()
})

//Search item from the menu
ipcRenderer.on('menu-focus-search', () => {
    searchItem.focus()
})

// Filter Items with 'search'
searchItem.addEventListener('keyup', (e) => {
    //loop items?
    Array.from(classNameData).forEach(item => {
        //hide any items that dont match the search value 
        let hasMatch = item.innerText.toLowerCase().includes(searchItem.value)
        // item.style.display = hasMatch ? 'flex' : 'none'
        if (hasMatch == true) {
            item.style.display = 'flex'
        }
        else {
            item.style.display = 'none'
        }
    })
})
//Navigate each item by pressign the key up and down button 
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        items.changeSelection(e.key)
    }
})

//Disable and Enable modal button when adding new Url
const toggleModalButtons = () => {
    //check the state of buttons
    if (addItem.disabled === true) {
        addItem.disabled = false
        addItem.style.opacity = 1
        addItem.innerHTML = 'Add Item'
        closeModal.style.display = 'inline'
    } else {
        addItem.disabled = true
        addItem.style.opacity = 0.5
        addItem.innerHTML = 'Adding..'
        closeModal.style.display = 'none'
    }
}
//Show Modal
showModal.addEventListener('click', e => {
    modal.style.display = 'flex';
    itemUrl.focus();
})

//close Modal
closeModal.addEventListener('click', e => {
    modal.style.display = 'none';
})

//Handle new item
addItem.addEventListener('click', e => {
    let URLVALUE = itemUrl.value
    if (URLVALUE) {
        //Send new item url to main process
        ipcRenderer.send('new-item', URLVALUE)
        console.log(`Message Sent: ${itemUrl.value}`)
        toggleModalButtons()
    }
})

//Listen for the incoming response from Main Process
ipcRenderer.on('new-item-success', (e, newItem) => {
    // console.log(newItem)

    //Add newItem to the new Item element
    items.addItem(newItem, true)


    //Enable the button
    toggleModalButtons()

    //hide modal and clear the value 
    modal.style.display = 'none'
    itemUrl.value = ''

})


//listen for key event
itemUrl.addEventListener('keyup', e => {

    if (e.key === 'Enter') addItem.click();
})

