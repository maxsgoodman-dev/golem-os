// CSS specific to Dashboard (Will inject into a style tag or external file later, keeping it here for prototyping speed)
const dashboardStyles = `
    .dashboard-header {
        margin-bottom: 2rem;
    }
    
    .dashboard-header h2 {
        font-size: 2rem;
        margin-bottom: 0.5rem;
    }

    .dashboard-grid {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 1.5rem;
    }

    .glass-panel {
        background: var(--glass-bg);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-xl);
        padding: 1.5rem;
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
    }

    .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        border-bottom: 1px solid var(--glass-border);
        padding-bottom: 0.5rem;
    }

    /* Goals / Todo Widget */
    .todo-list {
        list-style: none;
    }

    .todo-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.75rem;
        background: var(--bg-tertiary);
        border-radius: var(--radius-md);
        margin-bottom: 0.5rem;
        transition: transform var(--transition-fast);
    }

    .todo-item:hover {
        transform: translateX(4px);
        background: var(--bg-secondary);
    }

    .todo-checkbox {
        width: 1.25rem;
        height: 1.25rem;
        border-radius: 4px;
        border: 2px solid var(--accent-primary);
        cursor: pointer;
    }

    /* Calendar Widget */
    .mini-calendar {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 0.25rem;
        text-align: center;
        margin-top: 1rem;
    }

    .cal-day-header {
        font-size: 0.75rem;
        color: var(--text-muted);
        font-weight: 600;
        margin-bottom: 0.5rem;
    }

    .cal-day {
        aspect-ratio: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--radius-sm);
        font-size: 0.875rem;
        cursor: pointer;
        transition: background var(--transition-fast);
    }

    .cal-day:hover {
        background: var(--bg-tertiary);
    }

    .cal-day.active {
        background: var(--accent-primary);
        color: white;
        font-weight: bold;
    }

    /* Quick Notes */
    .quick-note-input {
        width: 100%;
        background: var(--bg-primary);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-md);
        padding: 0.75rem;
        color: var(--text-primary);
        resize: vertical;
        min-height: 80px;
        margin-bottom: 1rem;
    }
    
    .btn-primary {
        background: var(--accent-primary);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: var(--radius-md);
        font-weight: 500;
        transition: background var(--transition-fast);
        width: 100%;
    }

    .btn-primary:hover {
        background: var(--accent-hover);
    }
`;

// Inject styles directly
const styleTag = document.createElement('style');
styleTag.innerHTML = dashboardStyles;
document.head.appendChild(styleTag);

// Generate Mock Calendar Days
const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
let calDaysHtml = days.map(d => `<div class="cal-day-header">${d}</div>`).join('');
for (let i = 1; i <= 28; i++) { // Mock simple 28 day month
    calDaysHtml += `<div class="cal-day ${i === 20 ? 'active' : ''}">${i}</div>`; // Assuming today is 20th
}

// Override Views with real templates
window.views.dashboard = () => {
    const tasks = window.appState?.tasks || [];
    const notes = window.appState?.notes || [];

    let tasksHtml = '';
    if (tasks.length === 0) {
        tasksHtml = '<div style="color: var(--text-muted); font-size: 0.875rem;">No tasks due. Treat yourself to a break!</div>';
    } else {
        tasksHtml = tasks.map(task => `
            <li class="todo-item" onclick="window.toggleTask('${task.id}')">
                <div class="todo-checkbox" style="${task.completed ? 'background: var(--accent-primary);' : ''}"></div>
                <div style="${task.completed ? 'text-decoration: line-through; opacity: 0.5;' : ''}">
                    <h4 style="margin-bottom: 0; font-size: 0.95rem;">${task.title}</h4>
                    <span style="font-size: 0.75rem; color: var(--text-muted)">${task.project || 'General'}</span>
                </div>
            </li>
        `).join('');
    }

    const recentNote = notes.length > 0 ? notes[notes.length - 1] : null;

    return `
    <div class="view dashboard-view">
        <div class="dashboard-header">
            <h2>Good Afternoon, Max</h2>
            <p>Here is your overview for today.</p>
        </div>

        <div class="dashboard-grid">
            <!-- Left Column: Large widgets -->
            <div class="main-widgets" style="display: flex; flex-direction: column; gap: 1.5rem;">
                
                <!-- Priority Goals & Tasks -->
                <div class="glass-panel">
                    <div class="panel-header">
                        <h3>Priority Actions</h3>
                        <div style="display: flex; gap: 0.5rem; align-items: center;">
                            <input type="text" id="quick-task-input" placeholder="New task..." style="background: var(--bg-primary); border: 1px solid var(--glass-border); padding: 0.25rem 0.5rem; border-radius: var(--radius-sm); color: white; font-size: 0.75rem;">
                            <button class="btn-primary" style="width: auto; padding: 0.25rem 0.5rem; font-size: 0.75rem;" onclick="window.addQuickTask()">Add</button>
                        </div>
                    </div>
                    <ul class="todo-list">
                        ${tasksHtml}
                    </ul>
                </div>

                <!-- Upcoming Reminders -->
                <div class="glass-panel" style="background: linear-gradient(145deg, var(--bg-secondary), var(--bg-tertiary));">
                    <div class="panel-header" style="border-bottom-color: rgba(255,255,255,0.05);">
                        <h3>Upcoming Reminders</h3>
                    </div>
                    <div style="display: flex; gap: 1rem; overflow-x: auto; padding-bottom: 0.5rem;">
                        <div style="min-width: 200px; background: var(--bg-primary); padding: 1rem; border-radius: var(--radius-md); border-left: 3px solid var(--warning);">
                            <p style="font-size: 0.875rem; font-weight: 500; margin-bottom: 0.25rem; color: var(--text-primary);">Call Mom</p>
                            <p style="font-size: 0.75rem;">Today, 6:00 PM</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Column: Sidebar widgets -->
            <div class="side-widgets" style="display: flex; flex-direction: column; gap: 1.5rem;">
                
                <!-- Calendar Widget -->
                <div class="glass-panel">
                    <div class="panel-header">
                        <h3>February</h3>
                    </div>
                    <div class="mini-calendar">
                        ${calDaysHtml}
                    </div>
                </div>

                <!-- Quick Notes Widget -->
                <div class="glass-panel">
                    <div class="panel-header">
                        <h3>Quick Capture</h3>
                    </div>
                    <div>
                        <textarea id="dashboard-note-input" class="quick-note-input" placeholder="Type a thought or idea..."></textarea>
                        <button class="btn-primary" onclick="window.addDashboardNote()">Save Note</button>
                    </div>
                    ${recentNote ? `
                    <div style="margin-top: 1rem;">
                        <p style="font-size: 0.75rem; font-weight: 600; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.5rem;">Recent Note</p>
                        <div style="font-size: 0.875rem; background: var(--bg-primary); padding: 0.75rem; border-radius: var(--radius-sm); border-left: 2px solid var(--success);">
                            ${recentNote.content}
                        </div>
                    </div>
                    ` : ''}
                </div>

            </div>
        </div>
    </div>
    `;
};

// Actions
window.addQuickTask = function () {
    const input = document.getElementById('quick-task-input');
    const title = input.value.trim();
    if (!title) return;

    window.appState.tasks.push({
        id: Date.now().toString(),
        title: title,
        completed: false,
        timestamp: Date.now()
    });

    if (window.saveStateToDrive) window.saveStateToDrive();
    if (window.currentView === 'dashboard') window.renderView('dashboard');
}

window.toggleTask = function (id) {
    const task = window.appState.tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        if (window.saveStateToDrive) window.saveStateToDrive();
        if (window.currentView === 'dashboard') window.renderView('dashboard');
    }
}

window.addDashboardNote = function () {
    const input = document.getElementById('dashboard-note-input');
    const content = input.value.trim();
    if (!content) return;

    const title = content.split(' ').slice(0, 4).join(' ') + (content.length > 20 ? '...' : '');

    window.appState.notes.push({
        id: Date.now().toString(),
        title: title,
        content: content,
        tag: 'general',
        timestamp: Date.now()
    });

    if (window.saveStateToDrive) window.saveStateToDrive();
    if (window.currentView === 'dashboard') window.renderView('dashboard');
}
