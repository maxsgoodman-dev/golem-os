const notesStyles = `
    .notes-header {
        margin-bottom: 2rem;
    }
    
    .notes-header h2 {
        font-size: 2rem;
        margin-bottom: 0.5rem;
    }
    
    .notes-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
    }
    
    .note-card {
        background: var(--bg-tertiary);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-lg);
        padding: 1.5rem;
        transition: transform var(--transition-fast), box-shadow var(--transition-fast);
        cursor: pointer;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-height: 200px;
    }
    
    .note-card:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-lg);
        border-color: var(--accent-primary);
    }
    
    .note-title {
        font-size: 1.125rem;
        font-weight: 600;
        margin-bottom: 0.75rem;
        color: var(--text-primary);
    }
    
    .note-excerpt {
        color: var(--text-secondary);
        font-size: 0.875rem;
        flex: 1;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;
    }
    
    .note-meta {
        font-size: 0.75rem;
        color: var(--text-muted);
        margin-top: 1rem;
        padding-top: 0.75rem;
        border-top: 1px dashed rgba(255, 255, 255, 0.1);
        display: flex;
        justify-content: space-between;
    }
    
    .note-tag {
        background: var(--bg-secondary);
        padding: 0.2rem 0.5rem;
        border-radius: var(--radius-sm);
    }
`;

const styleTag = document.createElement('style');
styleTag.innerHTML = notesStyles;
document.head.appendChild(styleTag);

window.views.notes = () => {
    const notes = window.appState.notes || [];

    let notesHtml = '';
    if (notes.length === 0) {
        notesHtml = '<div style="color: var(--text-muted); padding: 2rem; text-align: center; grid-column: 1 / -1;">No notes yet. Create one above!</div>';
    } else {
        // Sort by newest first
        const sortedNotes = [...notes].sort((a, b) => b.timestamp - a.timestamp);
        notesHtml = sortedNotes.map(note => `
            <div class="note-card">
                <div>
                    <div class="note-title">${note.title || 'Untitled Note'}</div>
                    <div class="note-excerpt">${note.content}</div>
                </div>
                <div class="note-meta">
                    <span class="note-tag">${note.tag || 'general'}</span>
                    <span>${new Date(note.timestamp).toLocaleDateString()}</span>
                </div>
            </div>
        `).join('');
    }

    return `
        <div class="view notes-view">
            <div class="notes-header">
                <div style="display: flex; justify-content: space-between; align-items: flex-end;">
                    <div>
                        <h2>Notes & Thoughts</h2>
                        <p>Your digital brain and external memory.</p>
                    </div>
                </div>
            </div>
            
            <div class="glass-panel" style="margin-bottom: 2rem; display: flex; gap: 1rem;">
                <input type="text" id="new-note-input" placeholder="Quick capture a note..." style="flex: 1; background: var(--bg-primary); border: 1px solid var(--glass-border); color: white; padding: 0.75rem 1rem; border-radius: var(--radius-md);">
                <button class="btn-primary" style="width: auto;" onclick="window.addNote()">Save Note</button>
            </div>
            
            <div class="notes-grid">
                ${notesHtml}
            </div>
        </div>
    `;
};

// Global function to handle adding a note from UI
window.addNote = function () {
    const input = document.getElementById('new-note-input');
    const content = input.value.trim();
    if (!content) return;

    // Simple title extraction (first few words)
    const title = content.split(' ').slice(0, 4).join(' ') + (content.length > 20 ? '...' : '');

    window.appState.notes.push({
        id: Date.now().toString(),
        title: title,
        content: content,
        tag: 'general',
        timestamp: Date.now()
    });

    input.value = '';

    if (window.saveStateToDrive) {
        window.saveStateToDrive();
    }

    if (window.currentView === 'notes') {
        window.renderView('notes');
    }
}
