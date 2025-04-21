const results = fetch("http://localhost:3000/results")
const onFetchComplete = (result)=> {
    console.log("On Fetch Complete:", result)
}
console.log("Results response:", results)

document.getElementById("startButton").addEventListener("click", async() => {
    document.getElementById("cover-page").style.display = "none";
    fetchQuestions();
});

function fetchQuestions() {
    fetch("http://localhost:3000/results")
        .then(response => response.json())
        .then(data => {
            console.log("API Response:", data);
            if (Array.isArray(data)) {
                startQuiz(data);
                console.log("Questions array found!")
            } else {
                console.error("Data is not an array:", data)
                alert("Invalid data received from API.");
            }
        })
        .catch(error => {
            console.error("Error fetching questions:", error);
            alert("Unable to fetch questions. Please check your API.");
        });
}
function displayQuestions(questions) {
    if (!questions || !Array.isArray(questions)) {
      console.error('Questions data is invalid:', questions);
      quizContainer.innerHTML = '<p>Unable to load questions. Please try again later.</p>';
      return;
    }
  
    quizContainer.innerHTML = ''; 
    questions.forEach((questionData, index) => {
      const questionElement = document.createElement('div');
      questionElement.innerHTML = `
        <p><strong>Question ${index + 1}:</strong> ${questionData.question}</p>
        ${questionData.incorrect_answers
          .concat(questionData.correct_answer) 
          .sort(() => Math.random() - 0.5) 
          .map(answer => `<button class="answerButton">${answer}</button>`) 
          .join('')} <!-- Convert array to string -->
      `;
  
      quizContainer.appendChild(questionElement);
    });
  }

function startQuiz(questions) {
    let currentQuestionIndex = 0;
    let score = 0 
    let missedQuestions = []
    const quizContainer = document.createElement("div");
    quizContainer.id = "quiz-container";
    document.body.appendChild(quizContainer)
    loadQuestion()

    console.log(questions);
    
    function loadQuestion() {
        quizContainer.innerHTML = "";
        const question = questions[currentQuestionIndex];
        if (question && question.question) {
            const questionElement = document.createElement("p");
            questionElement.classList.add("question-text")
            questionElement.textContent = `Question ${currentQuestionIndex + 1}: ${question.question}`;
            quizContainer.appendChild(questionElement);
            const allOptions = question.incorrect_answers.concat(question.correct_answer);
    
            allOptions.sort(() => Math.random() - 0.5); 
            allOptions.forEach((option) => {
                const optionButton = document.createElement("button");
                optionButton.textContent = `${option}`;
                optionButton.addEventListener("click", () => {
                    if (option=== question.correct_answer){
                        alert("Correct! ✅")
                        score++
                    } else alert(`Wrong! ⛔ The correct answer is: ${question.correct_answer}`)
                    missedQuestions.push(question)
                    currentQuestionIndex++;
                    if (currentQuestionIndex < questions.length) {
                        loadQuestion();
                    } else {
                        endQuiz();
                    }
                });
                quizContainer.appendChild(optionButton);
            });
        }
    }
    function endQuiz() {
        quizContainer.innerHTML = "";
        const scoreboard = document.createElement("div");
        scoreboard.id = "score-board" ;
        scoreboard.innerHTML = `
        <h2>Quiz Completed!.</h2>
        <p>Your total score is: ${score} out of ${questions.length}</p>
        `
        
    quizContainer.appendChild(scoreboard);
    if (missedQuestions.length > 0){
        const missedDiv = document.createElement("div")
        missedDiv.id = "missed-questions"
        let missedHTML = "<h3>Correct Answers for Questions You Got Wrong</h3>"
        missedQuestions.forEach(missed => {
            missedHTML += `
            <p>
            <strong>Question: </strong> ${missed.question}<br>
            <strong>correct Answer: </strong> ${missed.correct_answer}
            </p>
            `
        })
        missedDiv.innerHTML= missedHTML
        quizContainer.appendChild(missedDiv)

    }
    const restartButton = document.createElement("button")
    restartButton.textContent = "Restart Game"
    restartButton.addEventListener("click", () => {
        currentQuestionIndex = 0
        score = 0
        missedQuestions = []
        loadQuestion()
    })
quizContainer.appendChild(restartButton)
    }
    loadQuestion();
   }