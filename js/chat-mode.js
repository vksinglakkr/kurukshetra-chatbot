/**
 * ============================================================================
 * KURUKSHETRA MITRA - CHAT MODE MODULE
 * Conversational UI & Q&A Bot Interface
 * Version: 1.0.0
 * ============================================================================
 * 
 * This module provides a chat-based interface for interacting with Kurukshetra Mitra:
 * - Message bubble UI
 * - Bot responses
 * - Chat history
 * - Quick replies
 * - Typing indicators
 * - Auto-scroll
 * 
 * Features:
 * - Beautiful chat interface
 * - Natural language processing
 * - Context-aware responses
 * - Quick action buttons
 * - Message timestamps
 * - History persistence
 * - Typing animation
 * - Console logging
 * 
 * Dependencies: QuestionsData (for Q&A), TourGuideData (for sites)
 * Last Updated: January 23, 2026
 */

const ChatMode = (function() {
    'use strict';
    
    // =========================================================================
    // CONFIGURATION
    // =========================================================================
    
    const CONFIG = {
        logging: {
            enabled: true,
            prefix: '💬'
        },
        version: '1.0.0',
        
        // Bot configuration
        bot: {
            name: 'Kurukshetra Mitra',
            avatar: '🕉️',
            typingDelay: 1000,          // Delay before showing response
            typingSpeed: 30             // Characters per second
        },
        
        // Message settings
        messages: {
            maxHistory: 100,
            timestampFormat: 'short'    // short, full, relative
        },
        
        // Quick replies
        quickReplies: {
            welcome: [
                { text: '🗺️ Show Sites', action: 'sites' },
                { text: '❓ Ask Question', action: 'questions' },
                { text: '☀️ Weather', action: 'weather' },
                { text: '📅 Events', action: 'events' }
            ],
            help: [
                { text: '🔍 Search', action: 'search' },
                { text: '🗺️ All Sites', action: 'sites' },
                { text: '🏛️ Must Visit', action: 'must_visit' },
                { text: '📍 Directions', action: 'directions' }
            ]
        },
        
        // Response templates
        responses: {
            welcome: "Namaste! 🙏 I'm Kurukshetra Mitra, your guide to the sacred land of Kurukshetra. How can I help you today?",
            help: "I can help you with:\n\n🗺️ Find heritage sites\n❓ Answer questions about Kurukshetra\n☀️ Check weather\n📅 View upcoming events\n📍 Get directions\n\nJust ask me anything!",
            notFound: "I couldn't find anything matching your query. Would you like to try rephrasing or browse all sites?",
            error: "I apologize, but I encountered an error. Please try again.",
            searching: "Let me search for that...",
            thinking: "Let me think..."
        }
    };
    
    // =========================================================================
    // STATE
    // =========================================================================
    
    let state = {
        initialized: false,
        container: null,
        messagesContainer: null,
        inputField: null,
        sendButton: null,
        
        // Chat history
        messages: [],
        messageIdCounter: 0,
        
        // Bot state
        isTyping: false,
        typingTimeout: null,
        
        // Context
        lastQuery: '',
        context: {},
        
        // Callbacks
        callbacks: {
            onMessage: null,
            onUserMessage: null,
            onBotMessage: null,
            onAction: null
        },
        
        // Dependencies
        questionsData: null,
        tourGuideData: null
    };
    
    // =========================================================================
    // LOGGING
    // =========================================================================
    
    function log(message, type = 'info') {
        if (!CONFIG.logging.enabled) return;
        
        const prefix = CONFIG.logging.prefix;
        const timestamp = new Date().toLocaleTimeString();
        
        switch(type) {
            case 'warn':
                console.warn(`${prefix} [${timestamp}] ${message}`);
                break;
            case 'error':
                console.error(`${prefix} [${timestamp}] ${message}`);
                break;
            case 'success':
                console.log(`${prefix} ✅ [${timestamp}] ${message}`);
                break;
            default:
                console.log(`${prefix} [${timestamp}] ${message}`);
        }
    }
    
    // =========================================================================
    // MESSAGE HANDLING
    // =========================================================================
    
    /**
     * Add message to chat
     * @param {string} text - Message text
     * @param {string} sender - 'user' or 'bot'
     * @param {Object} options - Additional options
     * @returns {Object} - Message object
     */
    function addMessage(text, sender = 'bot', options = {}) {
        const message = {
            id: ++state.messageIdCounter,
            text: text,
            sender: sender,
            timestamp: new Date(),
            quickReplies: options.quickReplies || null,
            actions: options.actions || null,
            data: options.data || null
        };
        
        state.messages.push(message);
        
        // Keep history limited
        if (state.messages.length > CONFIG.messages.maxHistory) {
            state.messages.shift();
        }
        
        // Render message
        renderMessage(message);
        
        // Scroll to bottom
        scrollToBottom();
        
        // Callbacks
        if (sender === 'user' && state.callbacks.onUserMessage) {
            state.callbacks.onUserMessage(message);
        } else if (sender === 'bot' && state.callbacks.onBotMessage) {
            state.callbacks.onBotMessage(message);
        }
        
        if (state.callbacks.onMessage) {
            state.callbacks.onMessage(message);
        }
        
        log(`Message added: [${sender}] "${text.substring(0, 50)}..."`);
        
        return message;
    }
    
    /**
     * Render message in UI
     * @param {Object} message - Message object
     */
    function renderMessage(message) {
        if (!state.messagesContainer) return;
        
        const messageEl = document.createElement('div');
        messageEl.className = `chat-message chat-message-${message.sender}`;
        messageEl.dataset.messageId = message.id;
        
        // Avatar
        const avatar = document.createElement('div');
        avatar.className = 'chat-avatar';
        avatar.textContent = message.sender === 'bot' ? CONFIG.bot.avatar : '👤';
        
        // Content
        const content = document.createElement('div');
        content.className = 'chat-content';
        
        // Bubble
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble';
        bubble.innerHTML = formatMessageText(message.text);
        
        // Timestamp
        const timestamp = document.createElement('div');
        timestamp.className = 'chat-timestamp';
        timestamp.textContent = formatTimestamp(message.timestamp);
        
        content.appendChild(bubble);
        content.appendChild(timestamp);
        
        // Assemble
        if (message.sender === 'bot') {
            messageEl.appendChild(avatar);
            messageEl.appendChild(content);
        } else {
            messageEl.appendChild(content);
            messageEl.appendChild(avatar);
        }
        
        // Quick replies
        if (message.quickReplies && message.quickReplies.length > 0) {
            const quickRepliesEl = createQuickReplies(message.quickReplies);
            content.appendChild(quickRepliesEl);
        }
        
        // Actions
        if (message.actions && message.actions.length > 0) {
            const actionsEl = createActions(message.actions);
            content.appendChild(actionsEl);
        }
        
        state.messagesContainer.appendChild(messageEl);
    }
    
    /**
     * Format message text (markdown-like)
     * @param {string} text - Message text
     * @returns {string} - Formatted HTML
     */
    function formatMessageText(text) {
        // Convert newlines to <br>
        let formatted = text.replace(/\n/g, '<br>');
        
        // Bold: **text** or __text__
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        formatted = formatted.replace(/__(.*?)__/g, '<strong>$1</strong>');
        
        // Italic: *text* or _text_
        formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
        formatted = formatted.replace(/_(.*?)_/g, '<em>$1</em>');
        
        // Links: [text](url)
        formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
        
        return formatted;
    }
    
    /**
     * Format timestamp
     * @param {Date} date - Date object
     * @returns {string} - Formatted timestamp
     */
    function formatTimestamp(date) {
        const now = new Date();
        const diff = now - date;
        const seconds = Math.floor(diff / 1000);
        
        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    
    // =========================================================================
    // QUICK REPLIES & ACTIONS
    // =========================================================================
    
    /**
     * Create quick replies UI
     * @param {Array} replies - Quick reply options
     * @returns {HTMLElement} - Quick replies container
     */
    function createQuickReplies(replies) {
        const container = document.createElement('div');
        container.className = 'chat-quick-replies';
        
        replies.forEach(reply => {
            const button = document.createElement('button');
            button.className = 'chat-quick-reply';
            button.textContent = reply.text;
            button.onclick = () => {
                handleQuickReply(reply);
            };
            container.appendChild(button);
        });
        
        return container;
    }
    
    /**
     * Create actions UI
     * @param {Array} actions - Action options
     * @returns {HTMLElement} - Actions container
     */
    function createActions(actions) {
        const container = document.createElement('div');
        container.className = 'chat-actions';
        
        actions.forEach(action => {
            const button = document.createElement('button');
            button.className = 'chat-action';
            button.innerHTML = `${action.icon || ''} ${action.text}`;
            button.onclick = () => {
                handleAction(action);
            };
            container.appendChild(button);
        });
        
        return container;
    }
    
    /**
     * Handle quick reply click
     * @param {Object} reply - Quick reply object
     */
    function handleQuickReply(reply) {
        // Add user message
        addMessage(reply.text, 'user');
        
        // Handle action
        handleAction(reply);
    }
    
    /**
     * Handle action
     * @param {Object} action - Action object
     */
    function handleAction(action) {
        log(`Action triggered: ${action.action}`);
        
        // Callback
        if (state.callbacks.onAction) {
            state.callbacks.onAction(action);
        }
        
        // Built-in actions
        switch(action.action) {
            case 'sites':
                showAllSites();
                break;
            case 'must_visit':
                showMustVisitSites();
                break;
            case 'questions':
                showQuestions();
                break;
            case 'weather':
                requestWeather();
                break;
            case 'events':
                requestEvents();
                break;
            case 'directions':
                requestDirections();
                break;
            case 'help':
                showHelp();
                break;
            case 'search':
                focusInput();
                break;
        }
    }
    
    // =========================================================================
    // BOT RESPONSES
    // =========================================================================
    
    /**
     * Send bot response with typing indicator
     * @param {string} text - Response text
     * @param {Object} options - Additional options
     */
    function sendBotResponse(text, options = {}) {
        showTypingIndicator();
        
        const delay = options.delay || CONFIG.bot.typingDelay;
        
        setTimeout(() => {
            hideTypingIndicator();
            addMessage(text, 'bot', options);
        }, delay);
    }
    
    /**
     * Show typing indicator
     */
    function showTypingIndicator() {
        if (state.isTyping) return;
        
        state.isTyping = true;
        
        const indicator = document.createElement('div');
        indicator.className = 'chat-typing-indicator';
        indicator.id = 'typing-indicator';
        indicator.innerHTML = `
            <div class="chat-avatar">${CONFIG.bot.avatar}</div>
            <div class="chat-typing-dots">
                <span></span><span></span><span></span>
            </div>
        `;
        
        state.messagesContainer.appendChild(indicator);
        scrollToBottom();
    }
    
    /**
     * Hide typing indicator
     */
    function hideTypingIndicator() {
        state.isTyping = false;
        
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }
    
    // =========================================================================
    // MESSAGE PROCESSING
    // =========================================================================
    
    /**
     * Process user input
     * @param {string} text - User input
     */
    function processUserInput(text) {
        if (!text || text.trim().length === 0) return;
        
        const query = text.trim();
        state.lastQuery = query;
        
        // Add user message
        addMessage(query, 'user');
        
        // Clear input
        if (state.inputField) {
            state.inputField.value = '';
        }
        
        // Process query
        processQuery(query);
    }
    
    /**
     * Process query and generate response
     * @param {string} query - User query
     */
    function processQuery(query) {
        const lowerQuery = query.toLowerCase();
        
        // Check for special commands
        if (lowerQuery.includes('hello') || lowerQuery.includes('hi') || lowerQuery.includes('namaste')) {
            sendBotResponse(CONFIG.responses.welcome, {
                quickReplies: CONFIG.quickReplies.welcome
            });
            return;
        }
        
        if (lowerQuery.includes('help') || lowerQuery === '?') {
            showHelp();
            return;
        }
        
        if (lowerQuery.includes('weather')) {
            requestWeather();
            return;
        }
        
        if (lowerQuery.includes('event') || lowerQuery.includes('festival')) {
            requestEvents();
            return;
        }
        
        if (lowerQuery.includes('direction') || lowerQuery.includes('how to reach')) {
            requestDirections();
            return;
        }
        
        // Search for sites
        if (state.tourGuideData) {
            const sites = state.tourGuideData.searchByName(query);
            if (sites && sites.length > 0) {
                sendSiteResults(sites, query);
                return;
            }
        }
        
        // Search for questions
        if (state.questionsData) {
            const questions = state.questionsData.searchQuestions(query);
            if (questions && questions.length > 0) {
                sendQuestionResults(questions, query);
                return;
            }
        }
        
        // No results
        sendBotResponse(CONFIG.responses.notFound, {
            quickReplies: CONFIG.quickReplies.help
        });
    }
    
    /**
     * Send site search results
     * @param {Array} sites - Found sites
     * @param {string} query - Original query
     */
    function sendSiteResults(sites, query) {
        const count = sites.length;
        let response = `I found ${count} site${count > 1 ? 's' : ''} matching "${query}":\n\n`;
        
        sites.slice(0, 5).forEach((site, i) => {
            response += `${i + 1}. **${site.name}**\n${site.category}\n\n`;
        });
        
        if (count > 5) {
            response += `And ${count - 5} more...`;
        }
        
        const actions = sites.slice(0, 3).map(site => ({
            text: `View ${site.name}`,
            icon: '🗺️',
            action: 'view_site',
            data: site
        }));
        
        sendBotResponse(response, { actions });
    }
    
    /**
     * Send question search results
     * @param {Array} questions - Found questions
     * @param {string} query - Original query
     */
    function sendQuestionResults(questions, query) {
        const question = questions[0];
        
        let response = `**${question.question}**\n\n${question.answer}`;
        
        const actions = [];
        if (questions.length > 1) {
            actions.push({
                text: 'More Questions',
                icon: '❓',
                action: 'more_questions',
                data: questions
            });
        }
        
        sendBotResponse(response, { actions });
    }
    
    // =========================================================================
    // BUILT-IN ACTIONS
    // =========================================================================
    
    /**
     * Show all sites
     */
    function showAllSites() {
        if (!state.tourGuideData) {
            sendBotResponse('Site data not available.');
            return;
        }
        
        const sites = state.tourGuideData.getAllSites();
        const categories = [...new Set(sites.map(s => s.category))];
        
        let response = `I have information about **${sites.length} heritage sites** across ${categories.length} categories:\n\n`;
        
        categories.slice(0, 5).forEach(cat => {
            const count = sites.filter(s => s.category === cat).length;
            response += `• ${cat} (${count})\n`;
        });
        
        sendBotResponse(response, {
            quickReplies: [
                { text: '🏛️ Must Visit', action: 'must_visit' },
                { text: '🔍 Search', action: 'search' }
            ]
        });
    }
    
    /**
     * Show must-visit sites
     */
    function showMustVisitSites() {
        if (!state.tourGuideData) {
            sendBotResponse('Site data not available.');
            return;
        }
        
        const sites = state.tourGuideData.getMustVisitSites();
        
        let response = `**Must-Visit Sites in Kurukshetra:**\n\n`;
        
        sites.slice(0, 5).forEach((site, i) => {
            response += `${i + 1}. **${site.name}**\n${site.description.substring(0, 80)}...\n\n`;
        });
        
        const actions = sites.slice(0, 3).map(site => ({
            text: site.name,
            icon: '🗺️',
            action: 'view_site',
            data: site
        }));
        
        sendBotResponse(response, { actions });
    }
    
    /**
     * Show questions
     */
    function showQuestions() {
        if (!state.questionsData) {
            sendBotResponse('Questions data not available.');
            return;
        }
        
        const sections = state.questionsData.getAllSections();
        
        let response = `**Frequently Asked Questions:**\n\n`;
        
        sections.slice(0, 5).forEach(section => {
            response += `• ${section.title} (${section.questions.length} questions)\n`;
        });
        
        sendBotResponse(response, {
            quickReplies: [
                { text: 'Random Question', action: 'random_question' },
                { text: 'Search Questions', action: 'search' }
            ]
        });
    }
    
    /**
     * Request weather
     */
    function requestWeather() {
        sendBotResponse("Let me check the current weather in Kurukshetra...", {
            actions: [
                { text: 'View Weather', icon: '☀️', action: 'fetch_weather' }
            ]
        });
    }
    
    /**
     * Request events
     */
    function requestEvents() {
        sendBotResponse("Let me show you upcoming events in Kurukshetra...", {
            actions: [
                { text: 'View Events', icon: '📅', action: 'fetch_events' }
            ]
        });
    }
    
    /**
     * Request directions
     */
    function requestDirections() {
        sendBotResponse("I can help you with directions to Kurukshetra. Where are you coming from?", {
            quickReplies: [
                { text: 'From Delhi', action: 'directions_delhi' },
                { text: 'From Chandigarh', action: 'directions_chandigarh' },
                { text: 'From Ambala', action: 'directions_ambala' }
            ]
        });
    }
    
    /**
     * Show help
     */
    function showHelp() {
        sendBotResponse(CONFIG.responses.help, {
            quickReplies: CONFIG.quickReplies.help
        });
    }
    
    /**
     * Focus input field
     */
    function focusInput() {
        if (state.inputField) {
            state.inputField.focus();
        }
    }
    
    // =========================================================================
    // UTILITY FUNCTIONS
    // =========================================================================
    
    /**
     * Scroll chat to bottom
     */
    function scrollToBottom() {
        if (state.messagesContainer) {
            setTimeout(() => {
                state.messagesContainer.scrollTop = state.messagesContainer.scrollHeight;
            }, 100);
        }
    }
    
    /**
     * Clear chat history
     */
    function clearChat() {
        state.messages = [];
        if (state.messagesContainer) {
            state.messagesContainer.innerHTML = '';
        }
        log('Chat cleared');
    }
    
    /**
     * Get message history
     * @returns {Array} - Message history
     */
    function getHistory() {
        return [...state.messages];
    }
    
    // =========================================================================
    // INITIALIZATION
    // =========================================================================
    
    /**
     * Initialize Chat Mode
     * @param {Object} options - Configuration options
     * @returns {Object} - Public API
     */
    function init(options = {}) {
        if (state.initialized) {
            log('Chat Mode already initialized', 'warn');
            return getPublicAPI();
        }
        
        log('Chat Mode initializing...', 'info');
        
        try {
            // Get container
            state.container = options.container || document.getElementById('chat-container');
            if (!state.container) {
                throw new Error('Chat container not found');
            }
            
            // Get/create messages container
            state.messagesContainer = state.container.querySelector('.chat-messages') || 
                                     document.createElement('div');
            state.messagesContainer.className = 'chat-messages';
            
            // Get input elements
            state.inputField = options.inputField || state.container.querySelector('.chat-input');
            state.sendButton = options.sendButton || state.container.querySelector('.chat-send');
            
            // Setup event listeners
            if (state.inputField) {
                state.inputField.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        processUserInput(state.inputField.value);
                    }
                });
            }
            
            if (state.sendButton) {
                state.sendButton.addEventListener('click', () => {
                    processUserInput(state.inputField.value);
                });
            }
            
            // Set dependencies
            if (options.questionsData) {
                state.questionsData = options.questionsData;
                log('Questions data connected');
            }
            
            if (options.tourGuideData) {
                state.tourGuideData = options.tourGuideData;
                log('Tour guide data connected');
            }
            
            // Set callbacks
            if (options.onMessage) state.callbacks.onMessage = options.onMessage;
            if (options.onUserMessage) state.callbacks.onUserMessage = options.onUserMessage;
            if (options.onBotMessage) state.callbacks.onBotMessage = options.onBotMessage;
            if (options.onAction) state.callbacks.onAction = options.onAction;
            
            state.initialized = true;
            
            // Send welcome message
            if (options.sendWelcome !== false) {
                sendBotResponse(CONFIG.responses.welcome, {
                    quickReplies: CONFIG.quickReplies.welcome,
                    delay: 500
                });
            }
            
            log('Chat Mode initialized successfully!', 'success');
            
        } catch (error) {
            log(`Initialization error: ${error.message}`, 'error');
            console.error(error);
        }
        
        return getPublicAPI();
    }
    
    /**
     * Get public API
     * @returns {Object} - Public API
     */
    function getPublicAPI() {
        return {
            // Message functions
            sendMessage: (text, sender = 'bot', options = {}) => addMessage(text, sender, options),
            sendBotMessage: sendBotResponse,
            processUserInput,
            
            // History functions
            getHistory,
            clearChat,
            
            // Utility functions
            showTyping: showTypingIndicator,
            hideTyping: hideTypingIndicator,
            scrollToBottom,
            
            // Action triggers
            showHelp,
            showAllSites,
            showMustVisitSites,
            showQuestions,
            
            // State queries
            isTyping: () => state.isTyping,
            getMessageCount: () => state.messages.length,
            getLastMessage: () => state.messages[state.messages.length - 1],
            
            // Configuration
            setLogging: (enabled) => { CONFIG.logging.enabled = enabled; },
            setBotName: (name) => { CONFIG.bot.name = name; },
            
            // Callbacks
            onMessage: (callback) => { state.callbacks.onMessage = callback; },
            onUserMessage: (callback) => { state.callbacks.onUserMessage = callback; },
            onBotMessage: (callback) => { state.callbacks.onBotMessage = callback; },
            onAction: (callback) => { state.callbacks.onAction = callback; },
            
            // Metadata
            version: CONFIG.version
        };
    }
    
    // =========================================================================
    // EXPORT PUBLIC API
    // =========================================================================
    
    return {
        init,
        get: getPublicAPI
    };
    
})();

// =========================================================================
// EXPORT (for module systems)
// =========================================================================

// CommonJS
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChatMode;
}

// AMD
if (typeof define === 'function' && define.amd) {
    define([], function() {
        return ChatMode;
    });
}

// Global export
if (typeof window !== 'undefined') {
    window.ChatMode = ChatMode;
}
