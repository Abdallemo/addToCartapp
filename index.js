import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js';
import { getDatabase, ref, push, onValue, remove } from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js';

const appSettingRtdb = {
    apiKey: "AIzaSyDXXsB3JWMybmsPodLLjdUBzSj9PG-JWF0",
    authDomain: "favsubmition.firebaseapp.com",
    databaseURL: "https://favsubmition-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "favsubmition",
    storageBucket: "favsubmition.appspot.com",
    messagingSenderId: "431244103576",
    appId: "1:431244103576:web:6d642ab0e0631f42c765ed"
};

const App = initializeApp(appSettingRtdb);
const database = getDatabase(App);
const auth = getAuth(App);

const shippingList = document.getElementById("shippingList");
const inputField = document.getElementById("input-field");
const buttonField = document.getElementById("button-field");

// Added others
const registerEmail = document.getElementById("register-email");
const registerPassword = document.getElementById("register-password");
const registerButton = document.getElementById("register-button");
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const loginButton = document.getElementById("login-button");
const logoutButton = document.getElementById("logout-button");
const authForms = document.getElementById("auth-forms");
const addToCart = document.getElementById("add-to-cart");

let userCartRef; // Declare userCartRef at a higher scope

const modal = document.getElementById("myModal");
const modalText = document.getElementById("modal-text");
const closeModal = document.getElementsByClassName("close")[0];

// Register user
registerButton.onclick = function() {
    createUserWithEmailAndPassword(auth, registerEmail.value, registerPassword.value)
        .then(userCredential => {
            showModal("User registered successfully!");
            
        })
        .catch(error => {
            showModal("Error registering user: " + error.message);
        });
};

// Login user
loginButton.onclick = function() {
    signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value)
        .then(userCredential => {
            showModal("User logged in successfully!");

        })
        .catch(error => {
            showModal("Error logging in user: " + error.message);
        });
};

// Logout user
logoutButton.onclick = function() {
    signOut(auth).then(() => {
        showModal("User logged out successfully!");
            loginEmail.value = "";
            loginPassword.value = "";
            registerEmail.value = "";
            registerPassword.value = "";

    }).catch(error => {
        showModal("Error logging out: " + error.message);
    });
};

// Monitor auth state
onAuthStateChanged(auth, user => {
    if (user) {
        authForms.style.display = "none";
        addToCart.style.display = "flex";
        setupUserCart(user.uid);
    } else {
        authForms.style.display = "flex";
        addToCart.style.display = "none";
    }
});

// Set up user-specific cart
function setupUserCart(uid) {
    userCartRef = ref(database, `users/${uid}/cart`);

    buttonField.onclick = function() {
        let value = inputField.value;
        push(userCartRef, value);
        clearInputField();
    };

    onValue(userCartRef, function(snapshot) {
        if (snapshot.exists()) {
            let moviesArray = Object.entries(snapshot.val());
            clearShpnList();
            for (let i = 0; i < moviesArray.length; i++) {
                let currentItem = moviesArray[i];
                let currentItemID = currentItem[0];
                let currentItemValue = currentItem[1];
                appendtoShpnList(currentItem);
            }
        } else {
            shippingList.innerHTML = "No items yet....";
        }
    });
}

function clearInputField() {
    inputField.value = "";
}

function appendtoShpnList(item) {
    let itemID = item[0];
    let itemValue = item[1];
    let newElm = document.createElement("li");
    newElm.textContent = itemValue;

    newElm.addEventListener("click", function() {
        let exactLocationInDB = ref(database, `users/${auth.currentUser.uid}/cart/${itemID}`);
        remove(exactLocationInDB);
    });
    shippingList.append(newElm);
}

function clearShpnList() {
    shippingList.innerHTML = "";
}

function showModal(message) {
    modalText.textContent = message;
    modal.style.display = "block";
}

// Close the modal
closeModal.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}