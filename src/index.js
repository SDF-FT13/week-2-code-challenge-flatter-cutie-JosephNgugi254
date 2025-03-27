document.addEventListener("DOMContentLoaded", () => {
    const characterBar = document.getElementById("character-bar");
    const voteForm = document.getElementById("votes-form");
    const resetButton = document.getElementById("reset-btn");
    let currentCharacter;

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

            const mrCute = characters.find((character) => character.name === "Mr. Cute");
            if (mrCute) {
                displayCharacterDetails(mrCute);
            }
        })
        .catch(error => console.error("Error fetching characters:", error));

    
    voteForm.addEventListener("submit", (event) => {
        event.preventDefault(); 
        
        const votesInput = document.getElementById("votes");
        const voteCountElement = document.getElementById("vote-count");
        const additionalVotes = parseInt(votesInput.value, 10);

        if (!isNaN(additionalVotes) && currentCharacter) {
            const newVoteCount = currentCharacter.votes + additionalVotes;
            
            
            voteCountElement.textContent = newVoteCount;
            
            
            fetch(`http://localhost:3000/characters/${currentCharacter.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ votes: newVoteCount })
            })
            .then(response => {
                if (response.ok) {
                    currentCharacter.votes = newVoteCount; 
                } else {
                    
                    voteCountElement.textContent = currentCharacter.votes;
                    console.error("Failed to update votes on server");
                }
            })
            .catch(error => {
                
                voteCountElement.textContent = currentCharacter.votes;
                console.error("Network error:", error);
            });
        }
        
        votesInput.value = ""; 
    });

    function displayCharacterDetails(character) {
        currentCharacter = character;
        
        const nameElement = document.getElementById("name");
        const imageElement = document.getElementById("image");
        const voteCountElement = document.getElementById("vote-count");

        nameElement.textContent = character.name;
        imageElement.src = character.image;
        imageElement.alt = character.name;
        voteCountElement.textContent = character.votes;

        resetButton.onclick = () => {
            const originalVotes = currentCharacter.votes;
            voteCountElement.textContent = 0;
            
            fetch(`http://localhost:3000/characters/${currentCharacter.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ votes: 0 })
            })
            .then(response => {
                if (response.ok) {
                    currentCharacter.votes = 0;
                } else {
                    voteCountElement.textContent = originalVotes;
                    console.error("Failed to reset votes");
                }
            })
            .catch(error => {
                voteCountElement.textContent = originalVotes;
                console.error("Network error:", error);
            });
        };
    }
});