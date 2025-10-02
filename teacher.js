const WORD_LISTS = {
    adjectives: ['BRIGHT', 'SWIFT', 'BRAVE', 'WISE', 'BOLD', 'CALM', 'KEEN', 'GRAND'],
    nouns: ['EAGLE', 'LION', 'TIGER', 'HAWK', 'BEAR', 'WOLF', 'FALCON', 'PHOENIX']
};

function generateClassroomCode() {
    const adjective = WORD_LISTS.adjectives[Math.floor(Math.random() * WORD_LISTS.adjectives.length)];
    const noun = WORD_LISTS.nouns[Math.floor(Math.random() * WORD_LISTS.nouns.length)];
    const number = Math.floor(Math.random() * 100);

    return `${adjective}-${noun}-${number}`;
}

const generateButton = document.getElementById('generate-code');
const codeDisplay = document.getElementById('code-display');
const classroomCodeElement = document.getElementById('classroom-code');
const copyButton = document.getElementById('copy-code');

if (generateButton) {
    generateButton.addEventListener('click', () => {
        const code = generateClassroomCode();
        classroomCodeElement.textContent = code;
        codeDisplay.style.display = 'block';
    });
}

if (copyButton) {
    copyButton.addEventListener('click', async () => {
        const code = classroomCodeElement.textContent;
        try {
            await navigator.clipboard.writeText(code);
            copyButton.textContent = 'Copied!';
            setTimeout(() => {
                copyButton.textContent = 'Copy to Clipboard';
            }, 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
            alert('Failed to copy code to clipboard');
        }
    });
}

const quizForm = document.getElementById('quiz-form');
const quizOutput = document.getElementById('quiz-output');
const quizJsonDisplay = document.getElementById('quiz-json');
const downloadQuizButton = document.getElementById('download-quiz');

if (quizForm) {
    quizForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(quizForm);
        const quiz = {
            question: formData.get('question'),
            options: [
                formData.get('optionA'),
                formData.get('optionB'),
                formData.get('optionC'),
                formData.get('optionD')
            ],
            correctIndex: parseInt(formData.get('correctAnswer')),
            timestamp: new Date().toISOString()
        };

        const jsonString = JSON.stringify(quiz, null, 2);
        quizJsonDisplay.textContent = jsonString;
        quizOutput.style.display = 'block';

        quizForm.reset();
    });
}

if (downloadQuizButton) {
    downloadQuizButton.addEventListener('click', () => {
        const jsonString = quizJsonDisplay.textContent;
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const filename = `quiz-${timestamp}.json`;

        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
}

async function loadCategoriesForFilters() {
    const categories = await getCategories();
    const checkboxGroup = document.getElementById('category-checkboxes');

    if (checkboxGroup) {
        checkboxGroup.innerHTML = categories.map(cat => `
            <label>
                <input type="checkbox" name="category-${cat.slug}" value="${cat.slug}" checked>
                ${cat.title}
            </label>
        `).join('');
    }
}

const filterForm = document.getElementById('filter-form');
const filterOutput = document.getElementById('filter-output');
const filterJsonDisplay = document.getElementById('filter-json');
const downloadFilterButton = document.getElementById('download-filter');

if (filterForm) {
    loadCategoriesForFilters();

    filterForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(filterForm);
        const categories = Array.from(formData.keys())
            .filter(key => key.startsWith('category-'))
            .map(key => formData.get(key));

        const preset = {
            name: 'Content Filter Preset',
            categories: categories,
            dateRange: {
                start: parseInt(formData.get('startYear')),
                end: parseInt(formData.get('endYear'))
            },
            timestamp: new Date().toISOString()
        };

        const jsonString = JSON.stringify(preset, null, 2);
        filterJsonDisplay.textContent = jsonString;
        filterOutput.style.display = 'block';
    });
}

if (downloadFilterButton) {
    downloadFilterButton.addEventListener('click', () => {
        const jsonString = filterJsonDisplay.textContent;
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const filename = `filter-preset-${timestamp}.json`;

        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
}
