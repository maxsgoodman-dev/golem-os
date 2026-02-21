// Global AI State and Handlers
const chatHistory = document.querySelector('.chat-history');
const chatInput = document.querySelector('.chat-input-area input');
const sendBtn = document.querySelector('.chat-input-area .send-btn');
const fabAi = document.querySelector('.fab-ai');

const aiStyles = `
    .message {
        margin-bottom: 1rem;
        padding: 0.75rem 1rem;
        border-radius: var(--radius-lg);
        max-width: 85%;
        font-size: 0.9rem;
        line-height: 1.5;
        animation: fadeIn var(--transition-fast) ease-out forwards;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .message.system {
        background: var(--bg-secondary);
        color: var(--text-primary);
        border: 1px solid var(--glass-border);
        align-self: flex-start;
        border-bottom-left-radius: 0;
    }

    .message.user {
        background: linear-gradient(135deg, var(--accent-primary), var(--accent-hover));
        color: white;
        align-self: flex-end;
        margin-left: auto;
        border-bottom-right-radius: 0;
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    }
    
    .typing-indicator {
        display: flex;
        gap: 0.25rem;
        padding: 0.5rem;
    }
    
    .dot {
        width: 6px;
        height: 6px;
        background: var(--text-muted);
        border-radius: 50%;
        animation: bounce 1.4s infinite ease-in-out both;
    }
    
    .dot:nth-child(1) { animation-delay: -0.32s; }
    .dot:nth-child(2) { animation-delay: -0.16s; }
    
    @keyframes bounce {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1); }
    }
`;

const styleTag = document.createElement('style');
styleTag.innerHTML = aiStyles;
document.head.appendChild(styleTag);

// Mock AI Logic
const responses = [
    "I've added that to your notes.",
    "Scheduling that for tomorrow morning.",
    "Your project 'Architecture Review' has been marked as active.",
    "I can certainly help you plan that out. Would you like me to break it into smaller tasks?",
    "Done! Is there anything else you need?"
];

function addMessage(text, sender) {
    const msg = document.createElement('div');
    msg.className = 'message ' + sender;
    msg.textContent = text;
    chatHistory.appendChild(msg);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function showTypingIndicator() {
    const id = 'typing-' + Date.now();
    const msg = document.createElement('div');
    msg.id = id;
    msg.className = 'message system typing-indicator';
    msg.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';
    chatHistory.appendChild(msg);
    chatHistory.scrollTop = chatHistory.scrollHeight;
    return id;
}

function removeTypingIndicator(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

function handleSend() {
    const text = chatInput.value.trim();
    if (!text) return;

    // User message
    addMessage(text, 'user');
    chatInput.value = '';

    // Mock processing delay before AI responds
    const typingId = showTypingIndicator();

    setTimeout(() => {
        removeTypingIndicator(typingId);
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];

        // Minor mock integrations based on intent
        let finalResponse = randomResponse;
        if (text.toLowerCase().includes('schedule')) {
            finalResponse = "I've updated your planner with that event.";
            // Could trigger a re-render of planner here if we had state management
        } else if (text.toLowerCase().includes('note')) {
            finalResponse = "Note saved locally.";
        }

        addMessage(finalResponse, 'system');

        // Pulse the FAB to show it's active even if drawer is closed
        if (document.querySelector('.ai-drawer').classList.contains('closed')) {
            fabAi.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.6)';
            setTimeout(() => fabAi.style.boxShadow = '', 2000);
        }

    }, 1500 + Math.random() * 1000);
}

sendBtn.addEventListener('click', handleSend);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
});
