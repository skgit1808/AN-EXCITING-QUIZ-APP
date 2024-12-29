document.getElementById('start-btn').addEventListener('click', startQuiz);
document.getElementById('next-btn').addEventListener('click', nextQuestion);
document.getElementById('retry-btn').addEventListener('click', restartQuiz);

let currentQuestionIndex = 0;
let score = 0;
let quizData = [];
let userAnswers = [];
let interval;
let timeLeft = 60; // Timer for the quiz

// Predefined Questions and Answers for different difficulty levels
const easyQuestions = [
  {
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    correct_answer: "Paris"
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    correct_answer: "Mars"
  },
  {
    question: "Who wrote 'Hamlet'?",
    options: ["Shakespeare", "Dickens", "Austen", "Hemingway"],
    correct_answer: "Shakespeare"
  },
  {
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic", "Indian", "Pacific", "Arctic"],
    correct_answer: "Pacific"
  },
  {
    question: "What is the smallest country in the world?",
    options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"],
    correct_answer: "Vatican City"
  }
];

const mediumQuestions = [
  {
    question: "What is the longest river in the world?",
    options: ["Amazon", "Nile", "Yangtze", "Mississippi"],
    correct_answer: "Nile"
  },
  {
    question: "Who painted the Mona Lisa?",
    options: ["Picasso", "Van Gogh", "Da Vinci", "Michelangelo"],
    correct_answer: "Da Vinci"
  },
  {
    question: "What is the chemical symbol for gold?",
    options: ["Ag", "Au", "Pb", "Fe"],
    correct_answer: "Au"
  },
  {
    question: "Which element has the atomic number 6?",
    options: ["Carbon", "Oxygen", "Nitrogen", "Hydrogen"],
    correct_answer: "Carbon"
  },
  {
    question: "Which country is known as the Land of the Rising Sun?",
    options: ["China", "South Korea", "Japan", "India"],
    correct_answer: "Japan"
  }
];

const hardQuestions = [
  {
    question: "Who was the first person to walk on the moon?",
    options: ["Yuri Gagarin", "Neil Armstrong", "Buzz Aldrin", "John Glenn"],
    correct_answer: "Neil Armstrong"
  },
  {
    question: "What is the hardest natural substance on Earth?",
    options: ["Gold", "Iron", "Diamond", "Platinum"],
    correct_answer: "Diamond"
  },
  {
    question: "What is the speed of light?",
    options: ["3.0 x 10^8 m/s", "2.9 x 10^8 m/s", "3.0 x 10^9 m/s", "2.8 x 10^8 m/s"],
    correct_answer: "3.0 x 10^8 m/s"
  },
  {
    question: "Who developed the theory of relativity?",
    options: ["Isaac Newton", "Albert Einstein", "Galileo Galilei", "Niels Bohr"],
    correct_answer: "Albert Einstein"
  },
  {
    question: "What is the capital city of Australia?",
    options: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
    correct_answer: "Canberra"
  }
];

// Load the audio files for correct and incorrect answers
const correctSound = new Audio('sounds/correct.mp3');
const incorrectSound = new Audio('sounds/incorrect.mp3');

function startQuiz() {
  const difficulty = document.getElementById('difficulty').value;

  // Hide settings
  document.getElementById('quiz-settings').classList.add('hidden');
  
  // Show quiz container
  document.getElementById('quiz').classList.remove('hidden');

  // Reset progress bar
  document.getElementById('progress-bar').style.width = '0%';

  // Select 5 questions based on difficulty
  if (difficulty === 'easy') {
    quizData = easyQuestions;
  } else if (difficulty === 'medium') {
    quizData = mediumQuestions;
  } else if (difficulty === 'hard') {
    quizData = hardQuestions;
  }

  loadQuestion();
  startTimer();
}

function loadQuestion() {
  const currentQuestion = quizData[currentQuestionIndex];
  
  // Update question text
  document.getElementById('question-text').textContent = currentQuestion.question;
  
  // Clear previous options
  const optionsContainer = document.getElementById('options-container');
  optionsContainer.innerHTML = '';

  // Shuffle options
  const allOptions = [...currentQuestion.options];
  shuffleArray(allOptions);

  // Add options to the DOM
  allOptions.forEach(option => {
    const optionBtn = document.createElement('button');
    optionBtn.textContent = option;
    optionBtn.onclick = () => checkAnswer(option, currentQuestion.correct_answer, currentQuestion.question, optionBtn);
    optionsContainer.appendChild(optionBtn);
  });

  // Show Next Button after answering
  document.getElementById('next-btn').classList.remove('hidden');
}

function checkAnswer(selectedAnswer, correctAnswer, question, optionBtn) {
  if (selectedAnswer === correctAnswer) {
    score++;
    optionBtn.classList.add('correct');
    playSound(correctSound);
  } else {
    optionBtn.classList.add('incorrect');
    playSound(incorrectSound);
  }

  // Disable all options after answering
  const optionButtons = document.querySelectorAll('#options-container button');
  optionButtons.forEach(button => {
    button.disabled = true;
    if (button.textContent === correctAnswer) {
      button.classList.add('correct');
    }
    if (button.textContent === selectedAnswer && selectedAnswer !== correctAnswer) {
      button.classList.add('incorrect');
    }
  });

  // Mark the selected option with 'selected' class
  optionBtn.classList.add('selected');

  // Save the answer to the userAnswers array
  userAnswers.push({ question, selectedAnswer, correctAnswer });
}

function playSound(sound) {
  sound.play();  // Play the selected sound
}

function nextQuestion() {
  currentQuestionIndex++;

  // Update progress bar
  const progress = ((currentQuestionIndex / quizData.length) * 100).toFixed(2);
  document.getElementById('progress-bar').style.width = `${progress}%`;

  if (currentQuestionIndex < quizData.length) {
    loadQuestion();
  } else {
    showScore();
  }
}

function showScore() {
  document.getElementById('question-container').classList.add('hidden');
  document.getElementById('next-btn').classList.add('hidden');
  document.getElementById('score').textContent = `${score} / ${quizData.length}`;
  
  // Display answers sheet with the questions and answers
  const answersSheet = document.getElementById('answers-sheet');
  answersSheet.innerHTML = '';
  
  userAnswers.forEach((answer, index) => {
    const questionAnswer = document.createElement('p');
    questionAnswer.innerHTML = `
      <strong>Question ${index + 1}:</strong> ${answer.question} <br>
      <strong>Your Answer:</strong> ${answer.selectedAnswer} <br>
      <strong>Correct Answer:</strong> ${answer.correctAnswer} <br><br>
    `;
    answersSheet.appendChild(questionAnswer);
  });

  document.getElementById('score-container').classList.remove('hidden');
}

function restartQuiz() {
  // Reset all necessary variables
  currentQuestionIndex = 0;
  score = 0;
  userAnswers = [];
  timeLeft = 60;

  // Hide quiz container and show settings
  document.getElementById('quiz').classList.add('hidden');
  document.getElementById('score-container').classList.add('hidden');
  document.getElementById('quiz-settings').classList.remove('hidden');

  // Clear answers sheet and reset the question container
  document.getElementById('answers-sheet').innerHTML = '';
  document.getElementById('question-container').classList.remove('hidden');
  document.getElementById('next-btn').classList.remove('hidden');

  // Reset progress bar
  document.getElementById('progress-bar').style.width = '0%';
}

function startTimer() {
  interval = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) {
      clearInterval(interval);
      showScore();
    }
  }, 1000);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
