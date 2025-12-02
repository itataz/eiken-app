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
