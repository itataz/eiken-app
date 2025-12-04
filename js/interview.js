class InterviewPractice {
    constructor(app) {
        this.app = app;
        this.currentLevel = null;
        this.currentQuestionIndex = 0;
        this.questions = [];
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.recordedBlob = null;

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Level selection buttons
        document.querySelectorAll('#interview-view .level-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectLevel(e.target.dataset.level);
            });
        });

        // Recording controls
        document.getElementById('start-recording-btn')?.addEventListener('click', () => this.startRecording());
        document.getElementById('stop-recording-btn')?.addEventListener('click', () => this.stopRecording());
        document.getElementById('play-recording-btn')?.addEventListener('click', () => this.playRecording());
        document.getElementById('next-interview-question-btn')?.addEventListener('click', () => this.nextQuestion());
    }

    async selectLevel(level) {
        this.currentLevel = level;
        this.currentQuestionIndex = 0;

        // Load interview data
        await this.loadInterviewData(level);

        // Show interview content
        document.getElementById('interview-content').style.display = 'block';

        // Display interview flow
        this.displayInterviewFlow();

        // Start mock interview
        this.displayCurrentQuestion();
    }

    async loadInterviewData(level) {
        // Interview questions data
        const interviewData = {
            "英検3級": {
                flow: [
                    "入室・挨拶",
                    "問題カードを受け取る",
                    "20秒間黙読",
                    "音読（パッセージを読む）",
                    "質問に答える（5問）",
                    "問題カードを返す",
                    "退室"
                ],
                passage: "Today, many people enjoy taking pictures with their smartphones. Smartphones are very convenient because you can take photos anytime and anywhere. You can also share your photos with friends and family quickly.",
                image: "📱",
                questions: [
                    {
                        type: "passage",
                        question: "Please read the passage aloud.",
                        instruction: "20秒間黙読した後、パッセージを音読してください。"
                    },
                    {
                        type: "passage-question",
                        question: "According to the passage, why are smartphones convenient?",
                        sampleAnswer: "Because you can take photos anytime and anywhere."
                    },
                    {
                        type: "illustration",
                        question: "Now, please look at the picture and describe the situation.",
                        instruction: "絵を見て、状況を説明してください。"
                    },
                    {
                        type: "personal",
                        question: "Do you like taking pictures?",
                        sampleAnswer: "Yes, I do. I like taking pictures of nature."
                    },
                    {
                        type: "personal",
                        question: "What do you usually do on weekends?",
                        sampleAnswer: "I usually play sports with my friends."
                    }
                ]
            },
            "英検準2級": {
                flow: [
                    "入室・挨拶",
                    "問題カードを受け取る",
                    "20秒間黙読",
                    "音読（パッセージを読む）",
                    "質問に答える（5問）",
                    "問題カードを返す",
                    "退室"
                ],
                passage: "These days, more and more people are working from home. Working from home has some advantages. For example, people can save time because they don't have to commute. Also, they can spend more time with their families.",
                image: "💻🏠",
                questions: [
                    {
                        type: "passage",
                        question: "Please read the passage aloud.",
                        instruction: "20秒間黙読した後、パッセージを音読してください。"
                    },
                    {
                        type: "passage-question",
                        question: "According to the passage, what is one advantage of working from home?",
                        sampleAnswer: "People can save time because they don't have to commute."
                    },
                    {
                        type: "illustration",
                        question: "Now, please look at the illustration and explain what is happening.",
                        instruction: "イラストを見て、何が起こっているか説明してください。"
                    },
                    {
                        type: "opinion",
                        question: "Do you think working from home is a good idea?",
                        sampleAnswer: "Yes, I think so. It saves time and allows people to have a better work-life balance."
                    },
                    {
                        type: "opinion",
                        question: "Some people say that students should study abroad. What do you think?",
                        sampleAnswer: "I agree. Studying abroad helps students learn about different cultures and improve their language skills."
                    }
                ]
            },
            "英検2級": {
                flow: [
                    "入室・挨拶",
                    "問題カードを受け取る",
                    "20秒間黙読",
                    "音読（パッセージを読む）",
                    "質問に答える（5問）",
                    "問題カードを返す",
                    "退室"
                ],
                passage: "In recent years, the use of renewable energy has increased significantly. Many countries are investing in solar and wind power to reduce their carbon emissions. However, the transition to renewable energy faces several challenges, including high initial costs and the need for better storage technology.",
                image: "☀️💨⚡",
                questions: [
                    {
                        type: "passage",
                        question: "Please read the passage aloud.",
                        instruction: "20秒間黙読した後、パッセージを音読してください。"
                    },
                    {
                        type: "passage-question",
                        question: "According to the passage, what challenges does renewable energy face?",
                        sampleAnswer: "It faces challenges such as high initial costs and the need for better storage technology."
                    },
                    {
                        type: "illustration",
                        question: "Please look at the cartoon and describe the situation.",
                        instruction: "漫画を見て、状況を説明してください。"
                    },
                    {
                        type: "opinion",
                        question: "Do you think governments should invest more in renewable energy?",
                        sampleAnswer: "Yes, I believe governments should invest more in renewable energy to combat climate change and reduce pollution."
                    },
                    {
                        type: "opinion",
                        question: "Some people say that online shopping is better than shopping in stores. What do you think?",
                        sampleAnswer: "I partly agree. Online shopping is convenient, but shopping in stores allows you to see products directly."
                    }
                ]
            },
            "英検準1級": {
                flow: [
                    "入室・挨拶",
                    "問題カードを受け取る",
                    "1分間準備",
                    "ナレーション（4コマイラストを説明）",
                    "質問に答える（4問）",
                    "問題カードを返す",
                    "退室"
                ],
                passage: "Four-panel illustration story",
                image: "📊📈📉📊",
                questions: [
                    {
                        type: "narration",
                        question: "Please look at the four pictures and describe the story in your own words.",
                        instruction: "4コマのイラストを見て、ストーリーを2分間で説明してください。",
                        time: 120
                    },
                    {
                        type: "social-issue",
                        question: "Do you think companies should allow employees to work flexible hours?",
                        sampleAnswer: "Yes, I believe flexible working hours can improve productivity and work-life balance. However, companies need to ensure proper communication systems are in place."
                    },
                    {
                        type: "social-issue",
                        question: "Some people say that social media has a negative effect on society. What do you think?",
                        sampleAnswer: "While social media can spread misinformation and cause addiction, it also connects people globally and enables important social movements."
                    },
                    {
                        type: "abstract",
                        question: "What do you think is the most important quality for a leader?",
                        sampleAnswer: "I think empathy is crucial. Leaders who understand their team members' perspectives can make better decisions and create a positive work environment."
                    }
                ]
            },
            "英検1級": {
                flow: [
                    "入室・挨拶",
                    "トピックカードを受け取る",
                    "1分間準備",
                    "スピーチ（2分間）",
                    "Q&A（4問）",
                    "退室"
                ],
                passage: "Choose one topic and give a 2-minute speech",
                image: "🎤",
                questions: [
                    {
                        type: "speech",
                        question: "Choose one of the following topics and give a 2-minute speech:\n\n1. Can economic development and environmental protection coexist?\n2. Should governments regulate artificial intelligence?\n3. Is globalization beneficial for developing countries?\n4. Should countries prioritize space exploration?\n5. Does technology make our lives better?",
                        instruction: "5つのトピックから1つ選び、2分間のスピーチをしてください。",
                        time: 120
                    },
                    {
                        type: "followup",
                        question: "Follow-up question based on your speech",
                        sampleAnswer: "Build on the arguments you made in your speech with specific examples and deeper analysis."
                    },
                    {
                        type: "complex",
                        question: "Some people argue that traditional education systems are becoming obsolete. Do you agree?",
                        sampleAnswer: "While technology has transformed learning, traditional education still plays a vital role in developing critical thinking and social skills. A hybrid approach may be most effective."
                    },
                    {
                        type: "philosophical",
                        question: "What role should ethics play in scientific research?",
                        sampleAnswer: "Ethics should be fundamental to scientific research. While innovation is important, researchers must consider the potential societal impacts and ensure their work benefits humanity."
                    }
                ]
            }
        };

        this.questions = interviewData[level]?.questions || [];
        this.interviewFlow = interviewData[level]?.flow || [];
        this.passage = interviewData[level]?.passage || "";
        this.image = interviewData[level]?.image || "";
    }

    displayInterviewFlow() {
        const stepsContainer = document.getElementById('interview-steps');
        stepsContainer.innerHTML = this.interviewFlow.map((step, index) =>
            `<div class="interview-step">
                <span class="step-number">${index + 1}</span>
                <span class="step-text">${step}</span>
            </div>`
        ).join('');
    }

    displayCurrentQuestion() {
        if (this.currentQuestionIndex >= this.questions.length) {
            this.showCompletionMessage();
            return;
        }

        const question = this.questions[this.currentQuestionIndex];

        // Update passage display
        document.getElementById('interview-passage').textContent = this.passage;
        document.getElementById('interview-image').textContent = this.image;

        // Update current question
        const questionHtml = `
            <div class="question-header">
                <span class="question-number">質問 ${this.currentQuestionIndex + 1}/${this.questions.length}</span>
                <span class="question-type">${question.type}</span>
            </div>
            ${question.instruction ? `<p class="instruction">${question.instruction}</p>` : ''}
            <p class="question-text">${question.question}</p>
            ${question.sampleAnswer ? `<details class="sample-answer-hint">
                <summary>模範解答例を見る</summary>
                <p>${question.sampleAnswer}</p>
            </details>` : ''}
        `;

        document.getElementById('current-interview-question').innerHTML = questionHtml;

        // Reset recording UI
        this.resetRecordingUI();
    }

    resetRecordingUI() {
        document.getElementById('start-recording-btn').style.display = 'inline-block';
        document.getElementById('stop-recording-btn').style.display = 'none';
        document.getElementById('play-recording-btn').style.display = 'none';
        document.getElementById('recorded-audio').style.display = 'none';
        document.getElementById('recording-status').textContent = '';
        this.recordedBlob = null;
    }

    async startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(stream);
            this.audioChunks = [];

            this.mediaRecorder.ondataavailable = (event) => {
                this.audioChunks.push(event.data);
            };

            this.mediaRecorder.onstop = () => {
                this.recordedBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
                const audioURL = URL.createObjectURL(this.recordedBlob);
                const audioElement = document.getElementById('recorded-audio');
                audioElement.src = audioURL;
                audioElement.style.display = 'block';
                document.getElementById('play-recording-btn').style.display = 'inline-block';
            };

            this.mediaRecorder.start();

            document.getElementById('start-recording-btn').style.display = 'none';
            document.getElementById('stop-recording-btn').style.display = 'inline-block';
            document.getElementById('recording-status').textContent = '🔴 録音中...';
            document.getElementById('recording-status').style.color = 'red';

        } catch (error) {
            console.error('録音エラー:', error);
            alert('マイクへのアクセスが拒否されました。ブラウザの設定を確認してください。');
        }
    }

    stopRecording() {
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop();
            this.mediaRecorder.stream.getTracks().forEach(track => track.stop());

            document.getElementById('stop-recording-btn').style.display = 'none';
            document.getElementById('start-recording-btn').style.display = 'inline-block';
            document.getElementById('recording-status').textContent = '✅ 録音完了';
            document.getElementById('recording-status').style.color = 'green';
        }
    }

    playRecording() {
        const audioElement = document.getElementById('recorded-audio');
        audioElement.play();
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        this.displayCurrentQuestion();
    }

    showCompletionMessage() {
        const questionContainer = document.getElementById('current-interview-question');
        questionContainer.innerHTML = `
            <div class="completion-message">
                <h3>🎉 面接練習完了！</h3>
                <p>お疲れ様でした。全ての質問が終了しました。</p>
                <p>録音した音声を聞き返して、発音や流暢さを確認しましょう。</p>
                <button class="btn btn-primary" onclick="location.reload()">もう一度練習する</button>
            </div>
        `;

        // Award points
        this.app.updatePoints(50);
        this.app.updateStreak();
    }
}
