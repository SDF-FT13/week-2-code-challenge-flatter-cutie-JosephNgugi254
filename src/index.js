// Fetch characters and render them in the character bar
document.addEventListener("DOMContentLoaded", () => {
    const characterBar = document.getElementById("character-bar");
    const detailedInfo = document.getElementById("detailed-info");
    const voteForm = document.getElementById("votes-form");
    const resetButton = document.getElementById("reset-btn");

    fetch("http://localhost:3000/characters")
        .then((response) => response.json())
        .then((characters) => {
            characters.forEach((character) => {
                const span = document.createElement("span");
                span.textContent = character.name;
                span.style.cursor = "pointer";
                span.addEventListener("click", () => displayCharacterDetails(character));
                characterBar.appendChild(span);
            });

            // Display "Mr. Cute" by default
            const mrCute = characters.find((character) => character.name === "Mr. Cute");
            if (mrCute) {
                displayCharacterDetails(mrCute);
            }
        });

    function displayCharacterDetails(character) {
        const nameElement = document.getElementById("name");
        const imageElement = document.getElementById("image");
        const voteCountElement = document.getElementById("vote-count");

        nameElement.textContent = character.name;
        imageElement.src = character.image;
        imageElement.alt = character.name;
        voteCountElement.textContent = character.votes;

        // Handle vote submission
        voteForm.onsubmit = function(event) {
            event.preventDefault(); // Ensure default behavior is prevented
            const votesInput = document.getElementById("votes");
            const additionalVotes = parseInt(votesInput.value, 10);
            if (!isNaN(additionalVotes)) {
                character.votes += additionalVotes;
                voteCountElement.textContent = character.votes;

                // Update the votes in the database
                fetch(`http://localhost:3000/characters/${character.id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ votes: character.votes }),
                });
            }
            votesInput.value = "";
        };

        // Handle vote reset
        resetButton.onclick = () => {
            character.votes = 0;
            voteCountElement.textContent = character.votes;

            // Reset the votes in the database
            fetch(`http://localhost:3000/characters/${character.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ votes: character.votes }),
            });
        };
    }
});