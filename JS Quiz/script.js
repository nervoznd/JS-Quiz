const questions = [
    {
        question: "How many planets are in the solar system?",
        options: ["8", "9", "10", "11"],
        answer: ["8"]
    },
    {
        question: "What is the freezing point of water?",
        options: ["0", "-5", "-6", "-10"],
        answer: ["0"]
    },
    {
        question: "What is the longest river in the world?",
        options: ["Nile", "Amazon", "Yangtze", "Dnepr"],
        answer: ["Amazon"]
    },
    {
        question: "How many chromosomes are in the human genome?",
        options: ["42", "45", "46", "52"],
        answer: ["46"]
    },
    {
        question: "What is the capital of Canada?",
        options: ["Toronto", "Ottawa", "Vancouver", "Montreal"],
        answer: ["Ottawa"]
    },
    {
        question: "What are the primary colors?",
        options: ["Red", "Green", "Blue", "Yellow"],
        answer: ["Red", "Blue", "Yellow"]
    }
];

let currentQuestionIndex = 0;
let score = 0;

let timerInterval;
let timeLeft = 20;

const tque = document.getElementById('tque');
const qid = document.getElementById('qid');
const question = document.getElementById('question');
const questionOptions = document.getElementById('question-options');
const nextButton = document.getElementById('next');
const quizContainer = document.getElementById('quiz');
const resultContainer = document.getElementById('result');
const scoreDisplay = document.getElementById('score');
const totalDisplay = document.getElementById('total');
const restartButton = document.getElementById('restart');
const timer = document.getElementById('timer');

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
    timeLeft = 20;
    updateTimerDisplay();
}

function updateTimer() {
    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        checkAnswers();
        return;
    }
    timeLeft--;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    if (timeLeft < 10) {
        timer.classList.add('ends');
    } else {
        timer.classList.remove('ends');
    }
}

function loadQuestion(index) {
    const q = questions[index];
    qid.textContent = (index + 1) + '.';
    question.textContent = q.question;
    tque.textContent = (index + 1) + '/' + questions.length;
    questionOptions.innerHTML = '';

    q.options.forEach((option, i) => {
        const optionElement = document.createElement('div');
        const optionType = q.answer.length === 1 ? 'radio' : 'checkbox';

        optionElement.classList.add('option-block');
        optionElement.innerHTML = `
            <input type="${optionType}" name="option" id="option${i}" value="${option}">
            <label for="option${i}">${option}</label>
        `;
        questionOptions.appendChild(optionElement);
    });

    if (index === questions.length - 1) {
        nextButton.textContent = "Submit";
    } else {
        nextButton.textContent = "Next";
    }
    resetTimer();
    startTimer();
}

function checkAnswer(selectedOptions) {
    const correctAnswers = questions[currentQuestionIndex].answer;
    if (selectedOptions && selectedOptions.length === correctAnswers.length && selectedOptions.every(option => correctAnswers.includes(option.value))) {
        return true;
    }
    return false;
}

function checkAnswers() {
    const selectedOptions = Array.from(document.querySelectorAll('input[name="option"]:checked'));
    const isCorrect = checkAnswer(selectedOptions);
    if (isCorrect) {
        score++;
        nextButton.classList.add('correct');
    } else {
        nextButton.classList.add('incorrect');
    }
    setTimeout(() => {
        nextButton.classList.remove('correct', 'incorrect');
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            loadQuestion(currentQuestionIndex);
        } else {
            showResults();
        }
    }, 1000);
}

function showResults() {
    quizContainer.classList.add('hidden');
    resultContainer.classList.remove('hidden');
    scoreDisplay.textContent = score;
    totalDisplay.textContent = questions.length;
}

nextButton.addEventListener('click', function (e) {
    e.preventDefault();
    checkAnswers();
});

restartButton.addEventListener('click', function (e) {
    e.preventDefault();
    currentQuestionIndex = 0;
    score = 0;
    quizContainer.classList.remove('hidden');
    resultContainer.classList.add('hidden');
    loadQuestion(currentQuestionIndex);
});

document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.classList.toggle('dark-theme', savedTheme === 'dark');
    }

    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        
        const isDarkTheme = document.body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
    });
});

loadQuestion(currentQuestionIndex);