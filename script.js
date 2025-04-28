const wordInput = document.getElementById("wordInput");
const highlightedText = document.getElementById("highlightedText");
const netWpmDisplay = document.getElementById("netWpm");
const grossWpmDisplay = document.getElementById("grossWpm");
const accuracyDisplay = document.getElementById("accuracy");
const errorDisplay = document.getElementById("errors");
const resultMessage = document.getElementById("resultMessage");
const progressBar = document.getElementById("progress-bar");

let words = [];
let currentWordIndex = 0;
let correctWords = 0;
let totalErrors = 0;
let startTime = null;
let totalCharacters = 0;
let typedCharacters = 0;
let testStarted = false;

// Start test
function startTest() {
  testStarted = false;
  startTime = null;

  const paragraph = paragraphs[Math.floor(Math.random() * paragraphs.length)];
  words = paragraph.trim().split(/\s+/);
  currentWordIndex = 0;
  correctWords = 0;
  totalErrors = 0;
  totalCharacters = paragraph.length;
  typedCharacters = 0;

  netWpmDisplay.innerText = 0;
  grossWpmDisplay.innerText = 0;
  accuracyDisplay.innerText = "0%";
  errorDisplay.innerText = 0;
  resultMessage.classList.remove("show");
  progressBar.style.width = "0%";
  progressBar.style.backgroundColor = "green";

  wordInput.value = "";
  wordInput.disabled = false;
  wordInput.focus();

  renderWords();
}

// Render words on screen
function renderWords() {
  highlightedText.innerHTML = words
    .map((word, idx) => {
      return `<span id="word-${idx}" class="word">${word
        .split("")
        .map((char, i) => `<span id="char-${idx}-${i}">${char}</span>`)
        .join("")}</span>`;
    })
    .join(" ");
  updateCursor(0);
  updateActiveWordHighlight();
}

// Update blinking cursor
function updateCursor(charIndex) {
  document.querySelectorAll(".cursor").forEach((el) => el.classList.remove("cursor"));
  const charSpan = document.getElementById(`char-${currentWordIndex}-${charIndex}`);
  if (charSpan) charSpan.classList.add("cursor");
}

// Highlight current word
function updateActiveWordHighlight() {
  document.querySelectorAll(".word").forEach((el) => el.classList.remove("active-word"));
  const current = document.getElementById(`word-${currentWordIndex}`);
  if (current) current.classList.add("active-word");
}

// Update statistics
function updateStats() {
  const elapsedTime = (new Date() - startTime) / 60000;
  const grossWPM = Math.round((typedCharacters / 5) / elapsedTime || 0);
  let netWPM = Math.max(0, Math.round(((typedCharacters / 5) - totalErrors) / elapsedTime || 0));
  const accuracy = ((correctWords / (currentWordIndex || 1)) * 100).toFixed(1);

  if (accuracy < 20) {
    netWPM = 0;
  }

  netWpmDisplay.innerText = netWPM;
  grossWpmDisplay.innerText = grossWPM;
  accuracyDisplay.innerText = `${accuracy}%`;
  errorDisplay.innerText = totalErrors;

  if (accuracy >= 90) {
    progressBar.style.backgroundColor = "green";
  } else if (accuracy >= 60) {
    progressBar.style.backgroundColor = "orange";
  } else {
    progressBar.style.backgroundColor = "red";
  }
}

// Update progress bar
function updateProgressBar() {
  const progress = Math.min((typedCharacters / totalCharacters) * 100, 100);
  progressBar.style.width = `${progress}%`;
}

// End the game
function endGame() {
  wordInput.disabled = true;
  resultMessage.innerText = `🎉 Finished! Net WPM: ${netWpmDisplay.innerText} | Accuracy: ${accuracyDisplay.innerText}`;
  resultMessage.classList.add("show");
  progressBar.style.width = '100%';
}

// Input Handler
wordInput.addEventListener("input", function (e) {
  if (!testStarted) {
    startTime = new Date();
    testStarted = true;
  }

  let typed = wordInput.value;

  // If space pressed OR last word typed completely
  if (typed.endsWith(' ') || (currentWordIndex === words.length - 1 && typed.trim() === words[currentWordIndex])) {
    const typedWord = typed.trim();
    const correctWord = words[currentWordIndex];
    const wordSpan = document.getElementById(`word-${currentWordIndex}`);

    if (typedWord === correctWord) {
      wordSpan.classList.add("correct");
      correctWords++;
    } else {
      wordSpan.classList.add("incorrect");
      totalErrors++;
    }

    currentWordIndex++;
    wordInput.value = "";

    updateStats();
    updateCursor(0);
    updateActiveWordHighlight();

    if (currentWordIndex >= words.length) {
      endGame();
    }
    return;
  }

  const currentWord = words[currentWordIndex];
  const wordSpan = document.getElementById(`word-${currentWordIndex}`);

  Array.from(wordSpan.children).forEach((charSpan) => {
    if (charSpan.classList.contains("extra-typed")) {
      charSpan.remove();
    } else {
      charSpan.className = "";
    }
  });

  for (let i = 0; i < typed.length; i++) {
    if (i < currentWord.length) {
      if (typed[i] === currentWord[i]) {
        wordSpan.children[i].className = "correct";
      } else {
        wordSpan.children[i].className = "incorrect";
      }
    } else {
      const extraCharSpan = document.createElement("span");
      extraCharSpan.classList.add("extra-typed");
      extraCharSpan.innerText = typed[i];
      wordSpan.appendChild(extraCharSpan);
    }
  }

  updateCursor(typed.length);
  typedCharacters = document.querySelectorAll(".correct, .incorrect, .extra-typed").length;
  updateProgressBar();
});

// Retest with Tab Key
document.addEventListener("keydown", function (e) {
  if (e.key === "Tab") {
    e.preventDefault();
    startTest();
  }
});

// Theme Toggle
function toggleTheme() {
  document.body.classList.toggle("dark");
}

// Multiplayer Button
function startMultiplayer() {
  alert("🎮 Multiplayer mode coming soon!");
}

window.onload = startTest;
