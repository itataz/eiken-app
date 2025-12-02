// Main Application Class - Static Site Version
class EikenApp {
    constructor() {
        this.currentView = 'home';
        this.gamificationData = this.loadGamificationData();

        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.updateGamificationUI();
        this.loadScores();
        await this.loadLevelStats();
        this.showDailyRecommendation();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchView(e.target.dataset.view);
            });
        });
    }

    loadGamificationData() {
        const data = localStorage.getItem('gamificationData');
        if (data) {
            return JSON.parse(data);
        }
        // Initialize default gamification data
        return {
            totalPoints: 0,
            badges: [],
            currentStreak: 0,
            longestStreak: 0,
            lastStudyDate: null
        };
    }

    saveGamificationData() {
        localStorage.setItem('gamificationData', JSON.stringify(this.gamificationData));
    }

    updateGamificationUI() {
        document.getElementById('user-points').textContent = this.gamificationData.totalPoints || 0;
        document.getElementById('user-streak').textContent = this.gamificationData.currentStreak || 0;
        document.getElementById('user-badges-count').textContent = this.gamificationData.badges?.length || 0;
    }

    updateGamification(points, badge, streak) {
        if (points !== undefined && points !== null) {
            this.gamificationData.totalPoints += points;
        }

        if (badge) {
            this.gamificationData.badges.push({
                name: badge,
                earnedAt: new Date().toISOString()
            });
        }

        if (streak !== undefined && streak !== null) {
            this.gamificationData.currentStreak = streak;
            if (streak > this.gamificationData.longestStreak) {
                this.gamificationData.longestStreak = streak;
            }
        }

        this.gamificationData.lastStudyDate = new Date().toISOString();
        this.saveGamificationData();
        this.updateGamificationUI();
    }

    loadScores() {
        const scores = localStorage.getItem('scores');
        const savedScores = scores ? JSON.parse(scores) : {};

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

    saveScore(level, score, total) {
        const scores = localStorage.getItem('scores');
        const savedScores = scores ? JSON.parse(scores) : {};

        savedScores[level] = {
            score,
            total,
            date: new Date().toLocaleString('ja-JP')
        };

        localStorage.setItem('scores', JSON.stringify(savedScores));
    }

    saveProgress(level, category, score) {
        const progress = localStorage.getItem('progress');
        const progressData = progress ? JSON.parse(progress) : [];

        progressData.push({
            level,
            category,
            score,
            timestamp: new Date().toISOString()
        });

        localStorage.setItem('progress', JSON.stringify(progressData));
    }

    getProgress() {
        const progress = localStorage.getItem('progress');
        return progress ? JSON.parse(progress) : [];
    }

    saveVocabularyProgress(word, level, correct) {
        const vocabProgress = localStorage.getItem('vocabularyProgress');
        const progressData = vocabProgress ? JSON.parse(vocabProgress) : {};

        if (!progressData[word]) {
            progressData[word] = {
                attempts: 0,
                correct: 0,
                lastAttempt: null,
                level: level
            };
        }

        progressData[word].attempts++;
        if (correct) {
            progressData[word].correct++;
        }
        progressData[word].lastAttempt = new Date().toISOString();

        localStorage.setItem('vocabularyProgress', JSON.stringify(progressData));
    }

    getVocabularyProgress() {
        const vocabProgress = localStorage.getItem('vocabularyProgress');
        return vocabProgress ? JSON.parse(vocabProgress) : {};
    }

    async loadLevelStats() {
        try {
            // Load questions and vocabulary data
            const [questionsResponse, vocabularyResponse] = await Promise.all([
                fetch('data/questions.json'),
                fetch('data/vocabulary.json')
            ]);

            const questions = await questionsResponse.json();
            const vocabulary = await vocabularyResponse.json();

            // Update each level card
            const cards = document.querySelectorAll('.certification-card[data-level]');
            cards.forEach(card => {
                const level = card.getAttribute('data-level');

                // Count questions
                let questionCount = 0;
                if (questions[level]) {
                    const levelData = questions[level];
                    if (Array.isArray(levelData)) {
                        questionCount = levelData.length;
                    } else {
                        // Count questions in all categories
                        Object.values(levelData).forEach(category => {
                            if (Array.isArray(category)) {
                                questionCount += category.length;
                            }
                        });
                    }
                }

                // Count vocabulary
                const vocabCount = vocabulary[level] ? vocabulary[level].length : 0;

                // Calculate progress
                const progress = this.calculateLevelProgress(level);

                // Update UI
                const questionStat = card.querySelector('[data-stat="questions"]');
                const vocabStat = card.querySelector('[data-stat="vocabulary"]');
                const progressStat = card.querySelector('[data-stat="progress"]');

                if (questionStat) questionStat.textContent = questionCount;
                if (vocabStat) vocabStat.textContent = vocabCount;
                if (progressStat) progressStat.textContent = `${progress}%`;
            });
        } catch (error) {
            console.error('Failed to load level stats:', error);
        }
    }

    calculateLevelProgress(level) {
        const scores = localStorage.getItem('scores');
        const savedScores = scores ? JSON.parse(scores) : {};

        if (savedScores[level]) {
            const { score, total } = savedScores[level];
            return Math.round((score / total) * 100);
        }
        return 0;
    }

    showDailyRecommendation() {
        const container = document.getElementById('daily-recommendation');
        if (!container) return;

        const scores = localStorage.getItem('scores');
        const savedScores = scores ? JSON.parse(scores) : {};
        const gamificationData = this.gamificationData;

        let recommendation = '';
        let encouragementMessage = '';

        // Determine encouragement message based on streak
        if (gamificationData.currentStreak === 0) {
            encouragementMessage = 'さあ、今日から学習を始めましょう！';
        } else if (gamificationData.currentStreak < 3) {
            encouragementMessage = `素晴らしい！${gamificationData.currentStreak}日連続で学習中です。このペースを維持しましょう！`;
        } else if (gamificationData.currentStreak < 7) {
            encouragementMessage = `すごい！${gamificationData.currentStreak}日連続学習達成！7日連続まであと少しです！`;
        } else if (gamificationData.currentStreak < 30) {
            encouragementMessage = `素晴らしい継続力！${gamificationData.currentStreak}日連続で学習中！30日連続を目指しましょう！`;
        } else {
            encouragementMessage = `驚異的！${gamificationData.currentStreak}日連続学習！あなたは真の英検マスターです！`;
        }

        // Find lowest scoring level or recommend starting level
        let recommendedLevel = null;
        let lowestScore = 100;

        const levels = ['英検5級', '英検4級', '英検3級', '英検準2級', '英検2級', '英検準1級', '英検1級'];

        for (const level of levels) {
            if (savedScores[level]) {
                const { score, total } = savedScores[level];
                const percentage = (score / total) * 100;
                if (percentage < lowestScore) {
                    lowestScore = percentage;
                    recommendedLevel = level;
                }
            }
        }

        // If no scores yet, recommend starting from level 5
        if (!recommendedLevel) {
            recommendedLevel = '英検3級';
            recommendation = `<div class="recommendation-card">
                <h3>おすすめ: ${recommendedLevel}</h3>
                <p>${encouragementMessage}</p>
                <p>まだ学習を始めていませんね。${recommendedLevel}から始めることをおすすめします。</p>
                <button class="btn btn-primary" onclick="window.eikenApp.startLevel('${recommendedLevel}')">今すぐ始める</button>
            </div>`;
        } else if (lowestScore < 60) {
            recommendation = `<div class="recommendation-card">
                <h3>復習が必要: ${recommendedLevel}</h3>
                <p>${encouragementMessage}</p>
                <p>前回のスコア: ${Math.round(lowestScore)}%。もう一度復習して完璧を目指しましょう！</p>
                <button class="btn btn-primary" onclick="window.eikenApp.startLevel('${recommendedLevel}')">復習する</button>
            </div>`;
        } else {
            // Find next level
            const currentIndex = levels.indexOf(recommendedLevel);
            const nextLevel = currentIndex < levels.length - 1 ? levels[currentIndex + 1] : recommendedLevel;
            recommendation = `<div class="recommendation-card">
                <h3>次のステップ: ${nextLevel}</h3>
                <p>${encouragementMessage}</p>
                <p>${recommendedLevel}で良いスコアを記録しました！次のレベルに挑戦しましょう。</p>
                <button class="btn btn-primary" onclick="window.eikenApp.startLevel('${nextLevel}')">挑戦する</button>
            </div>`;
        }

        container.innerHTML = recommendation;
    }

    startLevel(level) {
        // Scroll to the level card
        const card = document.querySelector(`.certification-card[data-level="${level}"]`);
        if (card) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Highlight the card temporarily
            card.style.boxShadow = '0 0 20px rgba(74, 144, 226, 0.6)';
            setTimeout(() => {
                card.style.boxShadow = '';
            }, 2000);
        }
    }

    switchView(viewName) {
        // Hide all views
        document.querySelectorAll('.view-container').forEach(view => {
            view.style.display = 'none';
        });

        // Remove active class from all nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Show selected view
        document.getElementById(`${viewName}-view`).style.display = 'block';

        // Add active class to clicked button
        document.querySelector(`.nav-btn[data-view="${viewName}"]`).classList.add('active');

        this.currentView = viewName;

        // Load view-specific data
        switch(viewName) {
            case 'home':
                this.showDailyRecommendation();
                break;
            case 'vocabulary':
                if (window.vocabularyModule) {
                    window.vocabularyModule.init();
                }
                break;
            case 'dashboard':
                if (window.dashboardModule) {
                    window.dashboardModule.loadDashboard();
                }
                break;
            case 'badges':
                if (window.badgesModule) {
                    window.badgesModule.loadBadges();
                }
                break;
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.eikenApp = new EikenApp();
});
