// CSV data placeholder
let vcNames = [];
let currentVC = {};
let score = 0;
let guessedNames = []; // To track guesses

// Load CSV data
fetch('vc_names.csv')
    .then(response => response.text())
    .then(data => {
        parseCSV(data);
        pickRandomVC();
    })
    .catch(error => {
        console.error('Error loading CSV data:', error);
    });

// Parse CSV data into a list of objects
function parseCSV(data) {
    const lines = data.split('\n');
    lines.forEach((line, index) => {
        // Trim whitespace from the line
        line = line.trim();
        // Skip empty lines
        if (line) {
            // Split by comma
            const parts = line.split(',');
            // Ensure there are exactly two parts
            if (parts.length === 2) {
                const name = parts[0].trim();
                const isReal = parts[1].trim();
                // Check if name and isReal are valid
                if (name && (isReal === 'True' || isReal === 'False')) {
                    vcNames.push({ name: name, isReal: isReal === 'True' });
                } else {
                    console.warn(`Skipping invalid line: ${line}`);
                }
            } else {
                console.warn(`Skipping malformed line: ${line}`);
            }
        }
    });
}

// Pick a random VC name from the dataset
function pickRandomVC() {
    if (vcNames.length === 0) {
        console.error('No VC names available to pick.');
        return;
    }
    const randomIndex = Math.floor(Math.random() * vcNames.length);
    currentVC = vcNames[randomIndex];
    document.getElementById('nameBox').innerText = currentVC.name;
}

// Handle guess
function guess(isReal) {
    if (!currentVC) {
        console.error('No current VC to guess.');
        return;
    }
    
    if (isReal === currentVC.isReal) {
        score++;
        document.getElementById('scoreCount').innerText = score;

        // Add the guess to the list with checkmark
        addGuessToList(currentVC.name, currentVC.isReal, true);

        // Trigger win effect when score reaches 10
        if (score >= 10) {
            showCelebration();
            score = 0; // Reset score after celebration
        } else {
            pickRandomVC();
        }
    } else {
        // Add the guess to the list with X
        addGuessToList(currentVC.name, currentVC.isReal, false);
        alert('Wrong guess! Score reset to 0.');
        score = 0;
        document.getElementById('scoreCount').innerText = score;
        pickRandomVC();
    }
}

// Add guess to the displayed list
function addGuessToList(name, isReal, isCorrect) {
    const guessesList = document.getElementById('guessesList');
    const guessElement = document.createElement('div');
    guessElement.classList.add('guess');

    // Format the guess result
    const resultText = isReal ? 'REAL' : 'FAKE';
    const resultClass = isCorrect ? 'checkmark' : 'x-mark';
    const resultSymbol = isCorrect ? '✔️' : '❌';
    
    guessElement.innerHTML = `
        <span>${name} -> ${resultText}</span>
        <span class="${resultClass}">${resultSymbol}</span>
    `;
    guessesList.appendChild(guessElement);
}

// Show celebration effect
function showCelebration() {
    const modal = document.getElementById('celebrationModal');
    modal.style.visibility = 'visible';
    generateConfetti();

    // Hide celebration after 3 seconds
    setTimeout(() => {
        modal.style.visibility = 'hidden';
        clearConfetti();
        pickRandomVC();
    }, 3000);
}

// Generate confetti effect
function generateConfetti() {
    const confettiContainer = document.getElementById('confettiContainer');
    for (let i = 0; i < 100; i++) {
        const confettiPiece = document.createElement('div');
        confettiPiece.classList.add('confetti-piece');
        confettiPiece.style.left = `${Math.random() * 100}vw`;
        confettiPiece.style.animationDelay = `${Math.random() * 2}s`;
        confettiContainer.appendChild(confettiPiece);
    }
}

// Clear confetti
function clearConfetti() {
    const confettiContainer = document.getElementById('confettiContainer');
    confettiContainer.innerHTML = ''; // Clear all confetti
}
