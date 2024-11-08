import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { auth } from "./firebaseInit.js"; // Assuming firebaseInit.js initializes Firebase and exports 'auth'

const logoutButton = document.getElementById("logoutButton");

logoutButton?.addEventListener("click", () => {
    signOut(auth)
        .then(() => {
            alert("You have logged out.");
            window.location.href = "login.html"; // Redirect to login page
        })
        .catch((error) => {
            console.error("Logout Error:", error);
        });
});
