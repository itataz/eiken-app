document.addEventListener('DOMContentLoaded', () => {
    const startButtons = document.querySelectorAll('.certification-card .btn');
    const mainContent = document.querySelector('.mockup-container');
    const loadingSpinner = document.getElementById('loading-spinner');
    let currentQuestionIndex = 0;
    let score = 0;
    let questions = [];
    let incorrectAnswers = []; // Array to store incorrectly answered questions
    let currentSubQuestionIndex = 0; // For reading comprehension
    let timer;
    let timeLeft = 30;

    const questionsByLevel = {
        "英検3級": [
            {
                type: "multiple-choice",
                question: "A: Did you enjoy your trip to Kyoto? B: Yes, it was ( ). I want to go there again.",
                choices: ["boring", "fun", "sad", "difficult"],
                answer: "fun",
                audio: "audio/eiken3_q1.mp3" // Placeholder audio file
            },
            {
                type: "multiple-choice",
                question: "A: Where is my camera? B: It's ( ) the table.",
                choices: ["on", "in", "under", "at"],
                answer: "on"
            },
            {
                type: "fill-in-the-blank",
                question: "I always have ____ for breakfast.",
                answer: "eggs"
            }
        ],
        "英検準2級": [
            {
                type: "multiple-choice",
                question: "A: I'm going to the store. Do you need anything? B: Yes, could you buy a ( ) of milk?",
                choices: ["carton", "loaf", "bunch", "pair"],
                answer: "carton"
            },
            {
                type: "multiple-choice",
                question: "It is important to ( ) a good relationship with your co-workers.",
                choices: ["maintain", "contain", "detain", "pertain"],
                answer: "maintain"
            },
            {
                type: "fill-in-the-blank",
                question: "She is good ____ playing the piano.",
                answer: "at"
            }
        ],
        "英検2級": [
            {
                type: "multiple-choice",
                question: "The company's new environmental policy has been widely ( ).",
                choices: ["praised", "phrased", "raised", "grazed"],
                answer: "praised"
            },
            {
                type: "multiple-choice",
                question: "The government has ( ) a new plan to reduce unemployment.",
                choices: ["implemented", "complimented", "supplemented", "implanted"],
                answer: "implemented"
            },
            {
                type: "fill-in-the-blank",
                question: "He is interested ____ learning new languages.",
                answer: "in"
            }
        ],
        "英検1級": [
            {
                type: "multiple-choice",
                question: "The CEO's charismatic leadership was instrumental in ( ) the company through the economic downturn.",
                choices: ["navigating", "oscillating", "perpetuating", "extricating"],
                answer: "navigating"
            },
            {
                type: "multiple-choice",
                question: "The committee's decision was met with widespread ( ) from environmental groups.",
                choices: ["acclaim", "dissent", "consensus", "compliance"],
                answer: "dissent"
            },
            {
                type: "fill-in-the-blank",
                question: "The ancient ruins were gradually ____ by vegetation over centuries.",
                answer: "engulfed"
            },
            {
                type: "reading-comprehension",
                passage: "Global warming, also referred to as climate change, is the observed century-scale rise in the average temperature of Earth's climate system and its related effects. Multiple lines of scientific evidence show that the climate system is warming. Many of the observed changes since the 1950s are unprecedented in the instrumental temperature record, and in paleoclimate proxy records covering thousands to millions of years. Scientific understanding of global warming has increased due to new data, and improved understanding of the climate system. The Intergovernmental Panel on Climate Change (IPCC) concludes that \"it is unequivocal that human influence has warmed the atmosphere, ocean, and land.\"",
                subQuestions: [
                    {
                        question: "What is another term for global warming?",
                        choices: ["Weather change", "Atmospheric shift", "Climate change", "Temperature fluctuation"],
                        answer: "Climate change"
                    },
                    {
                        question: "According to the passage, when did many of the observed changes in the climate system become unprecedented?",
                        choices: ["Since the 1800s", "Since the 1950s", "In recent years", "Over thousands of years"],
                        answer: "Since the 1950s"
                    }
                ]
            }
        ]
    };

    // Load saved scores on page load
    loadScores();

    async function loadScores() {
        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser) {
            const certificationCards = document.querySelectorAll('.certification-card');
            certificationCards.forEach(card => {
                const lastScoreDiv = card.querySelector('.last-score');
                if (lastScoreDiv) {
                    lastScoreDiv.innerHTML = '<p>ログインしてスコアを保存</p>';
                }
            });
            return;
        }

        const response = await fetch(`http://localhost:3000/scores/${currentUser}`);
        const savedScores = await response.json();
        console.log(`Loaded Scores for ${currentUser}:`, savedScores);

        const certificationCards = document.querySelectorAll('.certification-card');
        certificationCards.forEach(card => {
            const level = card.querySelector('h3').textContent;
            const lastScoreDiv = card.querySelector('.last-score');
            if (lastScoreDiv) {
                if (savedScores[level]) {
                    const { score, total, date } = savedScores[level];
                    lastScoreDiv.innerHTML = `<p><strong>最終スコア: ${score} / ${total}</strong><br><small>${date}</small></p>`;
                } else {
                    lastScoreDiv.innerHTML = `<p>まだプレイしていません</p>`;
                }
            }
        });
    }

    async function saveScore(level, score, totalQuestions) {
        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser) {
            return; // Don't save if no one is logged in.
        }
        
        await fetch(`http://localhost:3000/scores/${currentUser}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ level, score, total: totalQuestions })
        });
    }

    // Attach event listener to the clear scores button
    const clearScoresBtn = document.getElementById('clear-scores-btn');
    if (clearScoresBtn) {
        clearScoresBtn.addEventListener('click', () => {
            alert('この機能はバックエンド移行により削除されました。');
        });
    }

    // Modal Handling
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const closeButtons = document.querySelectorAll('.close-btn');

    loginBtn.addEventListener('click', () => {
        loginModal.style.display = 'block';
    });

    registerBtn.addEventListener('click', () => {
        registerModal.style.display = 'block';
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            loginModal.style.display = 'none';
            registerModal.style.display = 'none';
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target == loginModal) {
            loginModal.style.display = 'none';
        }
        if (event.target == registerModal) {
            registerModal.style.display = 'none';
        }
    });

    // Registration Form Handling
    const registerForm = document.getElementById('register-form');
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;
        
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            registerModal.style.display = 'none';
            loginModal.style.display = 'block';
        } else {
            alert(data.message);
        }
    });

    // Login Form Handling
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('currentUser', data.username);
            alert(data.message);
            loginModal.style.display = 'none';
            updateUIForLoggedInUser();
            loadScores();
        } else {
            alert(data.message);
        }
    });

    function updateUIForLoggedInUser() {
        const currentUser = localStorage.getItem('currentUser');
        const userActions = document.querySelector('.user-actions');
        if (currentUser) {
            userActions.innerHTML = `
                <span>こんにちは, ${currentUser}さん</span>
                <button id="logout-btn" class="btn">ログアウト</button>
            `;
            document.getElementById('logout-btn').addEventListener('click', () => {
                localStorage.removeItem('currentUser');
                alert('ログアウトしました。');
                window.location.reload();
            });
        }
    }

    // Check for logged in user on page load
    updateUIForLoggedInUser();



    startButtons.forEach(button => {
        button.addEventListener('click', async (e) => { // Added async here
            e.preventDefault();
            const card = e.target.closest('.certification-card');
            const level = card.querySelector('h3').textContent;
            
            if (e.target.classList.contains('coming-soon')) {
                alert(`「${level}」は現在準備中です。`);
            } else {
                if (questionsByLevel[level]) {
                    // Show spinner before starting quiz
                    loadingSpinner.style.display = 'flex';
                    mainContent.classList.add('fade-out'); // Start fade-out animation
                    
                    // Simulate loading delay (e.g., fetching questions from a server)
                    await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
                    
                    questions = questionsByLevel[level];
                    incorrectAnswers = []; // Clear incorrect answers at the start of a new quiz
                    startQuiz(level);
                } else {
                    alert(`「${level}」の問題はまだありません。`);
                }
            }
        });
    });

    function startQuiz(level) {
        currentQuestionIndex = 0;
        currentSubQuestionIndex = 0; // Reset for new quiz
        score = 0;
        loadingSpinner.style.display = 'none'; // Hide spinner
        mainContent.classList.remove('fade-out'); // Remove fade-out class
        mainContent.classList.add('fade-in'); // Add fade-in animation
        mainContent.style.display = 'block'; // Show main content
        mainContent.innerHTML = `
            <div class="quiz-container">
                <div id="timer"></div>
                <div id="question-container"></div>
                <button id="next-btn" class="btn" style="display: none;">次の問題へ</button>
            </div>
        `;
        // Remove fade-in class after animation completes
        mainContent.addEventListener('animationend', () => {
            mainContent.classList.remove('fade-in');
        }, { once: true });
        showQuestion(level);
    }

    function showQuestion(level) {
        clearInterval(timer);
        timeLeft = 30;
        const questionContainer = document.getElementById('question-container');
        const nextBtn = document.getElementById('next-btn');
        const timerDisplay = document.getElementById('timer');
        timerDisplay.textContent = `残り時間: ${timeLeft}秒`;
        nextBtn.style.display = 'none';

        const question = questions[currentQuestionIndex];
        let questionHtml = `<h2>問題 ${currentQuestionIndex + 1}</h2>`;
        if (question.audio) {
            questionHtml += `<audio controls autoplay src="${question.audio}"></audio>`;
        }
        
        if (question.type === "reading-comprehension") {
            questionHtml += `<div class="reading-passage"><h4>長文読解:</h4><p>${question.passage}</p></div>`;
            question.subQuestions.forEach((subQ, index) => {
                questionHtml += `<div class="sub-question" data-sub-q-index="${index}">
                                    <p>${String.fromCharCode(65 + index)}. ${subQ.question}</p>
                                    <div class="choices sub-choices">
                                        ${subQ.choices.map(choice => `<button class="choice-btn" data-parent-q-index="${currentQuestionIndex}" data-sub-q-index="${index}">${choice}</button>`).join('')}
                                    </div>
                                </div>`;
            });
            // Next button visible for reading comprehension to move to next main question
            nextBtn.style.display = 'block';
        } else {
            questionHtml += `<p>${question.question}</p>`;
        }

        if (question.type === "multiple-choice") {
            questionHtml += `<div class="choices">${question.choices.map(choice => `<button class="choice-btn">${choice}</button>`).join('')}</div>`;
        } else if (question.type === "fill-in-the-blank") {
            questionHtml += `<div class="fill-in-the-blank">
                                <input type="text" id="blank-answer" placeholder="解答を入力">
                                <button id="submit-blank" class="btn">解答する</button>
                             </div>`;
        }
        questionContainer.innerHTML = questionHtml;

        timer = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = `残り時間: ${timeLeft}秒`;
            if (timeLeft <= 0) {
                clearInterval(timer);
                if (question.type === "reading-comprehension") {
                    // For reading comprehension, mark all remaining sub-questions as incorrect
                    handleReadingComprehensionTimeout(level);
                } else {
                    handleAnswer(null, level, question.type);
                }
            }
        }, 1000);

        if (question.type === "multiple-choice") {
            const choiceButtons = document.querySelectorAll('.choice-btn');
            choiceButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    clearInterval(timer);
                    handleAnswer(e.target, level, question.type);
                });
            });
        } else if (question.type === "fill-in-the-blank") {
            document.getElementById('submit-blank').addEventListener('click', () => {
                clearInterval(timer);
                handleAnswer(document.getElementById('blank-answer'), level, question.type);
            });
        } else if (question.type === "reading-comprehension") {
            const subChoiceButtons = document.querySelectorAll('.sub-choices .choice-btn');
            subChoiceButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    // Don't clear timer immediately for sub-questions, allow user to answer all
                    // Clear timer only when the next main question is clicked or time runs out
                    const parentQIndex = parseInt(e.target.dataset.parentQIndex);
                    const subQIndex = parseInt(e.target.dataset.subQIndex);
                    handleSubAnswer(e.target, level, parentQIndex, subQIndex);
                });
            });
        }

        nextBtn.addEventListener('click', () => {
            currentQuestionIndex++;
            currentSubQuestionIndex = 0; // Reset sub-question index for next main question
            if (currentQuestionIndex < questions.length) {
                showQuestion(level);
            } else {
                showResults(level);
            }
        });
    }

    function handleReadingComprehensionTimeout(level) {
        const question = questions[currentQuestionIndex];
        question.subQuestions.forEach((subQ, index) => {
            // Mark all unanswered sub-questions as incorrect
            const subQuestionElement = document.querySelector(`.sub-question[data-sub-q-index="${index}"]`);
            if (!subQuestionElement.classList.contains('answered')) {
                // Simulate incorrect answer and push to incorrectAnswers
                incorrectAnswers.push({ ...question, subQuestionIndex: index });
                // Visually mark as incorrect
                const correctButton = subQuestionElement.querySelector(`.choice-btn[data-answer="${subQ.answer.toLowerCase().trim()}"]`);
                if (correctButton) {
                    correctButton.classList.add('correct');
                }
                const choiceButtons = subQuestionElement.querySelectorAll('.choice-btn');
                choiceButtons.forEach(btn => btn.classList.add('disabled'));
            }
        });
        document.getElementById('next-btn').style.display = 'block';
    }

    function handleSubAnswer(selectedButton, level, parentQIndex, subQIndex) {
        const parentQuestion = questions[parentQIndex];
        const subQuestion = parentQuestion.subQuestions[subQIndex];
        const correctAnswer = subQuestion.answer.toLowerCase().trim();
        const selectedAnswer = selectedButton.textContent.toLowerCase().trim();
        let isCorrect = false;

        if (selectedAnswer === correctAnswer) {
            isCorrect = true;
            score++;
        } else {
            incorrectAnswers.push({ ...parentQuestion, subQuestionIndex: subQIndex });
        }

        const subQuestionElement = document.querySelector(`.sub-question[data-sub-q-index="${subQIndex}"]`);
        subQuestionElement.classList.add('answered'); // Mark this sub-question as answered

        const choiceButtons = subQuestionElement.querySelectorAll('.choice-btn');
        choiceButtons.forEach(btn => {
            btn.classList.add('disabled');
            if (btn.textContent.toLowerCase().trim() === correctAnswer) {
                btn.classList.add('correct');
            }
        });
        
        if (!isCorrect) {
            selectedButton.classList.add('incorrect');
        } else {
            selectedButton.classList.add('correct');
        }
    }

    function handleAnswer(selectedElement, level, type) {
        const question = questions[currentQuestionIndex];
        const correctAnswer = question.answer.toLowerCase().trim();
        let isCorrect = false;

        if (type === "multiple-choice") {
            const selectedAnswer = selectedElement.textContent;
            if (selectedAnswer === correctAnswer) {
                isCorrect = true;
            }

            const choiceButtons = document.querySelectorAll('.choice-btn');
            choiceButtons.forEach(btn => {
                btn.classList.add('disabled');
                if (btn.textContent.toLowerCase().trim() === correctAnswer) {
                    btn.classList.add('correct');
                }
            });

            if (selectedElement) {
                if (!isCorrect) {
                    selectedElement.classList.add('incorrect');
                    incorrectAnswers.push(question); // Add to incorrect answers
                } else {
                    selectedElement.classList.add('correct');
                }
            }
        } else if (type === "fill-in-the-blank") {
            const userAnswer = selectedElement ? selectedElement.value.toLowerCase().trim() : '';
            if (userAnswer === correctAnswer) {
                isCorrect = true;
            }

            const blankInput = document.getElementById('blank-answer');
            const submitButton = document.getElementById('submit-blank');
            if (blankInput) {
                blankInput.disabled = true;
                if (isCorrect) {
                    blankInput.style.backgroundColor = '#d4edda'; // Correct color
                } else {
                    blankInput.style.backgroundColor = '#f8d7da'; // Incorrect color
                    // Optionally show the correct answer near the input
                    const correctDisplay = document.createElement('p');
                    correctDisplay.textContent = `正解: ${question.answer}`;
                    correctDisplay.style.color = '#155724';
                    blankInput.parentNode.insertBefore(correctDisplay, submitButton);
                    if (!isCorrect) {
                        incorrectAnswers.push(question); // Add to incorrect answers
                    }
                }
            }
            if (submitButton) {
                submitButton.classList.add('disabled');
            }
        } else if (type === "reading-comprehension") {
            // For reading comprehension, answers are handled by handleSubAnswer
            // This 'handleAnswer' function is called only on timeout, in which case it is incorrect.
            if (!selectedElement) { // If called due to timeout
                incorrectAnswers.push(question); // Push the whole reading comprehension question
            }
        }

        if (isCorrect) {
            score++;
        }
        
        document.getElementById('next-btn').style.display = 'block';
    }

    function showResults(level) {
        saveScore(level, score, questions.length);
        mainContent.innerHTML = `
            <div class="quiz-container">
                <h2>クイズ終了！</h2>
                <p>あなたのスコアは ${score} / ${questions.length} です。</p>
                ${incorrectAnswers.length > 0 ? `<button id="review-btn" class="btn">間違えた問題を復習</button>` : ''}
                <button id="back-btn" class="btn">級選択に戻る</button>
            </div>
        `;
        document.getElementById('back-btn').addEventListener('click', () => {
            window.location.reload();
        });

        if (incorrectAnswers.length > 0) {
            document.getElementById('review-btn').addEventListener('click', () => {
                questions = incorrectAnswers; // Set questions to only the incorrect ones
                currentQuestionIndex = 0;
                score = 0; // Reset score for review mode
                incorrectAnswers = []; // Clear for next review
                startQuiz(level); // Re-use startQuiz for review
            });
        }
    }
});
