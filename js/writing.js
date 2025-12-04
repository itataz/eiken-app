class WritingPractice {
    constructor(app) {
        this.app = app;
        this.currentLevel = null;
        this.currentTopic = null;

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Level selection buttons
        document.querySelectorAll('#writing-view .level-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectLevel(e.target.dataset.level);
            });
        });

        // Writing textarea
        const textarea = document.getElementById('writing-textarea');
        if (textarea) {
            textarea.addEventListener('input', () => this.updateWordCount());
        }

        // Save and clear buttons
        document.getElementById('save-writing-btn')?.addEventListener('click', () => this.saveWriting());
        document.getElementById('clear-writing-btn')?.addEventListener('click', () => this.clearWriting());
    }

    selectLevel(level) {
        this.currentLevel = level;

        // Load writing topic
        this.loadWritingTopic(level);

        // Show writing content
        document.getElementById('writing-content').style.display = 'block';
    }

    loadWritingTopic(level) {
        const writingTopics = {
            "英検2級": {
                topic: "Do you think it is better to live in a big city or in the countryside?",
                topicJP: "大都市に住む方が良いと思いますか、それとも田舎に住む方が良いと思いますか？",
                requirements: [
                    "80〜100語で書いてください",
                    "自分の意見を明確に述べてください",
                    "理由を2つ挙げてください",
                    "具体例を含めてください"
                ],
                wordCount: "80-100 words",
                sampleAnswer: `I believe living in a big city is better for several reasons.

First, cities offer more job opportunities. Large companies and various industries are concentrated in urban areas, making it easier to find employment and advance one's career. For example, Tokyo has countless opportunities in technology, finance, and entertainment.

Second, cities provide better access to services and facilities. Residents can enjoy excellent healthcare, education, shopping, and entertainment options. Public transportation is also more developed, making daily life more convenient.

While the countryside offers peace and nature, the advantages of city life, particularly in terms of career and convenience, make it a better choice for most people.

(109 words)`
            },
            "英検準1級": {
                topic: "Should governments invest more money in space exploration?",
                topicJP: "政府は宇宙探査にもっと投資すべきですか？",
                requirements: [
                    "120〜150語で書いてください",
                    "POINTS から2つ選んで使用してください",
                    "序論・本論・結論の構成で書いてください",
                    "論理的な展開を心がけてください"
                ],
                points: ["Scientific advancement", "Economic costs", "Environmental concerns", "International cooperation"],
                wordCount: "120-150 words",
                sampleAnswer: `Some people argue that governments should allocate more funds to space exploration. However, I disagree with this view for two main reasons.

First, considering economic costs, space exploration requires enormous financial resources that could be better spent on pressing social issues. Many countries face challenges such as poverty, inadequate healthcare, and aging infrastructure. These fundamental needs should take priority over space programs. For instance, the cost of a single space mission could fund thousands of schools or hospitals.

Second, environmental concerns on Earth are more urgent. Climate change and environmental degradation pose immediate threats to human survival. Instead of exploring space, governments should invest in renewable energy, conservation programs, and pollution control measures.

While space exploration has scientific merit, our limited resources should address critical problems here on Earth before venturing into space. Only after solving these issues can we justify significant investment in space programs.

(148 words)`
            },
            "英検1級": {
                topic: "Should artificial intelligence be strictly regulated by governments?",
                topicJP: "人工知能は政府によって厳しく規制されるべきですか？",
                requirements: [
                    "200〜240語で書いてください",
                    "POINTS から3つ選んで使用してください",
                    "複数の視点から論じてください",
                    "高度な語彙と複雑な文構造を使用してください"
                ],
                points: ["Privacy concerns", "Economic impact", "Ethical considerations", "National security", "Innovation"],
                wordCount: "200-240 words",
                sampleAnswer: `The rapid advancement of artificial intelligence has sparked intense debate about whether governments should impose strict regulations on its development and deployment. While some advocate for minimal oversight to foster innovation, I firmly believe that comprehensive government regulation is essential for three compelling reasons.

First and foremost, privacy concerns necessitate stringent oversight. AI systems collect and process vast amounts of personal data, creating unprecedented risks of surveillance and data breaches. Without robust regulations, companies could exploit this information for profit, undermining individual privacy rights. The European Union's GDPR serves as a model for how governments can protect citizens while allowing technological progress.

Second, ethical considerations demand government intervention. AI systems increasingly make decisions affecting people's lives, from credit approvals to criminal sentencing. Without proper regulation, these systems may perpetuate bias and discrimination. Government oversight can ensure that AI development adheres to fundamental ethical principles and human rights standards, preventing algorithmic injustice.

Finally, national security implications cannot be ignored. Unregulated AI could be weaponized by hostile actors or used in cyber attacks threatening critical infrastructure. Governments must establish frameworks to prevent malicious applications while promoting beneficial uses of AI technology.

Critics argue that excessive regulation might stifle innovation and economic growth. However, well-designed regulations need not impede progress. Rather, they can provide clear guidelines that foster responsible innovation while protecting public interests. The potential risks of unregulated AI far outweigh any short-term economic benefits of a laissez-faire approach.

In conclusion, government regulation of AI is not merely advisable but imperative. As AI becomes increasingly powerful and pervasive, comprehensive oversight frameworks will ensure that this transformative technology serves humanity's best interests while minimizing potential harms.

(240 words)`
            }
        };

        this.currentTopic = writingTopics[level];

        if (this.currentTopic) {
            // Display topic
            document.getElementById('writing-topic').innerHTML = `
                <h4>Topic</h4>
                <p class="topic-en">${this.currentTopic.topic}</p>
                <p class="topic-jp">${this.currentTopic.topicJP}</p>
            `;

            // Display requirements
            const requirementsHtml = `
                <h4>要件</h4>
                <ul>
                    ${this.currentTopic.requirements.map(req => `<li>${req}</li>`).join('')}
                </ul>
                ${this.currentTopic.points ? `
                    <h5>POINTS:</h5>
                    <ul class="points-list">
                        ${this.currentTopic.points.map(point => `<li>${point}</li>`).join('')}
                    </ul>
                ` : ''}
                <p class="word-target">目標語数: ${this.currentTopic.wordCount}</p>
            `;
            document.getElementById('writing-requirements').innerHTML = requirementsHtml;

            // Display sample answer
            document.getElementById('sample-answer').innerHTML = `
                <pre>${this.currentTopic.sampleAnswer}</pre>
            `;

            // Load saved draft if exists
            this.loadSavedDraft();
        }
    }

    updateWordCount() {
        const textarea = document.getElementById('writing-textarea');
        const text = textarea.value;

        // Character count
        const charCount = text.length;
        document.getElementById('char-count').textContent = charCount;

        // Word count (English words)
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        const wordCount = words.length;
        document.getElementById('word-count').textContent = wordCount;
    }

    saveWriting() {
        const textarea = document.getElementById('writing-textarea');
        const text = textarea.value;

        if (!text.trim()) {
            alert('テキストを入力してください。');
            return;
        }

        // Save to localStorage
        const key = `writing_draft_${this.currentLevel}`;
        localStorage.setItem(key, text);

        // Show success message
        alert('💾 保存しました！');

        // Award points
        this.app.updatePoints(30);
    }

    loadSavedDraft() {
        const key = `writing_draft_${this.currentLevel}`;
        const savedText = localStorage.getItem(key);

        if (savedText) {
            document.getElementById('writing-textarea').value = savedText;
            this.updateWordCount();
        }
    }

    clearWriting() {
        if (confirm('本当にクリアしますか？')) {
            document.getElementById('writing-textarea').value = '';
            this.updateWordCount();

            // Clear saved draft
            const key = `writing_draft_${this.currentLevel}`;
            localStorage.removeItem(key);
        }
    }
}
