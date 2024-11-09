import { getAuth, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, deleteUser } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { db } from "./firebaseInit.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const auth = getAuth();
const loginForm = document.getElementById("loginForm");
const registrationForm = document.getElementById("registrationForm");
const usernameDisplay = document.getElementById("usernameDisplay");


const showRegisterFormButton = document.getElementById("showRegisterForm");
const showLoginFormButton = document.getElementById("showLoginForm");

showRegisterFormButton?.addEventListener("click", () => {
    loginForm.style.display = "none";
    registrationForm.style.display = "block";
});

showLoginFormButton?.addEventListener("click", () => {
    registrationForm.style.display = "none";
    loginForm.style.display = "block";
});


const logoutButton = document.getElementById("logoutButton");
logoutButton?.addEventListener("click", async () => {
    await signOut(auth);
    alert("You have logged out.");
    window.location.href = "login.html";
});


const deleteAccountButton = document.getElementById("deleteAccountButton");
deleteAccountButton?.addEventListener("click", async () => {
    const user = auth.currentUser;
    if(user) {
        try{
            await deleteUser(user);
            authlert("Your account has been deleted.");
            window.location.href = "login.html";
        } catch (error){
            console.error("error deleting account:", error);
        }
    }
});


loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;

    try{
        await signInWithEmailAndPassword(auth, email, password);
        displayUsername();
        window.location.href = "index.html";   //
    } catch (error) {
        console.error("login error:", error);
        alert(error.message);
    }
});


registrationForm?.addEventListener("submit", async (e) =>{
    e.preventDefault();
    const email = registrationForm.email.value;
    const password = registrationForm.password.value;
    const username = registrationForm.username.value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
            username: username
        });

        alert("Registration successful! You can now log in.");
        registrationForm.reset();
        loginForm.style.display = "block";
        registrationForm.style.display = "none";
    } catch (error) {
        console.error("Registration error:", error);
        alert(error.message);
    }
});


async function displayUsername() {
    const user = auth.currentUser;
    if (user) {
        const userDoc = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDoc);
        if (docSnap.exists()) {
            const userData = docSnap.data();
            usernameDisplay.textContent = userData.username;
            usernameDisplay.style.display = "block";
        }
    } else {
        usernameDisplay.style.display = "none";
    }
}

auth.onAuthStateChanged(user => {
    if (user) {
        displayUsername();
    } else {
        usernameDisplay.style.display = "none";
    }
});