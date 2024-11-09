import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { auth, db } from './firebaseInit.js'; // Adjust the import based on your file structure

let waterData = [0, 0, 0, 0, 0, 0, 0]; // Initialize water intake data for the week
let sleepData = [0, 0, 0, 0, 0, 0, 0]; // Initialize sleep data for the week
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Fetch user data from Firestore
async function fetchUserData(userId) {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        waterData = data.waterData || waterData;
        sleepData = data.sleepData || sleepData;
        console.log("User data fetched successfully:", data);
    } else {
        console.log("No user data found. Using default values.");
    }
}

// Save user data to Firestore
async function saveUserData(userId) {
    const docRef = doc(db, "users", userId);
    console.log("Attempting to save data:", { waterData, sleepData });
    try {
        await setDoc(docRef, {
            waterData: waterData,
            sleepData: sleepData
        });
        console.log("Data saved successfully to Firestore.");
    } catch (error) {
        console.error("Error saving data to Firestore:", error);
    }
}

// Event listener for water form
document.getElementById("waterForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    const waterInput = parseInt(document.getElementById("waterInput").value);
    const dayIndex = (new Date().getDay() + 6) % 7;

    console.log("Water intake entered:", waterInput);
    waterData[dayIndex] = waterInput;
    document.getElementById("waterInput").value = '';
    if (auth.currentUser) {
        await saveUserData(auth.currentUser.uid);
    }
    renderCharts();
});

// Event listener for sleep form
document.getElementById("sleepForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    const sleepInput = parseInt(document.getElementById("sleepInput").value);
    const dayIndex = (new Date().getDay() + 6) % 7;

    console.log("Sleep intake entered:", sleepInput);
    sleepData[dayIndex] = sleepInput;
    document.getElementById("sleepInput").value = '';
    if (auth.currentUser) {
        await saveUserData(auth.currentUser.uid);
    }
    renderCharts();
});

// Chart rendering function
let waterChart;
let sleepChart;

function renderCharts() {
    if (waterChart) waterChart.destroy();
    if (sleepChart) sleepChart.destroy();

    const displayWaterData = waterData.every(value => value === 0) ? [0, 0, 0, 0, 0, 0, 0] : waterData;
    const displaySleepData = sleepData.every(value => value === 0) ? [0, 0, 0, 0, 0, 0, 0] : sleepData;

    waterChart = new Chart(document.getElementById("waterChart").getContext("2d"), {
        type: "bar",
        data: {
            labels: days,
            datasets: [{
                label: "Water Intake (Glasses)",
                data: displayWaterData,
                backgroundColor: "#4caf50",
            }]
        },
        options: { responsive: true, scales: { y: { beginAtZero: true, min: 0, max: 10 } } }
    });

    sleepChart = new Chart(document.getElementById("sleepChart").getContext("2d"), {
        type: "bar",
        data: {
            labels: days,
            datasets: [{
                label: "Sleep Duration (Hours)",
                data: displaySleepData,
                backgroundColor: "#2196f3",
            }]
        },
        options: { responsive: true, scales: { y: { beginAtZero: true, min: 0, max: 10 } } }
    });
}

// Usage: Ensure the user is logged in before fetching data
auth.onAuthStateChanged(async (user) => {
    if (user) {
        await fetchUserData(user.uid);
        renderCharts();
    } else {
        console.log("No user is logged in.");
    }
});
renderCharts();
