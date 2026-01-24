/**
 * ============================================================================
 * KURUKSHETRA MITRA - MAIN APPLICATION
 * Complete App Controller & Integration
 * Version: 2.0.0
 * ============================================================================
 */

const KurukshetraMitra = (function() {
    'use strict';
    
    console.log('🕉️ Kurukshetra Mitra v2.0.0 Loading...');
    console.log('═══════════════════════════════════════════════════════');
    
    // =========================================================================
    // STATE
    // =========================================================================
    
    const state = {
        initialized: false,
        modules: {},
        currentView: 'home',
        selectedCategory: null
    };
    
    // =========================================================================
    // MODULE INITIALIZATION
    // =========================================================================
    
    function initializeModules() {
        console.log('📦 Initializing all modules...');
        
        try {
            // 1. Platform Detector
            console.log('🖥️ Initializing Platform Detector...');
            PlatformDetector.init();
            state.modules.platform = PlatformDetector.get();
            console.log(`   Device: ${state.modules.platform.getDeviceType()}`);
            console.log(`   OS: ${state.modules.platform.getOS()}`);
            console.log(`   Browser: ${state.modules.platform.getBrowser()}`);
            
            // 2. Data Modules
            console.log('🗺️ Initializing Tour Guide Data...');
            TourGuideData.init();
            state.modules.sites = TourGuideData.get();
            console.log(`   Loaded ${state.modules.sites.getAllSites().length} sites`);
            
            console.log('❓ Initializing Questions Data...');
            QuestionsData.init();
            state.modules.questions = QuestionsData.get();
            console.log(`   Loaded ${state.modules.questions.getAllQuestions().length} questions`);
            
            // 3. API Module
            console.log('🌐 Initializing API Module...');
            APIModule.init({
                useMockData: true
            });
            state.modules.api = APIModule.get();
            
            // 4. Modal Controller
            console.log('🪟 Initializing Modal Controller...');
            ModalController.init();
            state.modules.modal = ModalController.get();
            
            // 5. Autocomplete
            console.log('🔍 Initializing Autocomplete...');
            Autocomplete.init({
                inputElement: document.getElementById('mainSearch'),
                sitesData: state.modules.sites,
                questionsData: state.modules.questions,
                onSelect: handleAutocompleteSelect
            });
            state.modules.autocomplete = Autocomplete.get();
            
            // 6. Voice Recognition
            console.log('🎤 Initializing Voice Recognition...');
            VoiceRecognition.init({
                onCommand: handleVoiceCommand,
                onError: (error) => {
                    console.warn('Voice error:', error.message);
                }
            });
            state.modules.voice = VoiceRecognition.get();
            
            if (state.modules.voice.isSupported()) {
                console.log('   Voice Recognition: Supported');
            } else {
                console.log('   Voice Recognition: Not supported in this browser');
            }
            
            // 7. Chat Mode
            console.log('💬 Initializing Chat Mode...');
            ChatMode.init({
                container: document.getElementById('chat-widget'),
                tourGuideData: state.modules.sites,
                questionsData: state.modules.questions,
                sendWelcome: false,
                onAction: handleChatAction
            });
            state.modules.chat = ChatMode.get();
            
            // 8. WhatsApp Adapter
            console.log('📱 Initializing WhatsApp Adapter...');
            WhatsAppAdapter.init({
                baseUrl: window.location.origin,
                onShare: (data) => {
                    console.log('Shared via WhatsApp:', data.type);
                }
            });
            state.modules.whatsapp = WhatsAppAdapter.get();
            
            // 9. UI Controller
            console.log('🎮 Initializing UI Controller...');
            UIController.init({
                searchInput: document.getElementById('mainSearch'),
                modules: {
                    sites: state.modules.sites,
                    questions: state.modules.questions,
                    api: state.modules.api,
                    modal: state.modules.modal,
                    autocomplete: state.modules.autocomplete
                }
            });
            state.modules.ui = UIController.get();
            
            console.log('✅ All modules initialized successfully!');
            return true;
            
        } catch (error) {
            console.error('❌ Module initialization error:', error);
            return false;
        }
    }
    
    // =========================================================================
    // UI SETUP
    // =========================================================================
    
    function setupUI() {
        console.log('🎨 Setting up UI...');
        
        // Load categories
        loadCategories();
        
        // Load featured sites
        loadFeaturedSites();
        
        // Update stats
        updateStats();
        
        // Setup event listeners
        setupEventListeners();
        
        console.log('✅ UI setup complete!');
    }
    
    function loadCategories() {
        const categoriesGrid = document.getElementById('categoriesGrid');
        if (!categoriesGrid) return;
        
        const allSites = state.modules.sites.getAllSites();
        const categories = {};
        
        // Count sites per category
        allSites.forEach(site => {
            if (!categories[site.category]) {
                categories[site.category] = 0;
            }
            categories[site.category]++;
        });
        
        // Create category cards
        const categoryIcons = {
            'Sacred Water Tank': '💧',
            'Temple': '🛕',
            'Museum': '🏛️',
            'Religious Site': '🕉️',
            'Historical Site': '📜',
            'Garden': '🌳',
            'Lake': '🌊',
            'Park': '🏞️',
            'Monument': '🗿',
            'Cultural Center': '🎭'
        };
        
        categoriesGrid.innerHTML = Object.entries(categories)
            .slice(0, 8)
            .map(([category, count]) => `
                <div class="category-card" onclick="app.filterByCategory('${category}')">
                    <div class="category-icon">${categoryIcons[category] || '📍'}</div>
                    <div class="category-name">${category}</div>
                    <div class="category-count">${count} sites</div>
                </div>
            `).join('');
    }
    
    function loadFeaturedSites() {
        const featuredContainer = document.getElementById('featuredSites');
        if (!featuredContainer) return;
        
        const mustVisitSites = state.modules.sites.getMustVisitSites().slice(0, 6);
        
        featuredContainer.innerHTML = mustVisitSites.map(site => `
            <div class="site-card" onclick="app.showSiteDetail('${site.id}')">
                <div class="site-image">
                    ${getSiteIcon(site.category)}
                </div>
                <div class="site-content">
                    <h3 class="site-title">${site.name}</h3>
                    <span class="site-category">${site.category}</span>
                    <p class="site-description">${site.description.substring(0, 120)}...</p>
                    <div class="site-actions">
                        <button class="site-action-btn primary" onclick="event.stopPropagation(); app.showSiteDetail('${site.id}')">
                            <i class="fas fa-info-circle"></i> Details
                        </button>
                        <button class="site-action-btn secondary" onclick="event.stopPropagation(); app.shareSite('${site.id}')">
                            <i class="fab fa-whatsapp"></i> Share
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    function getSiteIcon(category) {
        const icons = {
            'Sacred Water Tank': '💧',
            'Temple': '🛕',
            'Museum': '🏛️',
            'Religious Site': '🕉️',
            'Historical Site': '📜',
            'Garden': '🌳',
            'Lake': '🌊',
            'Park': '🏞️',
            'Monument': '🗿',
            'Cultural Center': '🎭'
        };
        return icons[category] || '📍';
    }
    
    function updateStats() {
        const allSites = state.modules.sites.getAllSites();
        const mustVisit = state.modules.sites.getMustVisitSites();
        const questions = state.modules.questions.getAllQuestions();
        const categories = [...new Set(allSites.map(s => s.category))];
        
        document.getElementById('statSites').textContent = allSites.length;
        document.getElementById('statQuestions').textContent = `${questions.length}+`;
        document.getElementById('statCategories').textContent = categories.length;
        document.getElementById('statMustVisit').textContent = mustVisit.length;
    }
    
    function setupEventListeners() {
        // Voice button
        const voiceBtn = document.getElementById('voiceBtn');
        if (voiceBtn) {
            voiceBtn.addEventListener('click', toggleVoice);
        }
        
        // Chat button
        const chatBtn = document.getElementById('chatBtn');
        if (chatBtn) {
            chatBtn.addEventListener('click', toggleChat);
        }
        
        // Share button
        const shareBtn = document.getElementById('shareBtn');
        if (shareBtn) {
            shareBtn.addEventListener('click', shareApp);
        }
    }
    
    // =========================================================================
    // EVENT HANDLERS
    // =========================================================================
    
    function handleAutocompleteSelect(result) {
        console.log('Autocomplete selected:', result);
        
        if (result.type === 'site') {
            showSiteDetail(result.data.id);
        } else if (result.type === 'question') {
            state.modules.modal.showQuestion(result.data);
        }
    }
    
    function handleVoiceCommand(command) {
        console.log('Voice command:', command.type, command.query);
        
        // Send to chat for processing
        if (state.modules.chat) {
            state.modules.chat.processUserInput(command.query);
            
            // Show chat
            const chatWidget = document.getElementById('chat-widget');
            if (chatWidget) {
                chatWidget.classList.add('active');
                document.getElementById('chatBtn').classList.add('active');
            }
        }
    }
    
    function handleChatAction(action) {
        console.log('Chat action:', action.action);
        
        switch(action.action) {
            case 'view_site':
                if (action.data && action.data.id) {
                    showSiteDetail(action.data.id);
                }
                break;
            
            case 'fetch_weather':
                showWeather();
                break;
            
            case 'fetch_events':
                showEvents();
                break;
            
            case 'directions_delhi':
                showDirections('Delhi');
                break;
            
            case 'directions_chandigarh':
                showDirections('Chandigarh');
                break;
            
            case 'directions_ambala':
                showDirections('Ambala');
                break;
        }
    }
    
    // =========================================================================
    // PUBLIC ACTIONS
    // =========================================================================
    
    function showSiteDetail(siteId) {
        const site = state.modules.sites.getSiteById(siteId);
        if (site) {
            state.modules.modal.showSiteDetail(site);
        }
    }
    
    function shareSite(siteId) {
        const site = state.modules.sites.getSiteById(siteId);
        if (site) {
            state.modules.whatsapp.shareSite(site);
        }
    }
    
    function filterByCategory(category) {
        console.log('Filter by category:', category);
        state.selectedCategory = category;
        
        const sites = state.modules.sites.getSitesByCategory(category);
        
        // Show in modal or create filtered view
        state.modules.modal.open({
            title: `${category} Sites`,
            size: 'large',
            content: `
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1rem;">
                    ${sites.map(site => `
                        <div style="background: #f8f9fa; padding: 1rem; border-radius: 10px; cursor: pointer;" 
                             onclick="app.showSiteDetail('${site.id}')">
                            <h4 style="color: #8B4513; margin-bottom: 0.5rem;">${site.name}</h4>
                            <p style="font-size: 0.9rem; color: #666;">${site.description.substring(0, 80)}...</p>
                        </div>
                    `).join('')}
                </div>
            `
        });
    }
    
    function showAllSites() {
        const allSites = state.modules.sites.getAllSites();
        
        state.modules.modal.open({
            title: 'All Heritage Sites',
            size: 'large',
            content: `
                <div style="max-height: 500px; overflow-y: auto;">
                    ${allSites.map(site => `
                        <div style="background: #f8f9fa; padding: 1rem; border-radius: 10px; margin-bottom: 1rem; cursor: pointer;" 
                             onclick="app.showSiteDetail('${site.id}')">
                            <h4 style="color: #8B4513; margin-bottom: 0.5rem;">${site.name}</h4>
                            <span style="background: #e6d5c3; padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.85rem;">
                                ${site.category}
                            </span>
                            <p style="font-size: 0.9rem; color: #666; margin-top: 0.5rem;">${site.description.substring(0, 100)}...</p>
                        </div>
                    `).join('')}
                </div>
            `
        });
    }
    
    function showMustVisit() {
        const sites = state.modules.sites.getMustVisitSites();
        
        state.modules.modal.open({
            title: 'Must-Visit Sites in Kurukshetra',
            size: 'large',
            content: `
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1rem;">
                    ${sites.map(site => `
                        <div style="background: #fffaf0; border-left: 4px solid #d4af37; padding: 1rem; border-radius: 10px; cursor: pointer;" 
                             onclick="app.showSiteDetail('${site.id}')">
                            <h4 style="color: #8B4513; margin-bottom: 0.5rem;">⭐ ${site.name}</h4>
                            <p style="font-size: 0.9rem; color: #666;">${site.description.substring(0, 80)}...</p>
                        </div>
                    `).join('')}
                </div>
            `
        });
    }
    
    async function showWeather() {
        try {
            const weather = await state.modules.api.getWeather('Kurukshetra');
            state.modules.modal.showWeather(weather);
        } catch (error) {
            console.error('Weather error:', error);
            state.modules.modal.alert('Unable to fetch weather data. Please try again.');
        }
    }
    
    async function showEvents() {
        try {
            const events = await state.modules.api.getEvents(10);
            state.modules.modal.showEvents(events);
        } catch (error) {
            console.error('Events error:', error);
            state.modules.modal.alert('Unable to fetch events. Please try again.');
        }
    }
    
    async function showDirections(from = 'Delhi') {
        try {
            const directions = await state.modules.api.getDirections(from);
            state.modules.modal.showDirections(directions);
        } catch (error) {
            console.error('Directions error:', error);
            state.modules.modal.alert('Unable to fetch directions. Please try again.');
        }
    }
    
    function toggleVoice() {
        const voiceBtn = document.getElementById('voiceBtn');
        
        if (state.modules.voice.isListening()) {
            state.modules.voice.stop();
            voiceBtn.classList.remove('active');
        } else {
            state.modules.voice.start();
            voiceBtn.classList.add('active');
        }
    }
    
    function toggleChat() {
        const chatWidget = document.getElementById('chat-widget');
        const chatBtn = document.getElementById('chatBtn');
        
        if (chatWidget.classList.contains('active')) {
            chatWidget.classList.remove('active');
            chatBtn.classList.remove('active');
        } else {
            chatWidget.classList.add('active');
            chatBtn.classList.add('active');
            
            // Send welcome if first time
            if (state.modules.chat.getMessageCount() === 0) {
                state.modules.chat.sendBotMessage(
                    'Namaste! 🙏 I\'m your Kurukshetra guide. How can I help you today?',
                    {
                        quickReplies: [
                            { text: '🗺️ Show Sites', action: 'sites' },
                            { text: '❓ Ask Question', action: 'questions' },
                            { text: '☀️ Weather', action: 'weather' },
                            { text: '📅 Events', action: 'events' }
                        ]
                    }
                );
            }
        }
    }
    
    function shareApp() {
        state.modules.whatsapp.shareInvitation();
    }
    
    // =========================================================================
    // INITIALIZATION
    // =========================================================================
    
    function init() {
        console.log('🚀 Initializing Kurukshetra Mitra...');
        
        // Initialize modules
        const success = initializeModules();
        
        if (!success) {
            console.error('❌ Failed to initialize modules');
            return false;
        }
        
        // Setup UI
        setupUI();
        
        // Hide loading overlay
        setTimeout(() => {
            const loadingOverlay = document.getElementById('loadingOverlay');
            if (loadingOverlay) {
                loadingOverlay.classList.add('hidden');
            }
        }, 1000);
        
        state.initialized = true;
        
        console.log('═══════════════════════════════════════════════════════');
        console.log('✅ Kurukshetra Mitra v2.0.0 Ready!');
        console.log('🕉️ Namaste! Welcome to your digital heritage guide.');
        console.log('═══════════════════════════════════════════════════════');
        
        return true;
    }
    
    // =========================================================================
    // PUBLIC API
    // =========================================================================
    
    return {
        init,
        showSiteDetail,
        shareSite,
        filterByCategory,
        showAllSites,
        showMustVisit,
        showWeather,
        showEvents,
        showDirections,
        toggleVoice,
        toggleChat,
        shareApp,
        getModules: () => state.modules,
        getState: () => state
    };
    
})();

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.app = KurukshetraMitra.init();
    });
} else {
    window.app = KurukshetraMitra.init();
}

// Export for global access
window.KurukshetraMitra = KurukshetraMitra;
