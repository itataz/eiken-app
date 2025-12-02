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

        // Update UI
        document.getElementById('total-study-time').textContent = `${totalSessions}回`;
        document.getElementById('accuracy-rate').textContent = `${accuracyRate}%`;
        document.getElementById('weekly-study').textContent = `${weeklySessions}回`;
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
}

// Initialize when app is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (window.eikenApp) {
            window.dashboardModule = new DashboardModule(window.eikenApp);
        }
    }, 100);
});
