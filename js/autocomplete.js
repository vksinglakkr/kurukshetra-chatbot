/**
 * ============================================================================
 * KURUKSHETRA MITRA - AUTOCOMPLETE MODULE
 * Smart Suggestion System for Search
 * Version: 1.0.0
 * ============================================================================
 * 
 * This module provides intelligent autocomplete functionality by combining
 * data from Tour Guide sites and Questions database.
 * 
 * Features:
 * - Real-time suggestions as user types
 * - Combines sites and questions
 * - Keyboard navigation (arrow keys, enter, escape)
 * - Touch-friendly for mobile
 * - Debounced search for performance
 * - Highlighting of matching text
 * - Category badges for results
 * 
 * Dependencies:
 * - TourGuideData module
 * - QuestionsData module
 * 
 * Last Updated: January 23, 2026
 */

const AutocompleteModule = (function() {
    'use strict';
    
    // =========================================================================
    // CONFIGURATION
    // =========================================================================
    
    const CONFIG = {
        logging: {
            enabled: true,
            prefix: '🔍'
        },
        version: '1.0.0',
        
        // Search settings
        minQueryLength: 2,          // Minimum characters to trigger search
        maxResults: 10,             // Maximum suggestions to show
        debounceDelay: 300,         // Milliseconds to wait before search
        
        // UI settings
        highlightClass: 'ac-highlight',
        containerClass: 'autocomplete-container',
        listClass: 'autocomplete-list',
        itemClass: 'autocomplete-item',
        activeClass: 'ac-active',
        
        // Data sources priority
        sourcePriority: ['sites', 'questions']
    };
    
    // =========================================================================
    // STATE
    // =========================================================================
    
    let state = {
        initialized: false,
        inputElement: null,
        containerElement: null,
        listElement: null,
        currentFocus: -1,
        lastQuery: '',
        debounceTimer: null,
        suggestions: [],
        isOpen: false,
        
        // Data source APIs
        tourGuideAPI: null,
        questionsAPI: null
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
    // SEARCH & SUGGESTION FUNCTIONS
    // =========================================================================
    
    /**
     * Get suggestions from all data sources
     * @param {string} query - Search query
     * @returns {Array} - Combined suggestions
     */
    function getSuggestions(query) {
        if (!query || query.length < CONFIG.minQueryLength) {
            return [];
        }
        
        const lowerQuery = query.toLowerCase().trim();
        log(`Getting suggestions for: "${lowerQuery}"`);
        
        const suggestions = [];
        
        // Get site suggestions
        if (state.tourGuideAPI) {
            const sites = state.tourGuideAPI.searchByName(lowerQuery);
            sites.slice(0, 5).forEach(site => {
                suggestions.push({
                    type: 'site',
                    id: site.id,
                    title: site.name,
                    subtitle: site.category,
                    icon: site.categoryIcon,
                    data: site
                });
            });
        }
        
        // Get question suggestions
        if (state.questionsAPI) {
            const questions = state.questionsAPI.searchQuestions(lowerQuery);
            questions.slice(0, 5).forEach(q => {
                suggestions.push({
                    type: 'question',
                    id: `q_${q.question}`,
                    title: q.question,
                    subtitle: q.category,
                    icon: '❓',
                    data: q
                });
            });
        }
        
        // Limit total results
        const limited = suggestions.slice(0, CONFIG.maxResults);
        log(`Found ${limited.length} suggestions`);
        
        return limited;
    }
    
    /**
     * Highlight matching text in suggestion
     * @param {string} text - Text to highlight
     * @param {string} query - Search query
     * @returns {string} - HTML with highlighted text
     */
    function highlightMatch(text, query) {
        if (!query) return text;
        
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, `<mark class="${CONFIG.highlightClass}">$1</mark>`);
    }
    
    // =========================================================================
    // UI RENDERING
    // =========================================================================
    
    /**
     * Create autocomplete container
     */
    function createContainer() {
        // Remove existing container if any
        removeContainer();
        
        // Create new container
        const container = document.createElement('div');
        container.className = CONFIG.containerClass;
        container.style.cssText = `
            position: absolute;
            z-index: 9999;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            max-height: 400px;
            overflow-y: auto;
            display: none;
        `;
        
        // Create list
        const list = document.createElement('ul');
        list.className = CONFIG.listClass;
        list.style.cssText = `
            list-style: none;
            margin: 0;
            padding: 0;
        `;
        
        container.appendChild(list);
        document.body.appendChild(container);
        
        state.containerElement = container;
        state.listElement = list;
        
        log('Container created');
    }
    
    /**
     * Position container relative to input
     */
    function positionContainer() {
        if (!state.inputElement || !state.containerElement) return;
        
        const rect = state.inputElement.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        
        state.containerElement.style.top = `${rect.bottom + scrollTop + 5}px`;
        state.containerElement.style.left = `${rect.left + scrollLeft}px`;
        state.containerElement.style.width = `${rect.width}px`;
    }
    
    /**
     * Render suggestions in UI
     * @param {Array} suggestions - Suggestions to render
     */
    function renderSuggestions(suggestions) {
        if (!state.listElement) return;
        
        // Clear existing items
        state.listElement.innerHTML = '';
        
        if (suggestions.length === 0) {
            state.containerElement.style.display = 'none';
            state.isOpen = false;
            return;
        }
        
        // Render each suggestion
        suggestions.forEach((suggestion, index) => {
            const item = document.createElement('li');
            item.className = CONFIG.itemClass;
            item.setAttribute('data-index', index);
            item.style.cssText = `
                padding: 12px 16px;
                cursor: pointer;
                border-bottom: 1px solid #f0f0f0;
                transition: background 0.2s;
            `;
            
            // Type badge
            const typeBadge = suggestion.type === 'site' ? 
                '<span style="background:#8B4513;color:white;padding:2px 8px;border-radius:10px;font-size:0.75rem;margin-right:8px;">SITE</span>' :
                '<span style="background:#d4af37;color:white;padding:2px 8px;border-radius:10px;font-size:0.75rem;margin-right:8px;">Q&A</span>';
            
            item.innerHTML = `
                <div style="display:flex;align-items:center;gap:10px;">
                    <span style="font-size:1.5rem;">${suggestion.icon}</span>
                    <div style="flex:1;">
                        <div style="font-weight:600;color:#2c3e50;">
                            ${typeBadge}
                            ${highlightMatch(suggestion.title, state.lastQuery)}
                        </div>
                        <div style="font-size:0.85rem;color:#7f8c8d;margin-top:2px;">
                            ${suggestion.subtitle}
                        </div>
                    </div>
                </div>
            `;
            
            // Click handler
            item.addEventListener('click', () => selectSuggestion(index));
            
            // Hover handler
            item.addEventListener('mouseenter', () => setFocus(index));
            
            state.listElement.appendChild(item);
        });
        
        // Show container
        positionContainer();
        state.containerElement.style.display = 'block';
        state.isOpen = true;
        state.currentFocus = -1;
        
        log(`Rendered ${suggestions.length} suggestions`);
    }
    
    /**
     * Remove autocomplete container
     */
    function removeContainer() {
        if (state.containerElement) {
            state.containerElement.remove();
            state.containerElement = null;
            state.listElement = null;
        }
        state.isOpen = false;
    }
    
    // =========================================================================
    // KEYBOARD NAVIGATION
    // =========================================================================
    
    /**
     * Set focus on suggestion item
     * @param {number} index - Item index
     */
    function setFocus(index) {
        const items = state.listElement?.querySelectorAll(`.${CONFIG.itemClass}`);
        if (!items || items.length === 0) return;
        
        // Remove active class from all
        items.forEach(item => {
            item.classList.remove(CONFIG.activeClass);
            item.style.background = '';
        });
        
        // Add active class to focused item
        if (index >= 0 && index < items.length) {
            items[index].classList.add(CONFIG.activeClass);
            items[index].style.background = '#f8f9fa';
            items[index].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            state.currentFocus = index;
        } else {
            state.currentFocus = -1;
        }
    }
    
    /**
     * Navigate through suggestions with arrow keys
     * @param {number} direction - 1 for down, -1 for up
     */
    function navigate(direction) {
        if (!state.isOpen || state.suggestions.length === 0) return;
        
        let newFocus = state.currentFocus + direction;
        
        // Wrap around
        if (newFocus >= state.suggestions.length) {
            newFocus = 0;
        } else if (newFocus < 0) {
            newFocus = state.suggestions.length - 1;
        }
        
        setFocus(newFocus);
    }
    
    /**
     * Select current suggestion
     * @param {number} index - Suggestion index (optional)
     */
    function selectSuggestion(index) {
        const idx = index !== undefined ? index : state.currentFocus;
        
        if (idx < 0 || idx >= state.suggestions.length) return;
        
        const suggestion = state.suggestions[idx];
        log(`Selected: ${suggestion.title} (${suggestion.type})`);
        
        // Fill input with selection
        if (state.inputElement) {
            state.inputElement.value = suggestion.title;
        }
        
        // Close suggestions
        closeSuggestions();
        
        // Trigger custom event
        const event = new CustomEvent('autocomplete:select', {
            detail: suggestion
        });
        state.inputElement?.dispatchEvent(event);
        
        log(`Dispatched select event for: ${suggestion.type}`, 'success');
    }
    
    /**
     * Close suggestions dropdown
     */
    function closeSuggestions() {
        if (state.containerElement) {
            state.containerElement.style.display = 'none';
        }
        state.isOpen = false;
        state.currentFocus = -1;
        state.suggestions = [];
    }
    
    // =========================================================================
    // EVENT HANDLERS
    // =========================================================================
    
    /**
     * Handle input change
     * @param {Event} e - Input event
     */
    function handleInput(e) {
        const query = e.target.value;
        
        // Clear previous timer
        if (state.debounceTimer) {
            clearTimeout(state.debounceTimer);
        }
        
        // Debounce search
        state.debounceTimer = setTimeout(() => {
            if (query.length < CONFIG.minQueryLength) {
                closeSuggestions();
                return;
            }
            
            state.lastQuery = query;
            state.suggestions = getSuggestions(query);
            renderSuggestions(state.suggestions);
        }, CONFIG.debounceDelay);
    }
    
    /**
     * Handle keyboard events
     * @param {KeyboardEvent} e - Keyboard event
     */
    function handleKeyDown(e) {
        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault();
                navigate(1);
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                navigate(-1);
                break;
                
            case 'Enter':
                if (state.isOpen && state.currentFocus >= 0) {
                    e.preventDefault();
                    selectSuggestion();
                }
                break;
                
            case 'Escape':
                e.preventDefault();
                closeSuggestions();
                break;
        }
    }
    
    /**
     * Handle click outside
     * @param {Event} e - Click event
     */
    function handleClickOutside(e) {
        if (!state.inputElement || !state.containerElement) return;
        
        if (!state.inputElement.contains(e.target) && 
            !state.containerElement.contains(e.target)) {
            closeSuggestions();
        }
    }
    
    // =========================================================================
    // INITIALIZATION
    // =========================================================================
    
    /**
     * Initialize autocomplete
     * @param {Object} options - Configuration options
     * @returns {Object} - Public API
     */
    function init(options = {}) {
        if (state.initialized) {
            log('Autocomplete already initialized', 'warn');
            return getPublicAPI();
        }
        
        log('Autocomplete initializing...', 'info');
        
        try {
            // Get input element
            state.inputElement = options.inputElement || 
                                document.querySelector(options.inputSelector) ||
                                document.querySelector('input[type="search"]');
            
            if (!state.inputElement) {
                throw new Error('Input element not found');
            }
            
            // Get data source APIs
            if (window.TourGuideData) {
                state.tourGuideAPI = window.TourGuideData.get();
                log('Connected to Tour Guide Data');
            }
            
            if (window.QuestionsData) {
                state.questionsAPI = window.QuestionsData.get();
                log('Connected to Questions Data');
            }
            
            if (!state.tourGuideAPI && !state.questionsAPI) {
                log('No data sources available', 'warn');
            }
            
            // Create UI container
            createContainer();
            
            // Attach event listeners
            state.inputElement.addEventListener('input', handleInput);
            state.inputElement.addEventListener('keydown', handleKeyDown);
            document.addEventListener('click', handleClickOutside);
            window.addEventListener('resize', positionContainer);
            
            state.initialized = true;
            
            log('Autocomplete initialized successfully!', 'success');
            log(`Connected to: ${state.tourGuideAPI ? '✅ Sites' : '❌ Sites'}, ${state.questionsAPI ? '✅ Questions' : '❌ Questions'}`);
            
        } catch (error) {
            log(`Initialization error: ${error.message}`, 'error');
            console.error(error);
        }
        
        return getPublicAPI();
    }
    
    /**
     * Destroy autocomplete
     */
    function destroy() {
        if (!state.initialized) return;
        
        // Remove event listeners
        if (state.inputElement) {
            state.inputElement.removeEventListener('input', handleInput);
            state.inputElement.removeEventListener('keydown', handleKeyDown);
        }
        document.removeEventListener('click', handleClickOutside);
        window.removeEventListener('resize', positionContainer);
        
        // Remove container
        removeContainer();
        
        // Reset state
        state = {
            initialized: false,
            inputElement: null,
            containerElement: null,
            listElement: null,
            currentFocus: -1,
            lastQuery: '',
            debounceTimer: null,
            suggestions: [],
            isOpen: false,
            tourGuideAPI: null,
            questionsAPI: null
        };
        
        log('Autocomplete destroyed');
    }
    
    /**
     * Get public API
     * @returns {Object} - Public API
     */
    function getPublicAPI() {
        return {
            // Core functions
            getSuggestions,
            closeSuggestions,
            destroy,
            
            // State queries
            isOpen: () => state.isOpen,
            getCurrentFocus: () => state.currentFocus,
            getSuggestionsList: () => [...state.suggestions],
            
            // Configuration
            setMaxResults: (max) => { CONFIG.maxResults = max; },
            setDebounceDelay: (delay) => { CONFIG.debounceDelay = delay; },
            setMinQueryLength: (length) => { CONFIG.minQueryLength = length; },
            setLogging: (enabled) => { CONFIG.logging.enabled = enabled; },
            
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
    module.exports = AutocompleteModule;
}

// AMD
if (typeof define === 'function' && define.amd) {
    define([], function() {
        return AutocompleteModule;
    });
}

// Global export
if (typeof window !== 'undefined') {
    window.AutocompleteModule = AutocompleteModule;
}
