class StudyPlanner {
    constructor(app) {
        this.app = app;
        this.plan = null;

        this.initializeEventListeners();
        this.loadExistingPlan();
    }

    initializeEventListeners() {
        document.getElementById('create-plan-btn')?.addEventListener('click', () => this.createPlan());
    }

    loadExistingPlan() {
        const savedPlan = localStorage.getItem('study_plan');
        if (savedPlan) {
            this.plan = JSON.parse(savedPlan);
            this.displayPlan();
        }
    }

    createPlan() {
        const targetLevel = document.getElementById('target-level').value;
        const examDate = document.getElementById('exam-date').value;
        const dailyStudyTime = parseInt(document.getElementById('daily-study-time').value);

        if (!targetLevel || !examDate) {
            alert('目標級と試験日を入力してください。');
            return;
        }

        const today = new Date();
        const exam = new Date(examDate);
        const daysUntilExam = Math.ceil((exam - today) / (1000 * 60 * 60 * 24));

        if (daysUntilExam < 0) {
            alert('試験日は今日以降の日付を選択してください。');
            return;
        }

        // Create study plan
        this.plan = {
            targetLevel,
            examDate,
            dailyStudyTime,
            createdDate: today.toISOString(),
            daysUntilExam,
            totalStudyHours: Math.floor((daysUntilExam * dailyStudyTime) / 60),
            weeklyPlan: this.generateWeeklyPlan(targetLevel, daysUntilExam, dailyStudyTime),
            checklist: this.generateChecklist(targetLevel, daysUntilExam)
        };

        // Save plan
        localStorage.setItem('study_plan', JSON.stringify(this.plan));

        // Display plan
        this.displayPlan();
    }

    generateWeeklyPlan(level, daysUntilExam, dailyMinutes) {
        const weeksUntilExam = Math.ceil(daysUntilExam / 7);
        const plan = [];

        // Study distribution percentages
        const distribution = {
            vocabulary: 30,
            grammar: 25,
            reading: 20,
            listening: 15,
            writing: 10  // For 2級 and above
        };

        for (let week = 1; week <= Math.min(weeksUntilExam, 12); week++) {
            const weekPlan = {
                week,
                focus: this.getWeeklyFocus(week, weeksUntilExam),
                tasks: []
            };

            // Distribute daily study time
            if (week <= weeksUntilExam - 4) {
                // Focus on building foundation
                weekPlan.tasks = [
                    `単語学習 (${Math.floor(dailyMinutes * distribution.vocabulary / 100)}分/日)`,
                    `文法問題 (${Math.floor(dailyMinutes * distribution.grammar / 100)}分/日)`,
                    `リーディング (${Math.floor(dailyMinutes * distribution.reading / 100)}分/日)`,
                    `リスニング (${Math.floor(dailyMinutes * distribution.listening / 100)}分/日)`
                ];
            } else if (week <= weeksUntilExam - 1) {
                // Practice with past papers
                weekPlan.tasks = [
                    '過去問演習（1日1セット）',
                    '弱点分野の復習',
                    'リスニング強化',
                    '二次試験対策（3級以上）'
                ];
            } else {
                // Final week - review and mock tests
                weekPlan.tasks = [
                    '総合模擬試験',
                    '間違えた問題の総復習',
                    '頻出単語の最終確認',
                    'リスニング音声の反復'
                ];
            }

            plan.push(weekPlan);
        }

        return plan;
    }

    getWeeklyFocus(week, totalWeeks) {
        if (week <= totalWeeks - 4) {
            return '基礎力強化期';
        } else if (week <= totalWeeks - 1) {
            return '実践演習期';
        } else {
            return '総仕上げ期';
        }
    }

    generateChecklist(level, daysUntilExam) {
        const checklist = [
            { task: '語彙力強化（頻出単語1000語）', completed: false },
            { task: '文法問題集を2周', completed: false },
            { task: '過去問5回分を解く', completed: false },
            { task: 'リスニング問題50問', completed: false },
            { task: '長文読解20問', completed: false }
        ];

        // Add level-specific items
        if (level === '英検3級' || level.includes('2級') || level.includes('1級')) {
            checklist.push({ task: '二次試験の面接練習（10回）', completed: false });
        }

        if (level === '英検2級' || level.includes('準1級') || level === '英検1級') {
            checklist.push({ task: 'ライティング練習（10問）', completed: false });
        }

        return checklist;
    }

    displayPlan() {
        if (!this.plan) return;

        // Show study plan section
        document.getElementById('study-plan').style.display = 'block';

        // Display summary
        const summaryHtml = `
            <div class="plan-card">
                <h4>📋 学習計画サマリー</h4>
                <div class="plan-stats">
                    <div class="stat-item">
                        <span class="stat-label">目標級:</span>
                        <span class="stat-value">${this.plan.targetLevel}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">試験日:</span>
                        <span class="stat-value">${new Date(this.plan.examDate).toLocaleDateString('ja-JP')}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">残り日数:</span>
                        <span class="stat-value">${this.plan.daysUntilExam}日</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">1日の学習時間:</span>
                        <span class="stat-value">${this.plan.dailyStudyTime}分</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">総学習時間:</span>
                        <span class="stat-value">${this.plan.totalStudyHours}時間</span>
                    </div>
                </div>
            </div>
        `;
        document.getElementById('plan-summary').innerHTML = summaryHtml;

        // Display weekly plan
        const weeklyHtml = `
            <h4>📅 週間学習計画</h4>
            <div class="weeks-container">
                ${this.plan.weeklyPlan.map(week => `
                    <div class="week-card">
                        <h5>第${week.week}週 - ${week.focus}</h5>
                        <ul class="task-list">
                            ${week.tasks.map(task => `<li>${task}</li>`).join('')}
                        </ul>
                    </div>
                `).join('')}
            </div>
        `;
        document.getElementById('weekly-plan').innerHTML = weeklyHtml;

        // Display checklist
        const checklistHtml = `
            <h4>✅ 学習チェックリスト</h4>
            <div class="checklist-items">
                ${this.plan.checklist.map((item, index) => `
                    <div class="checklist-item ${item.completed ? 'completed' : ''}">
                        <input type="checkbox"
                               id="check-${index}"
                               ${item.completed ? 'checked' : ''}
                               onchange="window.planner.toggleChecklistItem(${index})">
                        <label for="check-${index}">${item.task}</label>
                    </div>
                `).join('')}
            </div>
        `;
        document.getElementById('study-checklist').innerHTML = checklistHtml;
    }

    toggleChecklistItem(index) {
        if (!this.plan) return;

        this.plan.checklist[index].completed = !this.plan.checklist[index].completed;
        localStorage.setItem('study_plan', JSON.stringify(this.plan));

        // Check if all items are completed
        const allCompleted = this.plan.checklist.every(item => item.completed);
        if (allCompleted) {
            alert('🎉 おめでとうございます！全てのチェックリストを完了しました！');
            this.app.updatePoints(100);
        }
    }
}
