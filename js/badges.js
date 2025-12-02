// Badges Module
class BadgesModule {
    constructor(app) {
        this.app = app;
        this.allBadges = [
            {
                id: 'first_login',
                name: '初ログイン',
                description: 'アプリに初めてログインしました',
                icon: '🎉',
                condition: 'auto'
            },
            {
                id: 'streak_3',
                name: '3日連続',
                description: '3日間連続で学習しました',
                icon: '🔥',
                condition: 'streak >= 3'
            },
            {
                id: 'streak_7',
                name: '1週間連続',
                description: '7日間連続で学習しました',
                icon: '⭐',
                condition: 'streak >= 7'
            },
            {
                id: 'streak_30',
                name: '1ヶ月連続',
                description: '30日間連続で学習しました',
                icon: '🏆',
                condition: 'streak >= 30'
            },
            {
                id: 'points_100',
                name: '100ポイント達成',
                description: '合計100ポイントを獲得しました',
                icon: '💯',
                condition: 'points >= 100'
            },
            {
                id: 'points_500',
                name: '500ポイント達成',
                description: '合計500ポイントを獲得しました',
                icon: '🌟',
                condition: 'points >= 500'
            },
            {
                id: 'points_1000',
                name: '1000ポイント達成',
                description: '合計1000ポイントを獲得しました',
                icon: '👑',
                condition: 'points >= 1000'
            },
            {
                id: 'perfect_eiken5',
                name: 'Perfect 英検5級',
                description: '英検5級の単語学習で満点を取得',
                icon: '🥉',
                condition: 'manual'
            },
            {
                id: 'perfect_eiken4',
                name: 'Perfect 英検4級',
                description: '英検4級の単語学習で満点を取得',
                icon: '🥉',
                condition: 'manual'
            },
            {
                id: 'perfect_eiken3',
                name: 'Perfect 英検3級',
                description: '英検3級の単語学習で満点を取得',
                icon: '🥈',
                condition: 'manual'
            },
            {
                id: 'perfect_eiken2',
                name: 'Perfect 英検2級',
                description: '英検2級の単語学習で満点を取得',
                icon: '🥇',
                condition: 'manual'
            },
            {
                id: 'perfect_eiken1',
                name: 'Perfect 英検1級',
                description: '英検1級の単語学習で満点を取得',
                icon: '💎',
                condition: 'manual'
            },
            {
                id: 'vocab_master_50',
                name: '単語マスター50',
                description: '50個の単語を正解しました',
                icon: '📚',
                condition: 'vocab_correct >= 50'
            },
            {
                id: 'vocab_master_100',
                name: '単語マスター100',
                description: '100個の単語を正解しました',
                icon: '📖',
                condition: 'vocab_correct >= 100'
            },
            {
                id: 'vocab_master_500',
                name: '単語マスター500',
                description: '500個の単語を正解しました',
                icon: '🎓',
                condition: 'vocab_correct >= 500'
            },
            {
                id: 'early_bird',
                name: '早起き学習者',
                description: '朝6時前に学習しました',
                icon: '🌅',
                condition: 'manual'
            },
            {
                id: 'night_owl',
                name: '夜更かし学習者',
                description: '夜10時以降に学習しました',
                icon: '🦉',
                condition: 'manual'
            }
        ];
    }

    async loadBadges() {
        await this.checkAndAwardBadges();
        this.displayBadges();
    }

    async checkAndAwardBadges() {
        if (!this.app.gamificationData) {
            await this.app.loadGamificationData();
        }

        const currentPoints = this.app.gamificationData.totalPoints || 0;
        const currentStreak = this.app.gamificationData.currentStreak || 0;
        const earnedBadges = this.app.gamificationData.badges || [];
        const earnedBadgeIds = earnedBadges.map(b => b.name);

        // Get vocabulary progress from localStorage
        let totalVocabCorrect = 0;
        const vocabProgress = this.app.getVocabularyProgress();

        Object.values(vocabProgress).forEach(progress => {
            totalVocabCorrect += progress.correct || 0;
        });

        // Check each badge
        for (const badge of this.allBadges) {
            if (earnedBadgeIds.includes(badge.id)) {
                continue; // Already earned
            }

            let shouldAward = false;

            switch (badge.condition) {
                case 'auto':
                    shouldAward = true;
                    break;
                case 'streak >= 3':
                    shouldAward = currentStreak >= 3;
                    break;
                case 'streak >= 7':
                    shouldAward = currentStreak >= 7;
                    break;
                case 'streak >= 30':
                    shouldAward = currentStreak >= 30;
                    break;
                case 'points >= 100':
                    shouldAward = currentPoints >= 100;
                    break;
                case 'points >= 500':
                    shouldAward = currentPoints >= 500;
                    break;
                case 'points >= 1000':
                    shouldAward = currentPoints >= 1000;
                    break;
                case 'vocab_correct >= 50':
                    shouldAward = totalVocabCorrect >= 50;
                    break;
                case 'vocab_correct >= 100':
                    shouldAward = totalVocabCorrect >= 100;
                    break;
                case 'vocab_correct >= 500':
                    shouldAward = totalVocabCorrect >= 500;
                    break;
            }

            if (shouldAward) {
                await this.app.updateGamification(0, badge.id, null);
                this.showBadgeNotification(badge);
            }
        }

        // Reload gamification data after checking
        await this.app.loadGamificationData();
    }

    showBadgeNotification(badge) {
        const notification = document.createElement('div');
        notification.className = 'badge-notification';
        notification.innerHTML = `
            <div class="badge-notification-content">
                <span class="badge-icon-large">${badge.icon}</span>
                <h3>新しいバッジ獲得！</h3>
                <p><strong>${badge.name}</strong></p>
                <p class="badge-description">${badge.description}</p>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 4000);
    }

    displayBadges() {
        const container = document.getElementById('badges-container');
        const earnedBadges = this.app.gamificationData.badges || [];
        const earnedBadgeIds = earnedBadges.map(b => b.name);

        container.innerHTML = this.allBadges.map(badge => {
            const isEarned = earnedBadgeIds.includes(badge.id);
            const earnedDate = isEarned ? earnedBadges.find(b => b.name === badge.id)?.earnedAt : null;

            return `
                <div class="badge-card ${isEarned ? 'earned' : 'locked'}">
                    <div class="badge-icon">${isEarned ? badge.icon : '🔒'}</div>
                    <h3>${badge.name}</h3>
                    <p>${badge.description}</p>
                    ${isEarned && earnedDate ? `<p class="earned-date">獲得日: ${new Date(earnedDate).toLocaleDateString('ja-JP')}</p>` : ''}
                </div>
            `;
        }).join('');
    }
}

// Initialize when app is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (window.eikenApp) {
            window.badgesModule = new BadgesModule(window.eikenApp);
        }
    }, 100);
});
