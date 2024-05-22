
import {initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js"
import { getDatabase ,ref, push, onValue,remove} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js"

const appSetting = {
    databaseURL:"https://favsubmition-default-rtdb.asia-southeast1.firebasedatabase.app"
}

const App = initializeApp(appSetting)
console.log(App)

const database = getDatabase(App)
const mangainDb = ref(database,"manga")
const moviesinDb = ref(database, "movies")
const shippingList =  document.getElementById("shippingList")
const inputField = document.getElementById("input-field")
const buttonField = document.getElementById("button-field")

buttonField.onclick = function () {
    let value = inputField.value
    push(mangainDb,value)

    clearInputField()

}


onValue(mangainDb, function(snapshot){

    if (snapshot.exists()) {
        let moviesArray = Object.entries(snapshot.val())

        clearShpnList()

        for (let i = 0; i < moviesArray.length; i++) 
        {
            let currentItem = moviesArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            appendtoShpnList(currentItem)
        
        }
    }else
    {
     shippingList.innerHTML= "no items yet...."
    }

    let moviesArray = Object.entries(snapshot.val())

    clearShpnList()

    for (let i = 0; i < moviesArray.length; i++) {
        let currentItem = moviesArray[i]
        let currentItemID = currentItem[0]
        let currentItemValue = currentItem[1]
        appendtoShpnList(currentItem)
        
    }
})


function clearInputField() {
    inputField.value ="" 
}
function appendtoShpnList(item) {
    let itemID = item[0]
    let itemValue = item[1]

    let newElm = document.createElement("li")
    newElm.textContent = itemValue

    newElm.addEventListener("click",function()
    {
        let excatLoctionInDB = ref(database,`manga/${itemID}`)
        remove(excatLoctionInDB)

    })
    shippingList.append(newElm)

    
}
function clearShpnList() {
    shippingList.innerHTML = ""
}