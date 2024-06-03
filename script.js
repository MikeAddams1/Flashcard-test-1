let flashcards = [];
let currentIndex = 0;

const form = document.getElementById('add-flashcard-form');
const flashcardContainer = document.getElementById('flashcard-container');
const prevButton = document.getElementById('prev-card');
const nextButton = document.getElementById('next-card');
const shuffleButton = document.getElementById('shuffle-cards');
const rewordButton = document.getElementById('reword-flashcard');

form.addEventListener('submit', function(event) {
    event.preventDefault();
    const question = document.getElementById('question').value;
    const answer = document.getElementById('answer').value;
    flashcards.push({ question, answer });
    document.getElementById('question').value = '';
    document.getElementById('answer').value = '';
    currentIndex = flashcards.length - 1;
    updateFlashcard();
    updateButtons();
});

prevButton.addEventListener('click', function() {
    if (currentIndex > 0) {
        currentIndex--;
        updateFlashcard();
        updateButtons();
    }
});

nextButton.addEventListener('click', function() {
    if (currentIndex < flashcards.length - 1) {
        currentIndex++;
        updateFlashcard();
        updateButtons();
    }
});

shuffleButton.addEventListener('click', function() {
    shuffleFlashcards();
    currentIndex = 0;
    updateFlashcard();
    updateButtons();
});

rewordButton.addEventListener('click', function() {
    const questionInput = document.getElementById('question');
    rewordText(questionInput.value)
        .then(rewordedText => {
            questionInput.value = rewordedText;
        })
        .catch(error => {
            console.error('Error rewording text:', error);
        });
});

async function rewordText(text) {
    const response = await fetch('http://127.0.0.1:5000/reword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: text })
    });

    if (!response.ok) {
        throw new Error('Failed to reword text');
    }

    const data = await response.json();
    return data.reworded_text;
}

function updateFlashcard() {
    if (flashcards.length === 0) {
        flashcardContainer.innerHTML = '<p>No flashcards yet. Add some!</p>';
    } else {
        const flashcard = flashcards[currentIndex];
        flashcardContainer.innerHTML = `
            <div class="flashcard">
                <p><strong>Question:</strong> ${flashcard.question}</p>
                <button onclick="revealAnswer()">Show Answer</button>
                <p class="answer" style="display: none;"><strong>Answer:</strong> ${flashcard.answer}</p>
            </div>
        `;
    }
}

function revealAnswer() {
    const answerElement = document.querySelector('.flashcard .answer');
    if (answerElement) {
        answerElement.style.display = 'block';
    }
}

function updateButtons() {
    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === flashcards.length - 1;
}

function shuffleFlashcards() {
    for (let i = flashcards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [flashcards[i], flashcards[j]] = [flashcards[j], flashcards[i]];
    }
}

updateFlashcard();
updateButtons();
