// Dashboard Module - Static Site Version
class DashboardModule {
    constructor(app) {
        this.app = app;
        this.progressData = [];
        this.vocabularyProgress = {};
    }

    async loadDashboard() {
        this.loadProgressData();
        this.loadVocabularyProgress();
        this.displayStats();
        this.drawProgressChart();
        this.displayWeakPoints();
    }

    loadProgressData() {
        this.progressData = this.app.getProgress();
    }

    loadVocabularyProgress() {
        this.vocabularyProgress = this.app.getVocabularyProgress();
    }

    displayStats() {
        // Calculate total study sessions
        const totalSessions = this.progressData.length;

        // Calculate accuracy rate
        let totalQuestions = 0;
        let correctAnswers = 0;

        this.progressData.forEach(session => {
            if (session.score !== undefined) {
                totalQuestions++;
                correctAnswers += session.score;
            }
        });

        const accuracyRate = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

        // Calculate weekly study count
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const weeklySessions = this.progressData.filter(session => {
            return new Date(session.timestamp) >= oneWeekAgo;
        }).length;

        // Calculate study streak
        const streak = this.app.gamificationData.currentStreak || 0;

        // Calculate total vocabulary learned
        const vocabLearned = Object.keys(this.vocabularyProgress).length;

        // Calculate average accuracy by level
        const levelAccuracy = this.calculateLevelAccuracy();

        // Update UI
        document.getElementById('total-study-time').textContent = `${totalSessions}回`;
        document.getElementById('accuracy-rate').textContent = `${accuracyRate}%`;
        document.getElementById('weekly-study').textContent = `${weeklySessions}回`;

        // Add additional stats if elements exist
        const streakElement = document.getElementById('study-streak');
        if (streakElement) {
            streakElement.textContent = `${streak}日`;
        }

        const vocabElement = document.getElementById('vocab-learned');
        if (vocabElement) {
            vocabElement.textContent = `${vocabLearned}語`;
        }

        // Display level-specific progress
        this.displayLevelProgress(levelAccuracy);
    }

    calculateLevelAccuracy() {
        const levelStats = {};

        this.progressData.forEach(session => {
            if (!levelStats[session.level]) {
                levelStats[session.level] = {
                    total: 0,
                    correct: 0
                };
            }
            levelStats[session.level].total++;
            if (session.score) {
                levelStats[session.level].correct += session.score;
            }
        });

        return levelStats;
    }

    displayLevelProgress(levelAccuracy) {
        const container = document.getElementById('level-progress-container');
        if (!container) return;

        const levels = ['英検5級', '英検4級', '英検3級', '英検準2級', '英検2級', '英検準1級', '英検1級'];

        let html = '<h3>級別進捗状況</h3><div class="level-progress-grid">';

        levels.forEach(level => {
            const stats = levelAccuracy[level];
            if (stats) {
                const accuracy = Math.round((stats.correct / stats.total) * 100);
                const progressClass = accuracy >= 80 ? 'excellent' : accuracy >= 60 ? 'good' : 'needs-work';

                html += `
                    <div class="level-progress-card ${progressClass}">
                        <h4>${level}</h4>
                        <div class="progress-circle">
                            <span class="progress-value">${accuracy}%</span>
                        </div>
                        <p>${stats.total}回学習</p>
                    </div>
                `;
            }
        });

        html += '</div>';
        container.innerHTML = html;
    }

    drawProgressChart() {
        const canvas = document.getElementById('progress-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (this.progressData.length === 0) {
            ctx.font = '16px Arial';
            ctx.fillStyle = '#666';
            ctx.textAlign = 'center';
            ctx.fillText('学習データがありません', canvas.width / 2, canvas.height / 2);
            return;
        }

        // Prepare data - group by date
        const dataByDate = {};
        this.progressData.forEach(session => {
            const date = new Date(session.timestamp).toLocaleDateString('ja-JP');
            if (!dataByDate[date]) {
                dataByDate[date] = { count: 0, totalScore: 0 };
            }
            dataByDate[date].count++;
            if (session.score !== undefined) {
                dataByDate[date].totalScore += session.score;
            }
        });

        const dates = Object.keys(dataByDate).slice(-7); // Last 7 days
        const counts = dates.map(date => dataByDate[date].count);

        // Draw chart
        const padding = 40;
        const chartWidth = canvas.width - padding * 2;
        const chartHeight = canvas.height - padding * 2;

        const maxCount = Math.max(...counts, 1);
        const barWidth = chartWidth / dates.length;

        // Draw axes
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, canvas.height - padding);
        ctx.lineTo(canvas.width - padding, canvas.height - padding);
        ctx.stroke();

        // Draw bars
        counts.forEach((count, index) => {
            const barHeight = (count / maxCount) * chartHeight;
            const x = padding + index * barWidth + barWidth * 0.1;
            const y = canvas.height - padding - barHeight;
            const width = barWidth * 0.8;

            ctx.fillStyle = '#4CAF50';
            ctx.fillRect(x, y, width, barHeight);

            // Draw count label
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(count, x + width / 2, y - 5);

            // Draw date label
            ctx.save();
            ctx.translate(x + width / 2, canvas.height - padding + 15);
            ctx.rotate(-Math.PI / 4);
            ctx.fillText(dates[index], 0, 0);
            ctx.restore();
        });

        // Draw title
        ctx.fillStyle = '#333';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('過去7日間の学習回数', canvas.width / 2, 20);
    }

    displayWeakPoints() {
        const weakPointsList = document.getElementById('weak-points-list');

        // Analyze vocabulary progress to find weak words
        const weakWords = [];

        Object.entries(this.vocabularyProgress).forEach(([word, progress]) => {
            const accuracy = progress.attempts > 0 ? (progress.correct / progress.attempts) * 100 : 0;
            if (accuracy < 70 && progress.attempts >= 2) {
                weakWords.push({
                    word,
                    accuracy: Math.round(accuracy),
                    level: progress.level
                });
            }
        });

        // Sort by accuracy (lowest first)
        weakWords.sort((a, b) => a.accuracy - b.accuracy);

        if (weakWords.length === 0) {
            weakPointsList.innerHTML = '<li>苦手な単語は見つかりませんでした！</li>';
            return;
        }

        weakPointsList.innerHTML = weakWords.slice(0, 10).map(item => `
            <li>
                <strong>${item.word}</strong>
                <span class="accuracy-badge">${item.accuracy}%</span>
                <span class="level-badge">${item.level}</span>
            </li>
        `).join('');
    }

    exportProgress() {
        // Gather all data from localStorage
        const exportData = {
            exportDate: new Date().toISOString(),
            version: '1.0',
            userData: {
                points: localStorage.getItem('total_points') || '0',
                badges: JSON.parse(localStorage.getItem('badges') || '[]'),
                streak: localStorage.getItem('streak') || '0',
                lastStudyDate: localStorage.getItem('last_study_date') || null
            },
            progress: this.progressData,
            vocabularyProgress: this.vocabularyProgress,
            studyPlan: JSON.parse(localStorage.getItem('study_plan') || 'null'),
            writingDrafts: {}
        };

        // Collect all writing drafts
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('writing_draft_')) {
                exportData.writingDrafts[key] = localStorage.getItem(key);
            }
        }

        // Create JSON file
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });

        // Create download link
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `eiken-progress-${new Date().toISOString().split('T')[0]}.json`;

        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        alert('📥 学習データをエクスポートしました！');
    }

    importProgress(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importData = JSON.parse(e.target.result);

                // Validate data structure
                if (!importData.version || !importData.userData) {
                    throw new Error('Invalid data format');
                }

                // Confirm before importing
                if (!confirm('現在のデータを上書きしますか？この操作は取り消せません。')) {
                    return;
                }

                // Import user data
                localStorage.setItem('total_points', importData.userData.points);
                localStorage.setItem('badges', JSON.stringify(importData.userData.badges));
                localStorage.setItem('streak', importData.userData.streak);
                if (importData.userData.lastStudyDate) {
                    localStorage.setItem('last_study_date', importData.userData.lastStudyDate);
                }

                // Import progress data
                localStorage.setItem('progress', JSON.stringify(importData.progress));
                localStorage.setItem('vocabulary_progress', JSON.stringify(importData.vocabularyProgress));

                // Import study plan
                if (importData.studyPlan) {
                    localStorage.setItem('study_plan', JSON.stringify(importData.studyPlan));
                }

                // Import writing drafts
                if (importData.writingDrafts) {
                    Object.keys(importData.writingDrafts).forEach(key => {
                        localStorage.setItem(key, importData.writingDrafts[key]);
                    });
                }

                alert('📤 学習データをインポートしました！ページを更新します。');
                window.location.reload();
            } catch (error) {
                console.error('Import error:', error);
                alert('エラー：データの読み込みに失敗しました。ファイルを確認してください。');
            }
        };
        reader.readAsText(file);
    }
}

// Initialize when app is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (window.eikenApp) {
            window.dashboardModule = new DashboardModule(window.eikenApp);
        }
    }, 100);
});
