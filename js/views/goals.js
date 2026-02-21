const goalsStyles = `
    .goals-header {
        margin-bottom: 2rem;
    }
    
    .goals-header h2 {
        font-size: 2rem;
        margin-bottom: 0.5rem;
    }
    
    .domain-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 1.5rem;
    }
    
    .domain-card {
        background: var(--glass-bg);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-xl);
        padding: 1.5rem;
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
    }
    
    .domain-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        border-bottom: 1px solid var(--glass-border);
        padding-bottom: 1rem;
    }
    
    .domain-title {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 1.25rem;
        font-weight: 600;
    }
    
    .project-list {
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .project-card {
        background: var(--bg-tertiary);
        border-radius: var(--radius-md);
        padding: 1rem;
        border-left: 3px solid transparent;
        transition: transform var(--transition-fast), background var(--transition-fast);
        cursor: pointer;
    }
    
    .project-card:hover {
        transform: translateY(-2px);
        background: var(--bg-secondary);
    }
    
    .project-card.active {
        border-left-color: var(--success);
    }
    
    .project-card.planning {
        border-left-color: var(--warning);
    }
    
    .progress-bar-container {
        height: 6px;
        background: var(--bg-primary);
        border-radius: var(--radius-full);
        margin-top: 0.75rem;
        overflow: hidden;
    }
    
    .progress-bar {
        height: 100%;
        background: var(--accent-primary);
        border-radius: var(--radius-full);
    }
`;

const styleTag = document.createElement('style');
styleTag.innerHTML = goalsStyles;
document.head.appendChild(styleTag);

window.views.goals = `
    <div class="view goals-view">
        <div class="goals-header">
            <div style="display: flex; justify-content: space-between; align-items: flex-end;">
                <div>
                    <h2>Domains & Projects</h2>
                    <p>Organize your life into high-level domains and track active projects.</p>
                </div>
                <button class="btn-primary" style="width: auto;">+ New Project</button>
            </div>
        </div>
        
        <div class="domain-grid">
            
            <!-- Professional Domain -->
            <div class="domain-card">
                <div class="domain-header">
                    <div class="domain-title">
                        <span>💼</span> Professional
                    </div>
                </div>
                
                <ul class="project-list">
                    <li class="project-card active">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                            <span style="font-weight: 600;">Build Life OS Core App</span>
                            <span style="font-size: 0.75rem; background: rgba(16, 185, 129, 0.2); color: var(--success); padding: 0.25rem 0.5rem; border-radius: var(--radius-sm);">Active</span>
                        </div>
                        <div class="progress-bar-container">
                            <div class="progress-bar" style="width: 45%; background: var(--success);"></div>
                        </div>
                    </li>
                    <li class="project-card planning">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                            <span style="font-weight: 600;">Q3 Architecture Review</span>
                            <span style="font-size: 0.75rem; background: rgba(245, 158, 11, 0.2); color: var(--warning); padding: 0.25rem 0.5rem; border-radius: var(--radius-sm);">Planning</span>
                        </div>
                        <div class="progress-bar-container">
                            <div class="progress-bar" style="width: 10%; background: var(--warning);"></div>
                        </div>
                    </li>
                </ul>
            </div>
            
            <!-- Personal / Health Domain -->
            <div class="domain-card">
                <div class="domain-header">
                    <div class="domain-title">
                        <span>🏃</span> Health & Fitness
                    </div>
                </div>
                
                <ul class="project-list">
                    <li class="project-card active">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                            <span style="font-weight: 600;">Marathon Training Schedule</span>
                            <span style="font-size: 0.75rem; background: rgba(16, 185, 129, 0.2); color: var(--success); padding: 0.25rem 0.5rem; border-radius: var(--radius-sm);">Active</span>
                        </div>
                        <div class="progress-bar-container">
                            <div class="progress-bar" style="width: 65%; background: var(--success);"></div>
                        </div>
                    </li>
                </ul>
            </div>
            
        </div>
    </div>
`;
