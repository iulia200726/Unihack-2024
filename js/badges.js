import { doc, updateDoc, arrayUnion, onSnapshot, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { auth, db } from './firebaseInit.js';

const WATER_GOAL = 6;
const SLEEP_GOAL = 8;
const badgeList = document.getElementById("badgeList");

// Mapping of badge names to their specific images
const badgeImages = {
    "Hydration Hero: Consumed 6+ glasses of water in a day.": "../html/Leonardo_Phoenix_a_stylized_modern_and_minimalist_illustration_1-removebg-preview-removebg-preview.png",
    "Sleep Champion: Slept 8+ hours in a day.": "../html/Leonardo_Phoenix_A_circular_badge_featuring_a_serene_glowing_f_3-removebg-preview.png"
};

auth.onAuthStateChanged(user => {
    if (user) {
        console.log("User is authenticated, starting badge checks...");
        displayBadges(user.uid);
        watchUserIntakeForBadges(user.uid);
    } else {
        console.log("No user authenticated.");
    }
});

// Function to display badges as cards
async function displayBadges(userId) {
    const userRef = doc(db, "users", userId);
    const docSnapshot = await getDoc(userRef);

    badgeList.innerHTML = ""; // Clear existing badges in case of re-render

    if (docSnapshot.exists()) {
        const badges = docSnapshot.data().badges || [];
        
        if (badges.length === 0) {
            // If no badges, display a message
            const noBadgeMessage = document.createElement("p");
            noBadgeMessage.textContent = "No badges earned today.";
            noBadgeMessage.classList.add("no-badge-message");
            badgeList.appendChild(noBadgeMessage);
        } else {
            badges.forEach(badge => {
                const badgeCard = document.createElement("li");
                badgeCard.classList.add("badge-card");

                // Check if the badge has a specific image and use it
                const badgeImage = badgeImages[badge] || "path/to/default-badge.jpg";

                // Card structure for each badge
                badgeCard.innerHTML = `
                    <img src="${badgeImage}" alt="${badge}" class="badge-image">
                    <h4>${badge}</h4>
                `;

                badgeList.appendChild(badgeCard);
            });
        }
        console.log("Displayed badges:", badges);
    } else {
        console.log("No badges found for the user.");
    }
}

// Function to watch intake data for badge updates
const watchUserIntakeForBadges = (userId) => {
    const userRef = doc(db, "users", userId);
    onSnapshot(userRef, async (docSnapshot) => {
        if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            const dailyWaterIntake = userData.waterData[(new Date().getDay() + 6) % 7] || 0;
            const dailySleepIntake = userData.sleepData[(new Date().getDay() + 6) % 7] || 0;

            console.log(`Real-time Intake Data - Water: ${dailyWaterIntake}, Sleep: ${dailySleepIntake}`);

            let newBadges = [];

            if (dailyWaterIntake >= WATER_GOAL) {
                newBadges.push("Hydration Hero: Consumed 6+ glasses of water in a day.");
            }
            if (dailySleepIntake >= SLEEP_GOAL) {
                newBadges.push("Sleep Champion: Slept 8+ hours in a day.");
            }

            if (newBadges.length > 0) {
                await updateDoc(userRef, {
                    badges: arrayUnion(...newBadges)
                });
                console.log("New badges added:", newBadges);
                displayBadges(userId); // Refresh the badge list
            } else {
                console.log("No new badges to add.");
            }
        } else {
            console.log("User document does not exist.");
        }
    });
};
