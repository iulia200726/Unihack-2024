const usernameDisplay = document.getElementById("usernameDisplay");
const dropdownContent = document.getElementById("dropdownContent");

// Show username in the navbar
usernameDisplay.addEventListener("click", () => {
    // Toggle dropdown visibility
    dropdownContent.style.display = dropdownContent.style.display === "block" ? "none" : "block"; 
});

// Close dropdown if clicked outside
window.addEventListener("click", (event) => {
    if (!event.target.matches('#usernameDisplay') && !event.target.matches('#userImage')) {
        dropdownContent.style.display = "none"; // Hide dropdown content if clicking outside
    }
});
