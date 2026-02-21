// UI Elements
const navLinks = document.querySelectorAll('.nav-links li');
const contentArea = document.querySelector('.content-area');
const fabAi = document.querySelector('.fab-ai');
const aiDrawer = document.querySelector('.ai-drawer');
const closeDrawerBtn = document.querySelector('.close-btn');

// State
window.currentView = 'dashboard';

// View Components (Mocked for now)
window.views = {
    dashboard: `
        <div class="view dashboard-view">
            <h2>Dashboard</h2>
            <p>Loading dashboard...</p>
        </div>
    `,
    goals: `
        <div class="view goals-view">
            <h2>Goals & Projects</h2>
            <p>Map out your long-term ambitions here.</p>
        </div>
    `,
    planner: `
        <div class="view planner-view">
            <h2>Daily Planner</h2>
            <p>Time block your day.</p>
        </div>
    `,
    notes: `
        <div class="view notes-view">
            <h2>Notes</h2>
            <p>Quick capture your thoughts.</p>
        </div>
    `
};

// Functions
window.renderView = function (viewName) {
    if (window.views[viewName]) {
        contentArea.innerHTML = window.views[viewName];
    } else {
        contentArea.innerHTML = '<h2>404 - View Not Found</h2>';
    }
}

function handleNavigation(e) {
    const li = e.currentTarget;
    const view = li.dataset.view;

    // Update active state
    navLinks.forEach(link => link.classList.remove('active'));
    li.classList.add('active');

    // Render new view
    window.currentView = view;
    window.renderView(window.currentView);
}

function toggleAiDrawer() {
    aiDrawer.classList.toggle('closed');
}

// Event Listeners
navLinks.forEach(link => {
    link.addEventListener('click', handleNavigation);
});

fabAi.addEventListener('click', toggleAiDrawer);
closeDrawerBtn.addEventListener('click', toggleAiDrawer);

// Initialize
function init() {
    window.renderView(window.currentView);
}

init();
