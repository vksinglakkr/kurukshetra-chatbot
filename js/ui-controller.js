/**
 * ============================================================================
 * KURUKSHETRA MITRA - UI CONTROLLER
 * Main Application Orchestrator & State Manager
 * Version: 1.0.0
 * ============================================================================
 * 
 * This module is the central brain of the application that:
 * - Coordinates all other modules
 * - Manages application state
 * - Handles user interactions
 * - Controls UI updates
 * - Manages routing/navigation
 * 
 * Features:
 * - Centralized state management
 * - Event bus for module communication
 * - View management
 * - Loading states
 * - Error handling
 * - History management
 * - Console logging
 * 
 * Dependencies:
 * - PlatformDetector
 * - TourGuideData
 * - QuestionsData
 * - AutocompleteModule
 * - APIModule
 * 
 * Last Updated: January 23, 2026
 */

const UIController = (function() {
    'use strict';
    
    // =========================================================================
    // CONFIGURATION
    // =========================================================================
    
    const CONFIG = {
        logging: {
            enabled: true,
            prefix: '🎮'
        },
        version: '1.0.0',
        
        // UI selectors
        selectors: {
            searchInput: '#searchInput',
            mainContainer: '#mainContainer',
            resultsContainer: '#resultsContainer',
            loadingOverlay: '#loadingOverlay',
            errorContainer: '#errorContainer',
            headerContainer: '#headerContainer',
            footerContainer: '#footerContainer'
        },
        
        // View states
        views: {
            HOME: 'home',
            SEARCH_RESULTS: 'search_results',
            SITE_DETAIL: 'site_detail',
            QUESTION_DETAIL: 'question_detail',
            EVENTS: 'events',
            WEATHER: 'weather',
            DIRECTIONS: 'directions'
        },
        
        // Loading states
        loadingMessages: [
            'Loading...',
            'Fetching data...',
            'Please wait...',
            'Getting information...'
        ]
    };
    
    // =========================================================================
    // STATE MANAGEMENT
    // =========================================================================
    
    let state = {
        // Initialization
        initialized: false,
        ready: false,
        
        // Current view
        currentView: CONFIG.views.HOME,
        previousView: null,
        
        // UI state
        isLoading: false,
        hasError: false,
        errorMessage: null,
        
        // Data state
        selectedSite: null,
        selectedQuestion: null,
        searchQuery: '',
        searchResults: [],
        
        // Module instances
        modules: {
            platform: null,
            tourGuide: null,
            questions: null,
            autocomplete: null,
            api: null
        },
        
        // DOM elements
        elements: {},
        
        // Event listeners storage
        listeners: [],
        
        // History
        history: []
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
    // EVENT BUS (Module Communication)
    // =========================================================================
    
    const eventBus = {
        events: {},
        
        /**
         * Subscribe to an event
         * @param {string} event - Event name
         * @param {Function} callback - Callback function
         */
        on(event, callback) {
            if (!this.events[event]) {
                this.events[event] = [];
            }
            this.events[event].push(callback);
            log(`Event subscribed: ${event}`);
        },
        
        /**
         * Unsubscribe from an event
         * @param {string} event - Event name
         * @param {Function} callback - Callback function
         */
        off(event, callback) {
            if (!this.events[event]) return;
            this.events[event] = this.events[event].filter(cb => cb !== callback);
        },
        
        /**
         * Emit an event
         * @param {string} event - Event name
         * @param {any} data - Event data
         */
        emit(event, data) {
            log(`Event emitted: ${event}`, 'info');
            if (!this.events[event]) return;
            this.events[event].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    log(`Event handler error: ${error.message}`, 'error');
                }
            });
        }
    };
    
    // =========================================================================
    // STATE MANAGEMENT FUNCTIONS
    // =========================================================================
    
    /**
     * Update state
     * @param {Object} updates - State updates
     */
    function setState(updates) {
        const oldState = { ...state };
        Object.assign(state, updates);
        
        log(`State updated: ${Object.keys(updates).join(', ')}`);
        
        // Emit state change event
        eventBus.emit('state:change', {
            old: oldState,
            new: state,
            updates: updates
        });
    }
    
    /**
     * Get current state
     * @returns {Object} - Current state
     */
    function getState() {
        return { ...state };
    }
    
    /**
     * Get specific state value
     * @param {string} key - State key
     * @returns {any} - State value
     */
    function getStateValue(key) {
        return state[key];
    }
    
    // =========================================================================
    // VIEW MANAGEMENT
    // =========================================================================
    
    /**
     * Change view
     * @param {string} viewName - View name
     * @param {Object} data - View data
     */
    function changeView(viewName, data = {}) {
        log(`Changing view: ${state.currentView} → ${viewName}`);
        
        // Save to history
        state.history.push({
            view: state.currentView,
            timestamp: Date.now()
        });
        
        // Update state
        setState({
            previousView: state.currentView,
            currentView: viewName
        });
        
        // Emit view change event
        eventBus.emit('view:change', {
            from: state.previousView,
            to: viewName,
            data: data
        });
        
        // Render view
        renderView(viewName, data);
    }
    
    /**
     * Render current view
     * @param {string} viewName - View name
     * @param {Object} data - View data
     */
    function renderView(viewName, data) {
        log(`Rendering view: ${viewName}`);
        
        switch(viewName) {
            case CONFIG.views.HOME:
                renderHomeView();
                break;
            case CONFIG.views.SEARCH_RESULTS:
                renderSearchResults(data);
                break;
            case CONFIG.views.SITE_DETAIL:
                renderSiteDetail(data);
                break;
            case CONFIG.views.QUESTION_DETAIL:
                renderQuestionDetail(data);
                break;
            case CONFIG.views.EVENTS:
                renderEvents(data);
                break;
            case CONFIG.views.WEATHER:
                renderWeather(data);
                break;
            case CONFIG.views.DIRECTIONS:
                renderDirections(data);
                break;
            default:
                log(`Unknown view: ${viewName}`, 'warn');
        }
    }
    
    /**
     * Go back to previous view
     */
    function goBack() {
        if (state.history.length === 0) {
            log('No history to go back to', 'warn');
            return;
        }
        
        const previous = state.history.pop();
        changeView(previous.view);
    }
    
    // =========================================================================
    // VIEW RENDERERS (Placeholder implementations)
    // =========================================================================
    
    function renderHomeView() {
        log('Rendering home view');
        eventBus.emit('view:rendered', { view: 'home' });
    }
    
    function renderSearchResults(data) {
        log(`Rendering search results: ${data.results?.length || 0} items`);
        setState({ searchResults: data.results || [] });
        eventBus.emit('view:rendered', { view: 'search_results', data });
    }
    
    function renderSiteDetail(data) {
        log(`Rendering site detail: ${data.site?.name || 'Unknown'}`);
        setState({ selectedSite: data.site });
        eventBus.emit('view:rendered', { view: 'site_detail', data });
    }
    
    function renderQuestionDetail(data) {
        log(`Rendering question detail`);
        setState({ selectedQuestion: data.question });
        eventBus.emit('view:rendered', { view: 'question_detail', data });
    }
    
    function renderEvents(data) {
        log('Rendering events view');
        eventBus.emit('view:rendered', { view: 'events', data });
    }
    
    function renderWeather(data) {
        log('Rendering weather view');
        eventBus.emit('view:rendered', { view: 'weather', data });
    }
    
    function renderDirections(data) {
        log('Rendering directions view');
        eventBus.emit('view:rendered', { view: 'directions', data });
    }
    
    // =========================================================================
    // LOADING STATE MANAGEMENT
    // =========================================================================
    
    /**
     * Show loading state
     * @param {string} message - Loading message
     */
    function showLoading(message = null) {
        setState({ isLoading: true });
        const msg = message || CONFIG.loadingMessages[Math.floor(Math.random() * CONFIG.loadingMessages.length)];
        log(`Loading: ${msg}`);
        eventBus.emit('loading:show', { message: msg });
    }
    
    /**
     * Hide loading state
     */
    function hideLoading() {
        setState({ isLoading: false });
        log('Loading hidden');
        eventBus.emit('loading:hide');
    }
    
    // =========================================================================
    // ERROR HANDLING
    // =========================================================================
    
    /**
     * Show error
     * @param {string} message - Error message
     * @param {Error} error - Error object
     */
    function showError(message, error = null) {
        setState({
            hasError: true,
            errorMessage: message
        });
        
        log(`Error: ${message}`, 'error');
        if (error) {
            console.error(error);
        }
        
        eventBus.emit('error:show', {
            message: message,
            error: error
        });
    }
    
    /**
     * Clear error
     */
    function clearError() {
        setState({
            hasError: false,
            errorMessage: null
        });
        
        log('Error cleared');
        eventBus.emit('error:clear');
    }
    
    // =========================================================================
    // USER ACTION HANDLERS
    // =========================================================================
    
    /**
     * Handle search query
     * @param {string} query - Search query
     */
    async function handleSearch(query) {
        log(`Handling search: "${query}"`);
        
        if (!query || query.trim().length < 2) {
            changeView(CONFIG.views.HOME);
            return;
        }
        
        setState({ searchQuery: query });
        showLoading('Searching...');
        
        try {
            // Search in both sites and questions
            const siteResults = state.modules.tourGuide?.searchByName(query) || [];
            const questionResults = state.modules.questions?.searchQuestions(query) || [];
            
            const results = [
                ...siteResults.map(s => ({ type: 'site', data: s })),
                ...questionResults.map(q => ({ type: 'question', data: q }))
            ];
            
            hideLoading();
            changeView(CONFIG.views.SEARCH_RESULTS, { results, query });
            
        } catch (error) {
            hideLoading();
            showError('Search failed', error);
        }
    }
    
    /**
     * Handle site selection
     * @param {number} siteId - Site ID
     */
    async function handleSiteSelect(siteId) {
        log(`Handling site selection: ${siteId}`);
        showLoading('Loading site details...');
        
        try {
            // Get basic site info
            const site = state.modules.tourGuide?.getSiteById(siteId);
            
            if (!site) {
                throw new Error('Site not found');
            }
            
            // Get detailed info from API
            let details = null;
            if (state.modules.api) {
                try {
                    details = await state.modules.api.getSiteDetails(siteId);
                } catch (apiError) {
                    log('API fetch failed, using basic info', 'warn');
                }
            }
            
            hideLoading();
            changeView(CONFIG.views.SITE_DETAIL, {
                site: details || site
            });
            
        } catch (error) {
            hideLoading();
            showError('Failed to load site details', error);
        }
    }
    
    /**
     * Handle question selection
     * @param {Object} question - Question object
     */
    function handleQuestionSelect(question) {
        log(`Handling question selection`);
        changeView(CONFIG.views.QUESTION_DETAIL, { question });
    }
    
    /**
     * Handle view weather request
     */
    async function handleViewWeather() {
        log('Handling view weather');
        showLoading('Loading weather...');
        
        try {
            const weather = await state.modules.api?.getWeather('Kurukshetra');
            hideLoading();
            changeView(CONFIG.views.WEATHER, { weather });
        } catch (error) {
            hideLoading();
            showError('Failed to load weather', error);
        }
    }
    
    /**
     * Handle view events request
     */
    async function handleViewEvents() {
        log('Handling view events');
        showLoading('Loading events...');
        
        try {
            const events = await state.modules.api?.getEvents(10);
            hideLoading();
            changeView(CONFIG.views.EVENTS, { events });
        } catch (error) {
            hideLoading();
            showError('Failed to load events', error);
        }
    }
    
    /**
     * Handle view directions request
     * @param {string} from - Origin location
     */
    async function handleViewDirections(from = 'Delhi') {
        log(`Handling view directions from: ${from}`);
        showLoading('Loading directions...');
        
        try {
            const directions = await state.modules.api?.getDirections(from);
            hideLoading();
            changeView(CONFIG.views.DIRECTIONS, { directions, from });
        } catch (error) {
            hideLoading();
            showError('Failed to load directions', error);
        }
    }
    
    // =========================================================================
    // MODULE COORDINATION
    // =========================================================================
    
    /**
     * Initialize all modules
     * @param {Object} options - Module options
     */
    function initializeModules(options = {}) {
        log('Initializing modules...');
        
        try {
            // Initialize Platform Detector
            if (window.PlatformDetector) {
                state.modules.platform = window.PlatformDetector.init();
                log('✅ Platform Detector initialized', 'success');
            }
            
            // Initialize Tour Guide Data
            if (window.TourGuideData) {
                state.modules.tourGuide = window.TourGuideData.init();
                log('✅ Tour Guide Data initialized', 'success');
            }
            
            // Initialize Questions Data
            if (window.QuestionsData) {
                state.modules.questions = window.QuestionsData.init();
                log('✅ Questions Data initialized', 'success');
            }
            
            // Initialize Autocomplete
            if (window.AutocompleteModule && options.searchInput) {
                state.modules.autocomplete = window.AutocompleteModule.init({
                    inputElement: options.searchInput
                });
                log('✅ Autocomplete initialized', 'success');
                
                // Listen for autocomplete selections
                options.searchInput.addEventListener('autocomplete:select', (e) => {
                    handleAutocompleteSelect(e.detail);
                });
            }
            
            // Initialize API Module
            if (window.APIModule) {
                state.modules.api = window.APIModule.init({
                    useMockData: options.useMockData !== false,
                    cacheEnabled: true
                });
                log('✅ API Module initialized', 'success');
            }
            
            log('All modules initialized successfully!', 'success');
            return true;
            
        } catch (error) {
            log(`Module initialization error: ${error.message}`, 'error');
            return false;
        }
    }
    
    /**
     * Handle autocomplete selection
     * @param {Object} selection - Selection object
     */
    function handleAutocompleteSelect(selection) {
        log(`Autocomplete selection: ${selection.type} - ${selection.title}`);
        
        if (selection.type === 'site') {
            handleSiteSelect(selection.id);
        } else if (selection.type === 'question') {
            handleQuestionSelect(selection.data);
        }
    }
    
    // =========================================================================
    // DOM HELPERS
    // =========================================================================
    
    /**
     * Get DOM elements
     */
    function getDOMElements() {
        const elements = {};
        
        for (const [key, selector] of Object.entries(CONFIG.selectors)) {
            elements[key] = document.querySelector(selector);
        }
        
        state.elements = elements;
        log('DOM elements cached');
    }
    
    /**
     * Attach event listeners
     */
    function attachEventListeners() {
        log('Attaching event listeners...');
        
        // Search input listener
        if (state.elements.searchInput) {
            const handleInput = (e) => {
                if (e.key === 'Enter') {
                    handleSearch(e.target.value);
                }
            };
            
            state.elements.searchInput.addEventListener('keypress', handleInput);
            state.listeners.push({
                element: state.elements.searchInput,
                event: 'keypress',
                handler: handleInput
            });
        }
        
        log('Event listeners attached');
    }
    
    /**
     * Remove all event listeners
     */
    function removeEventListeners() {
        state.listeners.forEach(({ element, event, handler }) => {
            element?.removeEventListener(event, handler);
        });
        state.listeners = [];
        log('Event listeners removed');
    }
    
    // =========================================================================
    // INITIALIZATION
    // =========================================================================
    
    /**
     * Initialize UI Controller
     * @param {Object} options - Configuration options
     * @returns {Object} - Public API
     */
    function init(options = {}) {
        if (state.initialized) {
            log('UI Controller already initialized', 'warn');
            return getPublicAPI();
        }
        
        log('UI Controller initializing...', 'info');
        
        try {
            // Get DOM elements
            getDOMElements();
            
            // Initialize modules
            const modulesOk = initializeModules({
                searchInput: state.elements.searchInput || options.searchInput,
                useMockData: options.useMockData
            });
            
            if (!modulesOk) {
                throw new Error('Module initialization failed');
            }
            
            // Attach event listeners
            attachEventListeners();
            
            // Set initial view
            setState({
                initialized: true,
                ready: true,
                currentView: CONFIG.views.HOME
            });
            
            log('UI Controller initialized successfully!', 'success');
            log(`Current view: ${state.currentView}`);
            log('📊 Module Status:');
            log(`   Platform: ${state.modules.platform ? '✅' : '❌'}`);
            log(`   TourGuide: ${state.modules.tourGuide ? '✅' : '❌'}`);
            log(`   Questions: ${state.modules.questions ? '✅' : '❌'}`);
            log(`   Autocomplete: ${state.modules.autocomplete ? '✅' : '❌'}`);
            log(`   API: ${state.modules.api ? '✅' : '❌'}`);
            
        } catch (error) {
            log(`Initialization error: ${error.message}`, 'error');
            console.error(error);
        }
        
        return getPublicAPI();
    }
    
    /**
     * Destroy UI Controller
     */
    function destroy() {
        if (!state.initialized) return;
        
        log('Destroying UI Controller...');
        
        // Remove event listeners
        removeEventListeners();
        
        // Destroy modules
        if (state.modules.autocomplete) {
            state.modules.autocomplete.destroy();
        }
        
        // Clear event bus
        eventBus.events = {};
        
        // Reset state
        state = {
            initialized: false,
            ready: false,
            currentView: CONFIG.views.HOME,
            previousView: null,
            isLoading: false,
            hasError: false,
            errorMessage: null,
            selectedSite: null,
            selectedQuestion: null,
            searchQuery: '',
            searchResults: [],
            modules: {
                platform: null,
                tourGuide: null,
                questions: null,
                autocomplete: null,
                api: null
            },
            elements: {},
            listeners: [],
            history: []
        };
        
        log('UI Controller destroyed');
    }
    
    /**
     * Get public API
     * @returns {Object} - Public API
     */
    function getPublicAPI() {
        return {
            // State management
            getState,
            getStateValue,
            
            // View management
            changeView,
            goBack,
            getCurrentView: () => state.currentView,
            
            // User actions
            handleSearch,
            handleSiteSelect,
            handleQuestionSelect,
            handleViewWeather,
            handleViewEvents,
            handleViewDirections,
            
            // UI state
            showLoading,
            hideLoading,
            showError,
            clearError,
            isLoading: () => state.isLoading,
            hasError: () => state.hasError,
            
            // Event bus
            on: eventBus.on.bind(eventBus),
            off: eventBus.off.bind(eventBus),
            emit: eventBus.emit.bind(eventBus),
            
            // Module access
            getModules: () => ({ ...state.modules }),
            
            // Cleanup
            destroy,
            
            // Configuration
            setLogging: (enabled) => { CONFIG.logging.enabled = enabled; },
            
            // Metadata
            version: CONFIG.version,
            isInitialized: () => state.initialized,
            isReady: () => state.ready
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
    module.exports = UIController;
}

// AMD
if (typeof define === 'function' && define.amd) {
    define([], function() {
        return UIController;
    });
}

// Global export
if (typeof window !== 'undefined') {
    window.UIController = UIController;
}
