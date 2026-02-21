const plannerStyles = `
    .planner-header {
        margin-bottom: 2rem;
    }
    
    .planner-header h2 {
        font-size: 2rem;
        margin-bottom: 0.5rem;
    }
    
    .time-block-grid {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-top: 1.5rem;
    }
    
    .time-slot {
        display: flex;
        gap: 1rem;
        align-items: flex-start;
    }
    
    .time-label {
        min-width: 80px;
        color: var(--text-muted);
        font-size: 0.875rem;
        font-weight: 500;
        text-align: right;
        padding-top: 0.5rem;
    }
    
    .time-content {
        flex: 1;
        min-height: 60px;
        background: var(--bg-tertiary);
        border: 1px dashed var(--glass-border);
        border-radius: var(--radius-md);
        padding: 0.75rem;
        transition: background var(--transition-fast);
        cursor: pointer;
    }
    
    .time-content:hover {
        background: var(--bg-secondary);
        border-style: solid;
        border-color: var(--accent-primary);
    }
    
    .time-content.scheduled {
        background: linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary));
        border: 1px solid var(--accent-primary);
        border-left: 4px solid var(--accent-primary);
    }
    
    .scheduled-item-title {
        font-weight: 600;
        color: var(--text-primary);
    }
    
    .scheduled-item-desc {
        font-size: 0.875rem;
        color: var(--text-muted);
        margin-top: 0.25rem;
    }
`;

const styleTag = document.createElement('style');
styleTag.innerHTML = plannerStyles;
document.head.appendChild(styleTag);

window.views.planner = `
    <div class="view planner-view">
        <div class="planner-header">
            <h2>Daily Planner</h2>
            <p>February 20, 2026</p>
        </div>
        
        <div class="glass-panel" style="padding: 2rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid var(--glass-border); padding-bottom: 1rem;">
                <h3>Schedule</h3>
                <button class="btn-primary" style="width: auto;">+ Add Event</button>
            </div>
            
            <div class="time-block-grid">
                
                <div class="time-slot">
                    <div class="time-label">8:00 AM</div>
                    <div class="time-content"></div>
                </div>
                
                <div class="time-slot">
                    <div class="time-label">9:00 AM</div>
                    <div class="time-content scheduled">
                        <div class="scheduled-item-title">Deep Work Session</div>
                        <div class="scheduled-item-desc">Focusing on project architecture.</div>
                    </div>
                </div>
                
                <div class="time-slot">
                    <div class="time-label">10:00 AM</div>
                    <div class="time-content scheduled">
                        <div class="scheduled-item-title">Team Standup</div>
                        <div class="scheduled-item-desc">Weekly sync with the engineering team.</div>
                    </div>
                </div>
                
                <div class="time-slot">
                    <div class="time-label">11:00 AM</div>
                    <div class="time-content"></div>
                </div>
                
                <div class="time-slot">
                    <div class="time-label">12:00 PM</div>
                    <div class="time-content">
                        <div style="opacity: 0.5; font-style: italic; margin-top: 0.5rem; text-align: center;">Lunch Break</div>
                    </div>
                </div>
                
                <div class="time-slot">
                    <div class="time-label">1:00 PM</div>
                    <div class="time-content"></div>
                </div>
                
            </div>
        </div>
    </div>
`;
