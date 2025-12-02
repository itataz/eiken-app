// Vocabulary Learning Module
class VocabularyModule {
    constructor(app) {
        this.app = app;
        this.currentLevel = '英検5級';
        this.vocabularyData = [];
        this.currentIndex = 0;
        this.mode = null;
        this.score = 0;
    }

    init() {
        document.getElementById('start-vocab-btn').addEventListener('click', () => {
            this.currentLevel = document.getElementById('vocab-level').value;
            this.showModeSelector();
        });

        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.mode = e.target.dataset.mode;
                this.startVocabularyLearning();
            });
        });
    }

    showModeSelector() {
        document.querySelector('.vocab-mode-selector').style.display = 'block';
    }

    async startVocabularyLearning() {
        await this.loadVocabulary();

        if (this.vocabularyData.length === 0) {
            alert('この級の単語データがありません。');
            return;
        }

        this.currentIndex = 0;
        this.score = 0;

        switch(this.mode) {
            case 'flashcard':
                this.startFlashcardMode();
                break;
            case 'quiz':
                this.startQuizMode();
                break;
            case 'typing':
                this.startTypingMode();
                break;
        }
    }

    async loadVocabulary() {
        try {
            const response = await fetch('data/vocabulary.json');
            const allVocabulary = await response.json();
            this.vocabularyData = allVocabulary[this.currentLevel] || [];
        } catch (error) {
            console.error('Failed to load vocabulary:', error);
            this.vocabularyData = [];
        }
    }

    startFlashcardMode() {
        const container = document.getElementById('vocabulary-container');
        container.innerHTML = `
            <div class="flashcard-container">
                <div class="flashcard-progress">
                    <span id="flashcard-counter">1 / ${this.vocabularyData.length}</span>
                </div>
                <div class="flashcard" id="flashcard">
                    <div class="flashcard-front">
                        <h2 id="vocab-word">${this.vocabularyData[0].word}</h2>
                        <p class="pronunciation">${this.vocabularyData[0].pronunciation}</p>
                        ${this.vocabularyData[0].audio ? `<button class="audio-btn" onclick="playAudio('${this.vocabularyData[0].audio}')">🔊</button>` : ''}
                    </div>
                    <div class="flashcard-back" style="display: none;">
                        <h2>${this.vocabularyData[0].meaning}</h2>
                        <p class="part-of-speech">(${this.vocabularyData[0].partOfSpeech})</p>
                        <div class="example">
                            <p class="example-en">${this.vocabularyData[0].example}</p>
                            <p class="example-jp">${this.vocabularyData[0].exampleJP}</p>
                        </div>
                    </div>
                </div>
                <div class="flashcard-controls">
                    <button id="flip-btn" class="btn">めくる</button>
                    <button id="prev-vocab-btn" class="btn" ${this.currentIndex === 0 ? 'disabled' : ''}>前へ</button>
                    <button id="next-vocab-btn" class="btn">次へ</button>
                    <button id="mark-known-btn" class="btn btn-success" style="display: none;">覚えた</button>
                </div>
            </div>
        `;

        document.getElementById('flip-btn').addEventListener('click', () => this.flipFlashcard());
        document.getElementById('prev-vocab-btn').addEventListener('click', () => this.previousWord());
        document.getElementById('next-vocab-btn').addEventListener('click', () => this.nextWord());
        document.getElementById('mark-known-btn').addEventListener('click', () => this.markAsKnown());
    }

    flipFlashcard() {
        const front = document.querySelector('.flashcard-front');
        const back = document.querySelector('.flashcard-back');
        const flipBtn = document.getElementById('flip-btn');
        const markKnownBtn = document.getElementById('mark-known-btn');

        if (front.style.display !== 'none') {
            front.style.display = 'none';
            back.style.display = 'block';
            flipBtn.textContent = '表に戻る';
            markKnownBtn.style.display = 'inline-block';
        } else {
            front.style.display = 'block';
            back.style.display = 'none';
            flipBtn.textContent = 'めくる';
            markKnownBtn.style.display = 'none';
        }
    }

    nextWord() {
        if (this.currentIndex < this.vocabularyData.length - 1) {
            this.currentIndex++;
            this.updateFlashcard();
        } else {
            alert('全ての単語を学習しました！');
            this.endVocabularySession();
        }
    }

    previousWord() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateFlashcard();
        }
    }

    updateFlashcard() {
        const word = this.vocabularyData[this.currentIndex];
        const front = document.querySelector('.flashcard-front');
        const back = document.querySelector('.flashcard-back');

        front.innerHTML = `
            <h2 id="vocab-word">${word.word}</h2>
            <p class="pronunciation">${word.pronunciation}</p>
            ${word.audio ? `<button class="audio-btn" onclick="playAudio('${word.audio}')">🔊</button>` : ''}
        `;

        back.innerHTML = `
            <h2>${word.meaning}</h2>
            <p class="part-of-speech">(${word.partOfSpeech})</p>
            <div class="example">
                <p class="example-en">${word.example}</p>
                <p class="example-jp">${word.exampleJP}</p>
            </div>
        `;

        front.style.display = 'block';
        back.style.display = 'none';
        document.getElementById('flip-btn').textContent = 'めくる';
        document.getElementById('mark-known-btn').style.display = 'none';

        document.getElementById('flashcard-counter').textContent = `${this.currentIndex + 1} / ${this.vocabularyData.length}`;
        document.getElementById('prev-vocab-btn').disabled = this.currentIndex === 0;
    }

    async markAsKnown() {
        // Save vocabulary progress to localStorage
        this.app.saveVocabularyProgress(
            this.vocabularyData[this.currentIndex].word,
            this.currentLevel,
            true
        );

        this.app.updateGamification(5, null, null); // Award 5 points

        this.nextWord();
    }

    startQuizMode() {
        const container = document.getElementById('vocabulary-container');
        this.currentIndex = 0;
        this.score = 0;
        this.showQuizQuestion();
    }

    showQuizQuestion() {
        if (this.currentIndex >= this.vocabularyData.length) {
            this.endVocabularySession();
            return;
        }

        const word = this.vocabularyData[this.currentIndex];
        const container = document.getElementById('vocabulary-container');

        // Generate wrong answers
        const wrongAnswers = this.vocabularyData
            .filter(w => w.word !== word.word)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(w => w.meaning);

        const allAnswers = [word.meaning, ...wrongAnswers].sort(() => Math.random() - 0.5);

        container.innerHTML = `
            <div class="quiz-container">
                <div class="quiz-progress">
                    <span>問題 ${this.currentIndex + 1} / ${this.vocabularyData.length}</span>
                    <span>スコア: ${this.score}</span>
                </div>
                <div class="quiz-question">
                    <h2>${word.word}</h2>
                    <p class="pronunciation">${word.pronunciation}</p>
                    ${word.audio ? `<button class="audio-btn" onclick="playAudio('${word.audio}')">🔊</button>` : ''}
                </div>
                <div class="quiz-choices">
                    ${allAnswers.map(answer => `
                        <button class="quiz-choice-btn" data-answer="${answer}">${answer}</button>
                    `).join('')}
                </div>
            </div>
        `;

        document.querySelectorAll('.quiz-choice-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.checkQuizAnswer(e.target.dataset.answer, word.meaning);
            });
        });
    }

    async checkQuizAnswer(selected, correct) {
        const isCorrect = selected === correct;

        if (isCorrect) {
            this.score++;
        }

        // Save progress to localStorage
        this.app.saveVocabularyProgress(
            this.vocabularyData[this.currentIndex].word,
            this.currentLevel,
            isCorrect
        );

        if (isCorrect) {
            this.app.updateGamification(10, null, null); // Award 10 points for correct answer
        }

        // Show feedback
        const buttons = document.querySelectorAll('.quiz-choice-btn');
        buttons.forEach(btn => {
            btn.disabled = true;
            if (btn.dataset.answer === correct) {
                btn.classList.add('correct');
            } else if (btn.dataset.answer === selected && !isCorrect) {
                btn.classList.add('incorrect');
            }
        });

        setTimeout(() => {
            this.currentIndex++;
            this.showQuizQuestion();
        }, 1500);
    }

    startTypingMode() {
        const container = document.getElementById('vocabulary-container');
        this.currentIndex = 0;
        this.score = 0;
        this.showTypingQuestion();
    }

    showTypingQuestion() {
        if (this.currentIndex >= this.vocabularyData.length) {
            this.endVocabularySession();
            return;
        }

        const word = this.vocabularyData[this.currentIndex];
        const container = document.getElementById('vocabulary-container');

        container.innerHTML = `
            <div class="typing-container">
                <div class="typing-progress">
                    <span>問題 ${this.currentIndex + 1} / ${this.vocabularyData.length}</span>
                    <span>スコア: ${this.score}</span>
                </div>
                <div class="typing-question">
                    <h2>この単語の意味は？</h2>
                    <div class="word-display">
                        <h3>${word.word}</h3>
                        <p class="pronunciation">${word.pronunciation}</p>
                        ${word.audio ? `<button class="audio-btn" onclick="playAudio('${word.audio}')">🔊</button>` : ''}
                    </div>
                </div>
                <div class="typing-input">
                    <input type="text" id="typing-answer" placeholder="意味を入力してください" autofocus>
                    <button id="submit-typing" class="btn btn-primary">回答</button>
                </div>
                <div id="typing-feedback"></div>
            </div>
        `;

        document.getElementById('submit-typing').addEventListener('click', () => {
            this.checkTypingAnswer();
        });

        document.getElementById('typing-answer').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.checkTypingAnswer();
            }
        });
    }

    async checkTypingAnswer() {
        const word = this.vocabularyData[this.currentIndex];
        const userAnswer = document.getElementById('typing-answer').value.trim();
        const feedback = document.getElementById('typing-feedback');

        const isCorrect = userAnswer.toLowerCase() === word.meaning.toLowerCase();

        if (isCorrect) {
            this.score++;
            feedback.innerHTML = '<p class="correct-feedback">✓ 正解！</p>';
        } else {
            feedback.innerHTML = `<p class="incorrect-feedback">✗ 不正解。正解: ${word.meaning}</p>`;
        }

        // Save progress
        // Save progress to localStorage
        this.app.saveVocabularyProgress(
            word.word,
            this.currentLevel,
            isCorrect
        );

        if (isCorrect) {
            this.app.updateGamification(15, null, null); // Award 15 points for typing correctly
        }

        document.getElementById('submit-typing').disabled = true;
        document.getElementById('typing-answer').disabled = true;

        setTimeout(() => {
            this.currentIndex++;
            this.showTypingQuestion();
        }, 2000);
    }

    endVocabularySession() {
        const container = document.getElementById('vocabulary-container');
        const accuracy = this.mode !== 'flashcard' ? Math.round((this.score / this.vocabularyData.length) * 100) : null;

        container.innerHTML = `
            <div class="session-complete">
                <h2>学習完了！</h2>
                ${this.mode !== 'flashcard' ? `
                    <p class="big-stat">${this.score} / ${this.vocabularyData.length}</p>
                    <p>正答率: ${accuracy}%</p>
                ` : `
                    <p>${this.vocabularyData.length} 個の単語を学習しました</p>
                `}
                <button class="btn btn-primary" onclick="window.eikenApp.switchView('vocabulary')">戻る</button>
            </div>
        `;

        // Check for badges
        if (this.app.currentUser && accuracy === 100) {
            this.app.updateGamification(0, `Perfect ${this.currentLevel}`, null);
        }
    }
}

// Audio playback function
function playAudio(audioSrc) {
    const audio = new Audio(audioSrc);
    audio.play().catch(err => console.log('Audio playback failed:', err));
}

// Initialize when app is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (window.eikenApp) {
            window.vocabularyModule = new VocabularyModule(window.eikenApp);
            window.vocabularyModule.init();
        }
    }, 100);
});
