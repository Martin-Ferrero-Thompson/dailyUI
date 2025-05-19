// Theme management
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'system';
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const slider = document.getElementById('slider');
    
    // Set the initial slider position
    updateSliderPosition(savedTheme);
    
    // Apply the theme
    if (savedTheme === 'dark' || (savedTheme === 'system' && prefersDark)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

function updateSliderPosition(theme) {
    const slider = document.getElementById('slider');
    if (!slider) return;
    
    switch (theme) {
        case 'light':
            slider.style.transform = 'translateX(0)';
            break;
        case 'system':
            slider.style.transform = 'translateX(calc(100% + 0.25rem))';
            break;
        case 'dark':
            slider.style.transform = 'translateX(calc(200% + 0.5rem))';
            break;
    }
}

function setTheme(theme) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Update the slider position
    updateSliderPosition(theme);
    
    // Save the theme preference
    localStorage.setItem('theme', theme);
    
    // Apply the theme
    if (theme === 'dark' || (theme === 'system' && prefersDark)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

// Challenge management
let challenges = [];
let currentChallenge = null;

async function loadChallenges() {
    try {
        const response = await fetch('./challenges.json');
        const data = await response.json();
        challenges = data.challenges.sort((a, b) => b.id - a.id);
        renderShowcase();
        renderNumberBoard();
    } catch (error) {
        console.error('Error loading challenges:', error);
    }
}

function renderShowcase() {
    if (!challenges.length) return;
    
    const showcase = document.getElementById('showcase');
    const latestChallenge = challenges[0];
    
    showcase.innerHTML = `
        <article class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-200 animate-fade-in">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <img src="${latestChallenge.image}" alt="${latestChallenge.title}" 
                    class="w-full h-96 object-cover"
                    onerror="this.src='./assets/images/DailyUI-logo.jpg'">
                <div class="p-8">
                    <h3 class="text-3xl font-bold text-slate-800 dark:text-white mb-4">#${latestChallenge.id}: ${latestChallenge.title}</h3>
                    <p class="text-xl text-slate-600 dark:text-slate-300 mb-6">${latestChallenge.description}</p>
                    <div class="flex gap-4">
                        <button type="button" data-link="${latestChallenge.exampleLink}"
                           class="showcase-link z-0 px-6 py-3 rounded-lg border-2 border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-400 dark:hover:text-white transition-colors">
                           View Examples
                        </button>
                        <button type="button" data-link="${latestChallenge.solutionLink}"
                           class="showcase-link z-0 text-white bg-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors">
                           View Solution
                        </button>
                    </div>
                </div>
            </div>
        </article>
    `;

    // Add event listeners to the links
    showcase.querySelectorAll('.showcase-link').forEach(button => {
        button.addEventListener('click', (e) => {
            const url = e.currentTarget.dataset.link;
            window.open(url, '_blank', 'noopener,noreferrer');
        });
    });
}

function renderNumberBoard() {
    const board = document.getElementById('number-board');
    const totalChallenges = 200; // Total planned challenges
    
    let html = `
        <div class="border-2 border-slate-200 dark:border-slate-700 rounded-xl p-6 bg-white/50 dark:bg-slate-800/50 shadow-lg backdrop-blur-sm">
            <div class="grid grid-cols-10 gap-1 max-w-2xl mx-auto">`;
    
    for (let i = 1; i <= totalChallenges; i++) {
        const challenge = challenges.find(c => parseInt(c.id) === i);
        const padded = i.toString().padStart(3, '0');
        const status = challenge ? 'completed' : 'pending';
        
        html += `
            <button 
                onclick="showChallengeModal('${padded}')"
                class="aspect-square rounded-md ${status === 'completed' 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'} 
                    transition-all duration-200 text-xs font-medium p-1
                    hover:shadow-lg hover:-translate-y-0.5 hover:scale-110"
            >${padded}</button>
        `;
    }
    
    html += `
            </div>
        </div>`;
    board.innerHTML = html;
}

function showChallengeModal(id) {
    const challenge = challenges.find(c => c.id === id) || {
        id,
        title: 'Coming Soon',
        description: 'This challenge has not been completed yet.',
        image: 'placeholder.jpg',
        exampleLink: '#',
        solutionLink: '#',
        completed: false
    };

    const modal = document.getElementById('challenge-modal');
    const modalContent = document.getElementById('modal-content');
    
    modalContent.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden max-w-4xl w-full mx-4">
            <div class="relative">
                <button onclick="closeModal()" 
                        class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div class="p-6">
                <h3 class="text-2xl font-bold text-slate-800 dark:text-white mb-4">
                    #${challenge.id}: ${challenge.title}
                </h3>
                <p class="text-slate-600 dark:text-slate-300 mb-6">${challenge.description}</p>
                ${challenge.completed ? `
                    <img src="${challenge.image}" alt="${challenge.title}" 
                        class="w-full h-64 object-cover rounded-lg mb-6"
                        onerror="this.src='./assets/images/DailyUI-logo.jpg'">
                    <div class="flex justify-end gap-4">
                        <a href="${challenge.exampleLink}" target="_blank" rel="noopener noreferrer"
                           class="px-4 py-2 rounded-lg border-2 border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-400 dark:hover:text-white transition-colors">
                           View Examples
                        </a>
                        <a href="${challenge.solutionLink}" target="_blank" rel="noopener noreferrer"
                           class="text-white bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                           View Solution
                        </a>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    
    modal.classList.remove('hidden');
}

function closeModal() {
    const modal = document.getElementById('challenge-modal');
    modal.classList.add('hidden');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    initializeTheme();
    
    // Set up theme toggle buttons
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', (e) => {
                const theme = e.currentTarget.dataset.theme;
                setTheme(theme);
            });
        });
    }

    // Load and render challenges
    loadChallenges();

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (localStorage.getItem('theme') === 'system') {
            if (e.matches) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    });

    // Close modal when clicking outside
    const modal = document.getElementById('challenge-modal');
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
});
