// Quiz Module - handles question-based learning
class QuizModule {
    constructor(app) {
        this.app = app;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.questions = [];
        this.incorrectAnswers = [];
        this.currentSubQuestionIndex = 0;
        this.timer = null;
        this.timeLeft = 30;
        this.currentLevel = null;
    }

    init() {
        const startButtons = document.querySelectorAll('.certification-card .btn');
        startButtons.forEach(button => {
            button.addEventListener('click', async (e) => {
                e.preventDefault();
                const card = e.target.closest('.certification-card');
                const level = card.querySelector('h3').textContent;

                if (e.target.classList.contains('coming-soon')) {
                    alert(`「${level}」は現在準備中です。`);
                } else {
                    await this.startQuiz(level);
                }
            });
        });
    }

    async startQuiz(level) {
        this.currentLevel = level;

        // Show loading spinner
        const loadingSpinner = document.getElementById('loading-spinner');
        const mainContent = document.getElementById('home-view');

        loadingSpinner.style.display = 'flex';
        mainContent.classList.add('fade-out');

        try {
            // Load questions from JSON file directly
            const response = await fetch('data/questions.json');

            if (!response.ok) {
                throw new Error('Questions not found');
            }

            const allQuestions = await response.json();
            const data = allQuestions[level];

            // Handle different data formats
            if (Array.isArray(data)) {
                this.questions = data;
            } else if (data.vocabulary || data.grammar || data.reading || data.listening) {
                // Combine all categories
                this.questions = [
                    ...(data.vocabulary || []),
                    ...(data.grammar || []),
                    ...(data.reading || []),
                    ...(data.listening || [])
                ];
            } else {
                throw new Error('Invalid question format');
            }

            if (this.questions.length === 0) {
                throw new Error('No questions available');
            }

            // Simulate loading delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            this.incorrectAnswers = [];
            this.showQuizInterface();
        } catch (error) {
            console.error('Failed to load questions:', error);
            alert(`「${level}」の問題データの読み込みに失敗しました。`);
            loadingSpinner.style.display = 'none';
            mainContent.classList.remove('fade-out');
        }
    }

    showQuizInterface() {
        const loadingSpinner = document.getElementById('loading-spinner');
        const mainContent = document.getElementById('home-view');

        this.currentQuestionIndex = 0;
        this.currentSubQuestionIndex = 0;
        this.score = 0;

        loadingSpinner.style.display = 'none';
        mainContent.classList.remove('fade-out');
        mainContent.classList.add('fade-in');

        mainContent.innerHTML = `
            <div class="quiz-container">
                <div id="timer"></div>
                <div id="question-container"></div>
                <button id="next-btn" class="btn" style="display: none;">次の問題へ</button>
            </div>
        `;

        mainContent.addEventListener('animationend', () => {
            mainContent.classList.remove('fade-in');
        }, { once: true });

        this.showQuestion();
    }

    showQuestion() {
        clearInterval(this.timer);
        this.timeLeft = 30;

        const questionContainer = document.getElementById('question-container');
        const nextBtn = document.getElementById('next-btn');
        const timerDisplay = document.getElementById('timer');

        timerDisplay.textContent = `残り時間: ${this.timeLeft}秒`;
        nextBtn.style.display = 'none';

        const question = this.questions[this.currentQuestionIndex];
        let questionHtml = `<h2>問題 ${this.currentQuestionIndex + 1}</h2>`;

        if (question.audio) {
            questionHtml += `<audio controls autoplay src="${question.audio}"></audio>`;
        }

        if (question.type === "reading-comprehension") {
            questionHtml += `<div class="reading-passage"><h4>長文読解:</h4><p>${question.passage}</p></div>`;
            question.subQuestions.forEach((subQ, index) => {
                questionHtml += `<div class="sub-question" data-sub-q-index="${index}">
                                    <p>${String.fromCharCode(65 + index)}. ${subQ.question}</p>
                                    <div class="choices sub-choices">
                                        ${subQ.choices.map(choice => `<button class="choice-btn" data-parent-q-index="${this.currentQuestionIndex}" data-sub-q-index="${index}">${choice}</button>`).join('')}
                                    </div>
                                </div>`;
            });
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
        } else if (question.type === "writing") {
            questionHtml += `<div class="writing-question">
                                <textarea id="writing-answer" placeholder="ここに解答を書いてください" rows="10"></textarea>
                                <button id="submit-writing" class="btn">解答する</button>
                                <p class="writing-note">※ ライティング問題は自己評価してください</p>
                             </div>`;
        }

        questionContainer.innerHTML = questionHtml;

        // Start timer
        this.timer = setInterval(() => {
            this.timeLeft--;
            timerDisplay.textContent = `残り時間: ${this.timeLeft}秒`;
            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                if (question.type === "reading-comprehension") {
                    this.handleReadingComprehensionTimeout();
                } else {
                    this.handleAnswer(null, question.type);
                }
            }
        }, 1000);

        // Setup event listeners
        if (question.type === "multiple-choice") {
            document.querySelectorAll('.choice-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    clearInterval(this.timer);
                    this.handleAnswer(e.target, question.type);
                });
            });
        } else if (question.type === "fill-in-the-blank") {
            document.getElementById('submit-blank').addEventListener('click', () => {
                clearInterval(this.timer);
                this.handleAnswer(document.getElementById('blank-answer'), question.type);
            });
        } else if (question.type === "writing") {
            document.getElementById('submit-writing').addEventListener('click', () => {
                clearInterval(this.timer);
                this.handleWritingAnswer();
            });
        } else if (question.type === "reading-comprehension") {
            document.querySelectorAll('.sub-choices .choice-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const parentQIndex = parseInt(e.target.dataset.parentQIndex);
                    const subQIndex = parseInt(e.target.dataset.subQIndex);
                    this.handleSubAnswer(e.target, parentQIndex, subQIndex);
                });
            });
        }

        document.getElementById('next-btn').addEventListener('click', () => {
            this.currentQuestionIndex++;
            this.currentSubQuestionIndex = 0;
            if (this.currentQuestionIndex < this.questions.length) {
                this.showQuestion();
            } else {
                this.showResults();
            }
        });
    }

    handleAnswer(selectedElement, type) {
        const question = this.questions[this.currentQuestionIndex];
        const correctAnswer = question.answer.toLowerCase().trim();
        let isCorrect = false;

        if (type === "multiple-choice") {
            const selectedAnswer = selectedElement ? selectedElement.textContent.toLowerCase().trim() : '';
            isCorrect = selectedAnswer === correctAnswer;

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
                    this.incorrectAnswers.push(question);
                }
            }
        } else if (type === "fill-in-the-blank") {
            const userAnswer = selectedElement ? selectedElement.value.toLowerCase().trim() : '';
            isCorrect = userAnswer === correctAnswer;

            const blankInput = document.getElementById('blank-answer');
            const submitButton = document.getElementById('submit-blank');

            if (blankInput) {
                blankInput.disabled = true;
                if (isCorrect) {
                    blankInput.style.backgroundColor = '#d4edda';
                } else {
                    blankInput.style.backgroundColor = '#f8d7da';
                    const correctDisplay = document.createElement('p');
                    correctDisplay.textContent = `正解: ${question.answer}`;
                    correctDisplay.style.color = '#155724';
                    blankInput.parentNode.insertBefore(correctDisplay, submitButton);
                    this.incorrectAnswers.push(question);
                }
            }
            if (submitButton) {
                submitButton.classList.add('disabled');
            }
        }

        if (isCorrect) {
            this.score++;
        }

        document.getElementById('next-btn').style.display = 'block';
    }

    handleSubAnswer(selectedButton, parentQIndex, subQIndex) {
        const parentQuestion = this.questions[parentQIndex];
        const subQuestion = parentQuestion.subQuestions[subQIndex];
        const correctAnswer = subQuestion.answer.toLowerCase().trim();
        const selectedAnswer = selectedButton.textContent.toLowerCase().trim();
        const isCorrect = selectedAnswer === correctAnswer;

        if (isCorrect) {
            this.score++;
        } else {
            this.incorrectAnswers.push({ ...parentQuestion, subQuestionIndex: subQIndex });
        }

        const subQuestionElement = document.querySelector(`.sub-question[data-sub-q-index="${subQIndex}"]`);
        subQuestionElement.classList.add('answered');

        const choiceButtons = subQuestionElement.querySelectorAll('.choice-btn');
        choiceButtons.forEach(btn => {
            btn.classList.add('disabled');
            if (btn.textContent.toLowerCase().trim() === correctAnswer) {
                btn.classList.add('correct');
            }
        });

        if (!isCorrect) {
            selectedButton.classList.add('incorrect');
        }
    }

    handleReadingComprehensionTimeout() {
        const question = this.questions[this.currentQuestionIndex];
        question.subQuestions.forEach((subQ, index) => {
            const subQuestionElement = document.querySelector(`.sub-question[data-sub-q-index="${index}"]`);
            if (!subQuestionElement.classList.contains('answered')) {
                this.incorrectAnswers.push({ ...question, subQuestionIndex: index });
                const choiceButtons = subQuestionElement.querySelectorAll('.choice-btn');
                choiceButtons.forEach(btn => btn.classList.add('disabled'));
            }
        });
        document.getElementById('next-btn').style.display = 'block';
    }

    handleWritingAnswer() {
        const answer = document.getElementById('writing-answer').value;
        if (!answer.trim()) {
            alert('解答を入力してください。');
            return;
        }

        document.getElementById('submit-writing').disabled = true;
        document.getElementById('writing-answer').disabled = true;

        // For writing questions, always show next button (self-evaluation)
        document.getElementById('next-btn').style.display = 'block';
    }

    async showResults() {
        const mainContent = document.getElementById('home-view');

        // Save score to localStorage
        this.app.saveScore(this.currentLevel, this.score, this.questions.length);

        // Save progress to localStorage
        this.app.saveProgress(this.currentLevel, 'quiz', this.score / this.questions.length);

        // Award points
        const points = this.score * 20;
        this.app.updateGamification(points, null, null);

        mainContent.innerHTML = `
            <div class="quiz-container">
                <h2>クイズ終了！</h2>
                <p class="big-stat">${this.score} / ${this.questions.length}</p>
                <p>正答率: ${Math.round((this.score / this.questions.length) * 100)}%</p>
                ${this.incorrectAnswers.length > 0 ? `<button id="review-btn" class="btn">間違えた問題を復習</button>` : ''}
                <button id="back-btn" class="btn btn-primary">級選択に戻る</button>
            </div>
        `;

        document.getElementById('back-btn').addEventListener('click', () => {
            window.location.reload();
        });

        if (this.incorrectAnswers.length > 0) {
            document.getElementById('review-btn').addEventListener('click', () => {
                this.questions = this.incorrectAnswers;
                this.currentQuestionIndex = 0;
                this.score = 0;
                this.incorrectAnswers = [];
                this.showQuizInterface();
            });
        }
    }
}

// Initialize when app is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (window.eikenApp) {
            window.quizModule = new QuizModule(window.eikenApp);
            window.quizModule.init();
        }
    }, 100);
});
