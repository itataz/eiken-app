// Spaced Repetition System - Leitner Box Method
class SpacedRepetitionSystem {
    constructor(app) {
        this.app = app;
        this.boxes = this.loadBoxes();
    }

    loadBoxes() {
        const saved = localStorage.getItem('spacedRepetitionBoxes');
        if (saved) {
            return JSON.parse(saved);
        }
        // Initialize 5 boxes (Leitner system)
        return {
            box1: [], // Review daily
            box2: [], // Review every 3 days
            box3: [], // Review weekly
            box4: [], // Review bi-weekly
            box5: []  // Mastered
        };
    }

    saveBoxes() {
        localStorage.setItem('spacedRepetitionBoxes', JSON.stringify(this.boxes));
    }

    // Add a word/question to box 1 (new items)
    addItem(item) {
        const itemData = {
            id: item.word || item.question,
            level: item.level || 'unknown',
            type: item.word ? 'vocabulary' : 'question',
            addedDate: new Date().toISOString(),
            lastReviewed: null,
            box: 1
        };

        // Check if item already exists
        const existingBox = this.findItemBox(itemData.id);
        if (!existingBox) {
            this.boxes.box1.push(itemData);
            this.saveBoxes();
        }
    }

    // Find which box contains the item
    findItemBox(itemId) {
        for (let boxNum = 1; boxNum <= 5; boxNum++) {
            const box = this.boxes[`box${boxNum}`];
            const item = box.find(i => i.id === itemId);
            if (item) {
                return { boxNum, item };
            }
        }
        return null;
    }

    // Move item on correct answer
    promoteItem(itemId) {
        const result = this.findItemBox(itemId);
        if (!result) return;

        const { boxNum, item } = result;

        // Remove from current box
        this.boxes[`box${boxNum}`] = this.boxes[`box${boxNum}`].filter(i => i.id !== itemId);

        // Move to next box (up to box 5)
        const nextBox = Math.min(boxNum + 1, 5);
        item.box = nextBox;
        item.lastReviewed = new Date().toISOString();
        this.boxes[`box${nextBox}`].push(item);

        this.saveBoxes();
    }

    // Move item back on incorrect answer
    demoteItem(itemId) {
        const result = this.findItemBox(itemId);
        if (!result) return;

        const { boxNum, item } = result;

        // Remove from current box
        this.boxes[`box${boxNum}`] = this.boxes[`box${boxNum}`].filter(i => i.id !== itemId);

        // Move back to box 1
        item.box = 1;
        item.lastReviewed = new Date().toISOString();
        this.boxes.box1.push(item);

        this.saveBoxes();
    }

    // Get items that need review today
    getItemsDueForReview() {
        const now = new Date();
        const dueItems = [];

        // Box 1: Daily review
        this.boxes.box1.forEach(item => {
            if (this.shouldReview(item, 1)) {
                dueItems.push(item);
            }
        });

        // Box 2: Every 3 days
        this.boxes.box2.forEach(item => {
            if (this.shouldReview(item, 3)) {
                dueItems.push(item);
            }
        });

        // Box 3: Weekly (7 days)
        this.boxes.box3.forEach(item => {
            if (this.shouldReview(item, 7)) {
                dueItems.push(item);
            }
        });

        // Box 4: Bi-weekly (14 days)
        this.boxes.box4.forEach(item => {
            if (this.shouldReview(item, 14)) {
                dueItems.push(item);
            }
        });

        return dueItems;
    }

    shouldReview(item, dayInterval) {
        if (!item.lastReviewed) {
            return true; // Never reviewed, needs review
        }

        const lastReviewDate = new Date(item.lastReviewed);
        const now = new Date();
        const daysSinceReview = (now - lastReviewDate) / (1000 * 60 * 60 * 24);

        return daysSinceReview >= dayInterval;
    }

    // Get statistics
    getStats() {
        return {
            newItems: this.boxes.box1.length,
            learning: this.boxes.box2.length + this.boxes.box3.length,
            reviewing: this.boxes.box4.length,
            mastered: this.boxes.box5.length,
            dueToday: this.getItemsDueForReview().length
        };
    }

    // Get items by level
    getItemsByLevel(level) {
        const allItems = [];
        for (let boxNum = 1; boxNum <= 5; boxNum++) {
            const boxItems = this.boxes[`box${boxNum}`].filter(item => item.level === level);
            allItems.push(...boxItems);
        }
        return allItems;
    }
}

// Initialize when app is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (window.eikenApp) {
            window.spacedRepetitionSystem = new SpacedRepetitionSystem(window.eikenApp);
        }
    }, 100);
});
