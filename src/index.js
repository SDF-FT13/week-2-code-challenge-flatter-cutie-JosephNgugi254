// Global variable to track the current character
let currentCharacter = null;

// Fetch and render characters
function fetchCharacters() {
    const characterBar = document.getElementById("character-bar");    
    fetch("http://localhost:3000/characters")
        .then((response) => response.json())
        .then((characters) => {
            characterBar.innerHTML = ""; // Clear character bar before adding new characters
            characters.forEach((character) => {
                const span = document.createElement("span");
                span.textContent = character.name;
                span.style.cursor = "pointer";
                span.addEventListener("click", () => {
                    currentCharacter = character;
                    displayCharacterDetails(character);
                });
                characterBar.appendChild(span);
            });

            // Set "Mr. Cute" as default only if no character is selected
            if (!currentCharacter) {
                const mrCute = characters.find((character) => character.name === "Mr. Cute");
                if (mrCute) {
                    currentCharacter = mrCute;
                    displayCharacterDetails(mrCute);
                }
            }
        })
        .catch((error) => console.error("Error fetching characters:", error));
}

// Display character details
function displayCharacterDetails(character) {
    const nameElement = document.getElementById("name");
    const imageElement = document.getElementById("image");
    const voteCountElement = document.getElementById("vote-count");

    nameElement.textContent = character.name;
    imageElement.src = character.image;
    imageElement.alt = character.name;
    voteCountElement.textContent = character.votes;
}

// Handle vote submission
function handleVoteSubmission(event) {
    event.preventDefault(); // Prevent page reload
    if (!currentCharacter) return;

    const votesInput = document.getElementById("votes");
    const additionalVotes = parseInt(votesInput.value, 10);
    const voteCountElement = document.getElementById("vote-count");

    if (!isNaN(additionalVotes)) {
        const newVoteCount = currentCharacter.votes + additionalVotes;

        // Update votes in the database
        fetch(`http://localhost:3000/characters/${currentCharacter.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ votes: newVoteCount }),
        })
            .then((response) => response.json())
            .then((updatedCharacter) => {
                currentCharacter.votes = updatedCharacter.votes; // Keep the updated character in memory
                voteCountElement.textContent = updatedCharacter.votes;
            })
            .catch((error) => console.error("Error updating votes:", error));
    }

    votesInput.value = ""; // Clear input
}

// Handle vote reset
function handleVoteReset() {
    if (!currentCharacter) return;

    fetch(`http://localhost:3000/characters/${currentCharacter.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ votes: 0 }),
    })
        .then((response) => response.json())
        .then((updatedCharacter) => {
            currentCharacter.votes = updatedCharacter.votes; // Keep the updated character in memory
            const voteCountElement = document.getElementById("vote-count");
            voteCountElement.textContent = updatedCharacter.votes;
        })
        .catch((error) => console.error("Error resetting votes:", error));
}

// Initialize everything on page load
document.addEventListener("DOMContentLoaded", () => {
    fetchCharacters();

    const voteForm = document.getElementById("votes-form");
    const resetButton = document.getElementById("reset-btn");

    // Attach event listeners
    voteForm.addEventListener("submit", handleVoteSubmission);
    resetButton.addEventListener("click", handleVoteReset);
});
