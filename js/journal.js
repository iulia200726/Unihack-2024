import { getAuth, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { db } from "./firebaseInit.js";
import { addDoc, collection, getDocs, query, where, orderBy } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const auth = getAuth();
const entryList = document.getElementById("entryList");
const journalForm = document.getElementById("journalForm");
const entryInput = document.getElementById("entryInput");

// Fetch and display the user's journal entries
const fetchUserEntries = async () => {
    entryList.innerHTML = ""; // Clear the list before rendering

    if (auth.currentUser) {
        const userEntriesQuery = query(
            collection(db, "journalEntries"),
            where("userId", "==", auth.currentUser.uid),
            orderBy("createdAt", "desc") // Order by creation time
        );
        const entriesSnapshot = await getDocs(userEntriesQuery);

        entriesSnapshot.forEach((doc) => {
            const entry = doc.data();
            const li = document.createElement("li");
            li.textContent = entry.entry;
            entryList.appendChild(li); // Append to the entry list
        });
    }
};

// Call fetchUserEntries on page load if user is logged in
auth.onAuthStateChanged((user) => {
    if (user) fetchUserEntries();
});

// Handle adding a new journal entry
journalForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const entryText = entryInput.value;

    if (entryText && auth.currentUser) {
        try {
            await addDoc(collection(db, "journalEntries"), {
                entry: entryText,
                createdAt: new Date(),
                userId: auth.currentUser.uid, // Associate entry with the logged-in user
            });
            entryInput.value = ""; // Clear input after submission
            fetchUserEntries(); // Refresh the list to include the new entry
        } catch (error) {
            console.error("Error adding entry:", error);
        }
    }
});