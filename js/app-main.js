/**
 * ============================================================================
 * KURUKSHETRA MITRA - MAIN APP (Uses All Existing Modules)
 * 2-Tab Interface with 10 Submenus
 * Version: 3.0.0
 * ============================================================================
 * 
 * This is the main orchestrator that:
 * - Uses existing UIController for state management
 * - Uses AutocompleteModule for search suggestions  
 * - Uses APIModule for n8n integration
 * - Uses ModalController for popups
 * - Uses TourGuideData & QuestionsData modules
 * 
 * NEW INTERFACE:
 * - 2 Main Tabs: Heritage & Tourism | Administration & Services
 * - 10 Submenus (5 per tab)
 * - Different interface types per submenu
 * 
 * Dependencies (ALL existing modules):
 * - platform-detector.js
 * - tour-guide-data.js
 * - questions-data.js
 * - autocomplete.js
 * - api.js
 * - ui-controller.js
 * - modal-controller.js
 * 
 * Last Updated: January 24, 2026
 */

(function() {
    'use strict';
    
    console.log('🕉️ Kurukshetra Mitra Ultimate - Loading with ALL modules...');
    
    // =========================================================================
    // STATE MANAGEMENT (Use existing UIController pattern)
    // =========================================================================
    
    const AppState = {
        currentTab: 'heritage',
        currentSubmenu: null,
        n8nWebhook: 'https://n8n-workflow-test.duckdns.org/webhook-test/kurukshetra-chatbot',
        n8nHeritageResearch: 'https://n8n-workflow-test.duckdns.org/webhook/kurukshetra-heritage-research',
        n8nDemographics: 'https://n8n-workflow-test.duckdns.org/webhook/kurukshetra-demographics',
        initialized: false
    };
    
    // =========================================================================
    // DOM ELEMENTS
    // =========================================================================
    
    const Elements = {
        mainTabs: null,
        tabContents: {},
        contentAreas: {}
    };
    
    // =========================================================================
    // INITIALIZATION
    // =========================================================================
    
    function init() {
        console.log('📦 Initializing Kurukshetra Mitra Ultimate...');
        
        // Cache DOM elements
        Elements.mainTabs = document.querySelectorAll('.tab-btn');
        Elements.tabContents = {
            heritage: document.getElementById('heritage-tab'),
            admin: document.getElementById('admin-tab')
        };
        Elements.contentAreas = {
            heritage: document.getElementById('heritage-content'),
            admin: document.getElementById('admin-content')
        };
        
        // Setup main tab switching
        Elements.mainTabs.forEach(tab => {
            tab.addEventListener('click', handleTabSwitch);
        });
        
        // Setup submenu cards
        document.querySelectorAll('.submenu-card').forEach(card => {
            card.addEventListener('click', handleSubmenuSelect);
        });
        
        AppState.initialized = true;
        
        console.log('✅ Kurukshetra Mitra Ultimate Ready!');
        console.log('📊 Modules Loaded:');
        console.log('  - TourGuideData:', typeof TourGuideData !== 'undefined' ? '✅' : '❌');
        console.log('  - QuestionsData:', typeof QuestionsData !== 'undefined' ? '✅' : '❌');
        console.log('  - AutocompleteModule:', typeof AutocompleteModule !== 'undefined' ? '✅' : '❌');
        console.log('  - APIModule:', typeof APIModule !== 'undefined' ? '✅' : '❌');
        console.log('  - UIController:', typeof UIController !== 'undefined' ? '✅' : '❌');
        console.log('  - ModalController:', typeof ModalController !== 'undefined' ? '✅' : '❌');
        
        if (typeof TourGuideData !== 'undefined') {
            const api = TourGuideData.get();
            console.log('📍 Sites Available:', api.getAllSites().length);
        }
        if (typeof QuestionsData !== 'undefined') {
            console.log('❓ Questions Available:', QuestionsData.getAllQuestions().length);
        }
    }
    
    // =========================================================================
    // TAB SWITCHING
    // =========================================================================
    
    function handleTabSwitch(e) {
        const tab = e.currentTarget.dataset.tab;
        console.log('🔄 Switching to tab:', tab);
        
        // Update active tab button
        Elements.mainTabs.forEach(t => t.classList.remove('active'));
        e.currentTarget.classList.add('active');
        
        // Show/hide tab content
        Object.keys(Elements.tabContents).forEach(key => {
            if (key === tab) {
                Elements.tabContents[key].style.display = 'block';
            } else {
                Elements.tabContents[key].style.display = 'none';
            }
        });
        
        // Clear current content
        if (Elements.contentAreas[tab]) {
            Elements.contentAreas[tab].innerHTML = '';
        }
        
        // Update state
        AppState.currentTab = tab;
        AppState.currentSubmenu = null;
        
        // Remove active from all submenu cards
        document.querySelectorAll('.submenu-card').forEach(card => {
            card.classList.remove('active');
        });
    }
    
    // =========================================================================
    // SUBMENU SELECTION
    // =========================================================================
    
    function handleSubmenuSelect(e) {
        const card = e.currentTarget;
        const submenu = card.dataset.submenu;
        
        console.log('📂 Opening submenu:', submenu);
        
        // Update active state
        document.querySelectorAll('.submenu-card').forEach(c => {
            c.classList.remove('active');
        });
        card.classList.add('active');
        
        // Update state
        AppState.currentSubmenu = submenu;
        
        // Render content
        renderSubmenuContent(submenu);
    }
    
    // =========================================================================
    // CONTENT RENDERING ROUTER
    // =========================================================================
    
    function renderSubmenuContent(submenu) {
        const contentArea = Elements.contentAreas[AppState.currentTab];
        
        const renderers = {
            'gita_wisdom': renderGitaWisdom,
            'temples_sites': renderTemplesSites,
            'stay_travel': renderStayTravel,
            'festivals': renderFestivals,
            'heritage_research': renderHeritageResearch,
            'demographics': renderDemographics,
            'government': renderGovernment,
            'education_health': renderEducationHealth,
            'infrastructure': renderInfrastructure,
            'admin_research': renderAdminResearch
        };
        
        const renderer = renderers[submenu];
        if (renderer) {
            renderer(contentArea);
        } else {
            contentArea.innerHTML = '<p style="padding:2rem;text-align:center;">Content coming soon...</p>';
        }
    }
    
    // =========================================================================
    // SUBMENU RENDERERS
    // =========================================================================
    
    function renderGitaWisdom(container) {
        const questions = QuestionsData.getQuestionsBySubmenu('gita_wisdom');
        
        // Organized ready-made questions
        const readyQuestions = {
            '🌟 Basic Teachings': [
                "What is the main message of Bhagavad Gita?",
                "Who spoke the Bhagavad Gita and to whom?",
                "What is Karma according to Gita?",
                "What is Dharma in simple words?",
                "What does Gita say about soul?"
            ],
            '💡 Daily Life': [
                "How to stay peaceful in difficult times?",
                "How to control anger according to Gita?",
                "What does Gita say about hard work?",
                "How to be happy according to Gita?",
                "How to handle fear according to Gita?"
            ],
            '❤️ Relationships': [
                "How should we treat our parents?",
                "What does Gita say about respecting elders?",
                "Should we forgive others per Gita?",
                "What does Gita say about kindness?",
                "What is true love according to Gita?"
            ],
            '📚 Studies & Work': [
                "What does Gita teach about learning?",
                "How to handle exam stress per Gita?",
                "What does Gita say about hard work?",
                "How to handle failure in exams?",
                "How to stay disciplined in studies?"
            ],
            '💭 Emotions': [
                "How to control negative thoughts?",
                "What to do when feeling sad?",
                "How to overcome jealousy per Gita?",
                "What does Gita say about patience?",
                "How to develop positive thinking?"
            ],
            '🕉️ Spirituality': [
                "Who is God according to Bhagavad Gita?",
                "What is devotion or Bhakti?",
                "How to pray according to Gita?",
                "What is the purpose of life per Gita?",
                "How to become a better person?"
            ]
        };
        
        container.innerHTML = `
            <h2>📿 Gita Wisdom & Spirituality</h2>
            <p>Ask questions about life, spirituality, or Bhagavad Gita teachings</p>
            
            <!-- Mode Toggle with Radio Buttons - HORIZONTAL on all devices -->
            <div style="display:flex;gap:0.75rem;margin-bottom:1.5rem;">
                <label style="display:flex;align-items:center;gap:0.5rem;padding:0.7rem 1rem;border:2px solid #e6d5c3;border-radius:50px;cursor:pointer;background:#fffbf0;transition:all 0.3s;flex:1;justify-content:center;" id="explore-label">
                    <input type="radio" name="gita-mode" id="explore-mode" value="explore" checked onchange="window.AppFunctions.toggleGitaMode('explore')" style="width:18px;height:18px;cursor:pointer;">
                    <span style="font-weight:600;color:#d97706;font-size:0.9rem;">📖 Explore Questions</span>
                </label>
                
                <label style="display:flex;align-items:center;gap:0.5rem;padding:0.7rem 1rem;border:2px solid #dee2e6;border-radius:50px;cursor:pointer;background:white;transition:all 0.3s;flex:1;justify-content:center;" id="custom-label">
                    <input type="radio" name="gita-mode" id="custom-mode" value="custom" onchange="window.AppFunctions.toggleGitaMode('custom')" style="width:18px;height:18px;cursor:pointer;">
                    <span style="font-weight:600;color:#495057;font-size:0.9rem;">✍️ Ask My Own</span>
                </label>
            </div>
            
            <!-- Explore Questions Section (shows first, at TOP) -->
            <div id="explore-section" style="display:block;">
                <div style="background:#fffbf0;border:2px solid #e6d5c3;border-radius:12px;padding:1.5rem;margin-bottom:1.5rem;">
                    <div class="form-group" style="margin-bottom:0.8rem;">
                        <label>Select Category:</label>
                        <select id="gita-category" onchange="window.AppFunctions.loadGitaQuestions()">
                            <option value="">-- Choose Category --</option>
                            ${Object.keys(readyQuestions).map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                        </select>
                    </div>
                    
                    <div class="form-group" id="gita-questions-dropdown" style="display:none;margin-bottom:0.8rem;">
                        <label>Select Question:</label>
                        <select id="gita-question-select">
                            <option value="">-- Choose Question --</option>
                        </select>
                    </div>
                    
                    <button class="submit-btn" id="gita-ready-submit-btn" onclick="window.AppFunctions.askReadyQuestion(document.getElementById('gita-question-select').value)" style="display:none;">
                        <i class="fas fa-paper-plane"></i> Ask This Question
                    </button>
                </div>
            </div>
            
            <!-- Custom Question Section (shows when toggled, at BOTTOM of page flow) -->
            <div id="custom-section" style="display:none;">
                <div style="background:#f8f9fa;border:2px solid #dee2e6;border-radius:12px;padding:1.5rem;">
                    <div class="form-group" style="margin-bottom:0.8rem;">
                        <label>Your Question:</label>
                        <input type="text" id="gita-input" placeholder="Type your question here..." autocomplete="off">
                        <div id="gita-suggestions" style="margin-top:0.5rem;background:white;border:1px solid #e6d5c3;border-radius:8px;max-height:200px;overflow-y:auto;display:none;"></div>
                    </div>
                    
                    <button class="submit-btn" onclick="window.AppFunctions.submitGitaQuestion()">
                        <i class="fas fa-paper-plane"></i> Ask Question
                    </button>
                </div>
            </div>
        `;
        
        // Store questions in window for access
        window.gitaReadyQuestions = readyQuestions;
        
        // Setup autocomplete after DOM is ready with longer delay
        setTimeout(() => {
            const input = document.getElementById('gita-input');
            const suggestionsDiv = document.getElementById('gita-suggestions');
            
            if (input) {
                // Manual autocomplete implementation
                input.addEventListener('input', function(e) {
                    const query = e.target.value.trim();
                    
                    if (query.length < 2) {
                        suggestionsDiv.style.display = 'none';
                        return;
                    }
                    
                    const matches = questions.filter(q => 
                        q.question.toLowerCase().includes(query.toLowerCase())
                    ).slice(0, 5);
                    
                    if (matches.length > 0) {
                        suggestionsDiv.innerHTML = matches.map(q => `
                            <div style="padding:0.75rem;cursor:pointer;border-bottom:1px solid #f0f0f0;" 
                                 onmouseover="this.style.background='#fef3c7'" 
                                 onmouseout="this.style.background='white'"
                                 onclick="document.getElementById('gita-input').value='${q.question.replace(/'/g, "\\'")}';document.getElementById('gita-suggestions').style.display='none';">
                                ${q.question}
                            </div>
                        `).join('');
                        suggestionsDiv.style.display = 'block';
                    } else {
                        suggestionsDiv.style.display = 'none';
                    }
                });
                
                // Close suggestions when clicking outside
                document.addEventListener('click', function(e) {
                    if (!input.contains(e.target) && !suggestionsDiv.contains(e.target)) {
                        suggestionsDiv.style.display = 'none';
                    }
                });
                
                console.log('✅ Manual autocomplete setup complete');
            }
        }, 200);
    }
    
    function renderTemplesSites(container) {
        const api = TourGuideData.get();
        const categories = api.getAllCategories();
        const allSites = api.getAllSites();
        
        container.innerHTML = `
            <h2>🛕 Temples, Museums & Heritage Sites</h2>
            <p>Explore 79+ heritage sites from kkrtour.com</p>
            
            <!-- Mode Toggle with Radio Buttons -->
            <div style="display:flex;gap:1rem;margin-bottom:1.5rem;flex-wrap:wrap;">
                <label style="display:flex;align-items:center;gap:0.5rem;padding:0.75rem 1.25rem;border:2px solid #e6d5c3;border-radius:50px;cursor:pointer;background:#fffbf0;transition:all 0.3s;" id="browse-label">
                    <input type="radio" name="site-mode" id="browse-mode" value="browse" checked onchange="window.AppFunctions.toggleSiteMode('browse')" style="width:18px;height:18px;cursor:pointer;">
                    <span style="font-weight:600;color:#d97706;">🗺️ Browse Sites</span>
                </label>
                
                <label style="display:flex;align-items:center;gap:0.5rem;padding:0.75rem 1.25rem;border:2px solid #dee2e6;border-radius:50px;cursor:pointer;background:white;transition:all 0.3s;" id="search-label">
                    <input type="radio" name="site-mode" id="search-mode" value="search" onchange="window.AppFunctions.toggleSiteMode('search')" style="width:18px;height:18px;cursor:pointer;">
                    <span style="font-weight:600;color:#495057;">🔍 Search by Name</span>
                </label>
            </div>
            
            <!-- Browse Sites Section -->
            <div id="browse-section" style="display:block;">
                <div style="background:#fffbf0;border:2px solid #e6d5c3;border-radius:12px;padding:1.5rem;">
                    <div class="form-group" style="margin-bottom:0.8rem;">
                        <label>Select Category:</label>
                        <select id="site-category" onchange="window.AppFunctions.loadSitesByCategory()">
                            <option value="">-- Choose Category --</option>
                            ${categories.map(cat => `<option value="${cat.name}">${cat.icon} ${cat.name} (${cat.count})</option>`).join('')}
                        </select>
                    </div>
                    
                    <div class="form-group" id="site-selection" style="display:none;margin-bottom:0.8rem;">
                        <label>Select Site:</label>
                        <select id="site-select">
                            <option value="">-- Choose Site --</option>
                        </select>
                    </div>
                    
                    <button class="submit-btn" onclick="window.AppFunctions.viewSiteDetails()" style="display:none;" id="view-site-btn">
                        <i class="fas fa-eye"></i> View Site Details
                    </button>
                </div>
            </div>
            
            <!-- Search by Name Section -->
            <div id="search-section" style="display:none;">
                <div style="background:#f8f9fa;border:2px solid #dee2e6;border-radius:12px;padding:1.5rem;">
                    <div class="form-group" style="margin-bottom:0.8rem;">
                        <label>Search Site Name:</label>
                        <input type="text" id="site-search-input" placeholder="Type site name (e.g., Brahma Sarovar)..." autocomplete="off">
                        <div id="site-suggestions" style="margin-top:0.5rem;background:white;border:1px solid #e6d5c3;border-radius:8px;max-height:200px;overflow-y:auto;display:none;"></div>
                        <input type="hidden" id="selected-site-id">
                    </div>
                    
                    <button class="submit-btn" onclick="window.AppFunctions.viewSearchedSite()">
                        <i class="fas fa-eye"></i> View Site Details
                    </button>
                </div>
            </div>
        `;
        
        // Setup autocomplete for search after DOM is ready
        setTimeout(() => {
            const searchInput = document.getElementById('site-search-input');
            const suggestionsDiv = document.getElementById('site-suggestions');
            const selectedIdInput = document.getElementById('selected-site-id');
            
            if (searchInput) {
                searchInput.addEventListener('input', function(e) {
                    const query = e.target.value.trim();
                    
                    if (query.length < 2) {
                        suggestionsDiv.style.display = 'none';
                        selectedIdInput.value = '';
                        return;
                    }
                    
                    const matches = allSites.filter(site => 
                        site.name.toLowerCase().includes(query.toLowerCase())
                    ).slice(0, 8);
                    
                    if (matches.length > 0) {
                        suggestionsDiv.innerHTML = matches.map(site => `
                            <div style="padding:0.75rem;cursor:pointer;border-bottom:1px solid #f0f0f0;" 
                                 onmouseover="this.style.background='#fef3c7'" 
                                 onmouseout="this.style.background='white'"
                                 onclick="window.AppFunctions.selectSiteFromSearch(${site.id}, '${site.name.replace(/'/g, "\\'")}')">
                                <strong>${site.name}</strong>${site.mustVisit?' ⭐':''}
                                <br><small style="color:#666;">${site.category}</small>
                            </div>
                        `).join('');
                        suggestionsDiv.style.display = 'block';
                    } else {
                        suggestionsDiv.style.display = 'none';
                    }
                });
                
                // Close suggestions when clicking outside
                document.addEventListener('click', function(e) {
                    if (!searchInput.contains(e.target) && !suggestionsDiv.contains(e.target)) {
                        suggestionsDiv.style.display = 'none';
                    }
                });
                
                console.log('✅ Site search autocomplete setup complete');
            }
        }, 200);
    }
    
    function renderStayTravel(container) {
        const questions = QuestionsData.getQuestionsBySubmenu('stay_travel');
        const categories = [...new Set(questions.map(q => q.category))];
        
        container.innerHTML = `
            <h2>🏨 Stay, Food & Travel</h2>
            <p>Find accommodation, restaurants, and transport information</p>
            
            <!-- Mode Toggle with Radio Buttons -->
            <div style="display:flex;gap:1rem;margin-bottom:1.5rem;flex-wrap:wrap;">
                <label style="display:flex;align-items:center;gap:0.5rem;padding:0.75rem 1.25rem;border:2px solid #e6d5c3;border-radius:50px;cursor:pointer;background:#fffbf0;transition:all 0.3s;" id="stay-browse-label">
                    <input type="radio" name="stay-mode" id="stay-browse-mode" value="browse" checked onchange="window.AppFunctions.toggleStayMode('browse')" style="width:18px;height:18px;cursor:pointer;">
                    <span style="font-weight:600;color:#d97706;">📋 Browse by Category</span>
                </label>
                
                <label style="display:flex;align-items:center;gap:0.5rem;padding:0.75rem 1.25rem;border:2px solid #dee2e6;border-radius:50px;cursor:pointer;background:white;transition:all 0.3s;" id="stay-search-label">
                    <input type="radio" name="stay-mode" id="stay-search-mode" value="search" onchange="window.AppFunctions.toggleStayMode('search')" style="width:18px;height:18px;cursor:pointer;">
                    <span style="font-weight:600;color:#495057;">🔍 Search Question</span>
                </label>
            </div>
            
            <!-- Browse by Category Section -->
            <div id="stay-browse-section" style="display:block;">
                <div style="background:#fffbf0;border:2px solid #e6d5c3;border-radius:12px;padding:1.5rem;">
                    <div class="form-group" style="margin-bottom:0.8rem;">
                        <label>Select Category:</label>
                        <select id="stay-category" onchange="window.AppFunctions.loadStayQuestions()">
                            <option value="">-- Choose Category --</option>
                            ${categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                        </select>
                    </div>
                    
                    <div class="form-group" id="stay-questions" style="display:none;margin-bottom:0.8rem;">
                        <label>Select Question:</label>
                        <select id="stay-question-select">
                            <option value="">-- Choose Question --</option>
                        </select>
                    </div>
                    
                    <button class="submit-btn" onclick="window.AppFunctions.submitStayQuery()" style="display:none;" id="stay-submit-btn">
                        <i class="fas fa-search"></i> Get Information
                    </button>
                </div>
            </div>
            
            <!-- Search Question Section -->
            <div id="stay-search-section" style="display:none;">
                <div style="background:#f8f9fa;border:2px solid #dee2e6;border-radius:12px;padding:1.5rem;">
                    <div class="form-group" style="margin-bottom:0.8rem;">
                        <label>Search Your Question:</label>
                        <input type="text" id="stay-search-input" placeholder="Type your question (e.g., Best hotels near...)..." autocomplete="off">
                        <div id="stay-suggestions" style="margin-top:0.5rem;background:white;border:1px solid #e6d5c3;border-radius:8px;max-height:200px;overflow-y:auto;display:none;"></div>
                        <input type="hidden" id="selected-stay-question-id">
                    </div>
                    
                    <button class="submit-btn" onclick="window.AppFunctions.submitSearchedStayQuery()">
                        <i class="fas fa-search"></i> Get Information
                    </button>
                </div>
            </div>
        `;
        
        // Setup autocomplete for search after DOM is ready
        setTimeout(() => {
            const searchInput = document.getElementById('stay-search-input');
            const suggestionsDiv = document.getElementById('stay-suggestions');
            const selectedIdInput = document.getElementById('selected-stay-question-id');
            
            if (searchInput) {
                searchInput.addEventListener('input', function(e) {
                    const query = e.target.value.trim();
                    
                    if (query.length < 2) {
                        suggestionsDiv.style.display = 'none';
                        selectedIdInput.value = '';
                        return;
                    }
                    
                    const matches = questions.filter(q => 
                        q.question.toLowerCase().includes(query.toLowerCase())
                    ).slice(0, 8);
                    
                    if (matches.length > 0) {
                        suggestionsDiv.innerHTML = matches.map(q => `
                            <div style="padding:0.75rem;cursor:pointer;border-bottom:1px solid #f0f0f0;" 
                                 onmouseover="this.style.background='#fef3c7'" 
                                 onmouseout="this.style.background='white'"
                                 onclick="window.AppFunctions.selectStayFromSearch('${q.id}', '${q.question.replace(/'/g, "\\'")}')">
                                <strong>${q.question}</strong>
                                <br><small style="color:#666;">${q.category}</small>
                            </div>
                        `).join('');
                        suggestionsDiv.style.display = 'block';
                    } else {
                        suggestionsDiv.style.display = 'none';
                    }
                });
                
                // Close suggestions when clicking outside
                document.addEventListener('click', function(e) {
                    if (!searchInput.contains(e.target) && !suggestionsDiv.contains(e.target)) {
                        suggestionsDiv.style.display = 'none';
                    }
                });
                
                console.log('✅ Stay search autocomplete setup complete');
            }
        }, 200);
    }
    
    function renderFestivals(container) {
        const questions = QuestionsData.getQuestionsBySubmenu('festivals_events');
        const categories = [...new Set(questions.map(q => q.category))];
        
        container.innerHTML = `
            <h2>📅 Festivals & Events</h2>
            <p>Upcoming festivals and cultural programs</p>
            
            <div class="form-group">
                <label>Category:</label>
                <select id="festival-category" onchange="window.AppFunctions.loadFestivalQuestions()">
                    <option value="">-- Choose Category --</option>
                    ${categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                </select>
            </div>
            
            <div class="form-group" id="festival-questions" style="display:none;">
                <label>Question:</label>
                <select id="festival-question-select"></select>
            </div>
            
            <button class="submit-btn" onclick="window.AppFunctions.submitFestivalQuery()">
                <i class="fas fa-calendar"></i> Get Info
            </button>
            
            <div class="result-area" id="festival-result"></div>
        `;
    }
    
    function renderHeritageResearch(container) {
        // Ready-made Heritage Research questions
        const readyQuestions = {
            '🏛️ Archaeological Evidence': [
                "What archaeological evidence has been found in Kurukshetra?",
                "Which ancient sites in Kurukshetra have been excavated?",
                "What artifacts have been discovered in Kurukshetra?",
                "What do excavations reveal about ancient settlements in Kurukshetra?",
                "What is the significance of Painted Grey Ware culture in Kurukshetra?",
                "Are there settlement layers showing ancient habitation in Kurukshetra?",
                "What archaeological findings are linked to the Mahabharata period?",
                "Which archaeological sites near Thanesar have been studied?",
                "What remains have been found at Amin archaeological site?",
                "What is known about excavations at Thanesar mound?",
                "Why is archaeological proof of the Mahabharata war limited?"
            ],
            '📜 Historical Records & Periods': [
                "What is the historical significance of Kurukshetra?",
                "How has Kurukshetra evolved across historical periods?",
                "Which dynasties ruled the Kurukshetra region?",
                "What evidence exists from Mauryan and Gupta periods in Kurukshetra?",
                "What do medieval records say about Kurukshetra?",
                "How did Kurukshetra develop during Mughal times?",
                "What do British period records tell about Kurukshetra?",
                "How did Kurukshetra change after independence?",
                "How did pilgrimage traditions shape historical Kurukshetra?",
                "What role did Kurukshetra play in regional administration historically?"
            ],
            '🕉️ Textual & Literary Sources': [
                "Which ancient texts mention Kurukshetra?",
                "How does the Mahabharata describe Kurukshetra?",
                "Why is Kurukshetra called Dharmakshetra?",
                "How is Kurukshetra described in the Puranas?",
                "What literary sources describe the Kurukshetra region?",
                "How do textual descriptions compare with archaeology?",
                "What challenges exist in linking texts with real locations?",
                "What do scholars say about epic descriptions of Kurukshetra?"
            ],
            '🛕 Sacred Geography & Sites': [
                "What is the significance of Brahma Sarovar?",
                "Why is Jyotisar important historically and spiritually?",
                "What is Sannihit Sarovar known for?",
                "What is the 48 Kos Parikrama tradition?",
                "Why are water bodies sacred in Kurukshetra?",
                "Which sacred sites are part of Kurukshetra pilgrimage routes?",
                "How is Kurukshetra's sacred geography defined?",
                "What are major traditional pilgrimage locations in Kurukshetra?"
            ],
            '🎨 Cultural & Living Heritage': [
                "What cultural traditions are associated with Kurukshetra?",
                "How have fairs and festivals shaped Kurukshetra's identity?",
                "What role does oral tradition play in Kurukshetra heritage?",
                "How has cultural memory preserved Kurukshetra's history?",
                "What intangible heritage survives in Kurukshetra today?",
                "How do pilgrimage practices influence local culture?",
                "How have traditions evolved in modern Kurukshetra?"
            ],
            '📚 Academic & Scholarly Research': [
                "What academic research exists on Kurukshetra archaeology?",
                "How do historians evaluate the Mahabharata war?",
                "What debates exist about the historicity of the Mahabharata?",
                "Which institutions research Kurukshetra heritage?",
                "How do scholars interpret epic traditions historically?",
                "What modern research methods are used in heritage studies?"
            ],
            '⚖️ Understanding Evidence & Methods': [
                "What counts as archaeological evidence?",
                "Why is it difficult to prove epic events archaeologically?",
                "How do historians separate myth and history?",
                "What are limitations of archaeological research?",
                "How should conflicting historical interpretations be understood?",
                "What does absence of evidence mean in archaeology?",
                "How are historical periods dated archaeologically?"
            ]
        };
        
        container.innerHTML = `
            <h2>📚 Heritage Research</h2>
            <p>Research questions about history, archaeology, and cultural heritage</p>
            
            <!-- Mode Toggle with Radio Buttons -->
            <div style="display:flex;gap:1rem;margin-bottom:1.5rem;flex-wrap:wrap;">
                <label style="display:flex;align-items:center;gap:0.5rem;padding:0.75rem 1.25rem;border:2px solid #e6d5c3;border-radius:50px;cursor:pointer;background:#fffbf0;transition:all 0.3s;" id="heritage-explore-label">
                    <input type="radio" name="heritage-mode" id="heritage-explore-mode" value="explore" checked onchange="window.AppFunctions.toggleHeritageMode('explore')" style="width:18px;height:18px;cursor:pointer;">
                    <span style="font-weight:600;color:#d97706;">📖 Ready Questions</span>
                </label>
                
                <label style="display:flex;align-items:center;gap:0.5rem;padding:0.75rem 1.25rem;border:2px solid #dee2e6;border-radius:50px;cursor:pointer;background:white;transition:all 0.3s;" id="heritage-custom-label">
                    <input type="radio" name="heritage-mode" id="heritage-custom-mode" value="custom" onchange="window.AppFunctions.toggleHeritageMode('custom')" style="width:18px;height:18px;cursor:pointer;">
                    <span style="font-weight:600;color:#495057;">✍️ Ask Your Own</span>
                </label>
            </div>
            
            <!-- Ready Questions Section -->
            <div id="heritage-explore-section" style="display:block;">
                <div style="background:#fffbf0;border:2px solid #e6d5c3;border-radius:12px;padding:1.5rem;">
                    <div class="form-group" style="margin-bottom:0.8rem;">
                        <label>Select Category:</label>
                        <select id="heritage-category" onchange="window.AppFunctions.loadHeritageQuestions()">
                            <option value="">-- Choose Category --</option>
                            ${Object.keys(readyQuestions).map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                        </select>
                    </div>
                    
                    <div class="form-group" id="heritage-questions-dropdown" style="display:none;margin-bottom:0.8rem;">
                        <label>Select Question:</label>
                        <select id="heritage-question-select">
                            <option value="">-- Choose Question --</option>
                        </select>
                    </div>
                    
                    <button class="submit-btn" id="heritage-ready-submit-btn" onclick="window.AppFunctions.submitHeritageReady()" style="display:none;">
                        <i class="fas fa-search"></i> Research This
                    </button>
                </div>
            </div>
            
            <!-- Custom Question Section -->
            <div id="heritage-custom-section" style="display:none;">
                <div style="background:#f8f9fa;border:2px solid #dee2e6;border-radius:12px;padding:1.5rem;">
                    <div class="form-group" style="margin-bottom:0.8rem;">
                        <label>Your Research Question:</label>
                        <input type="text" id="heritage-research-input" placeholder="e.g., Archaeological evidence of Mahabharata war?" autocomplete="off">
                    </div>
                    
                    <button class="submit-btn" onclick="window.AppFunctions.submitHeritageResearch()">
                        <i class="fas fa-search"></i> Research
                    </button>
                </div>
            </div>
        `;
        
        // Store questions in window for access
        window.heritageReadyQuestions = readyQuestions;
    }
    
    function renderDemographics(container) {
        // Ready-made Demographics questions
        const readyQuestions = {
            '📍 Population Data': [
                "What is the current population of Kurukshetra district?",
                "How has Kurukshetra's population grown over the decades?",
                "What is the population density of Kurukshetra?",
                "What is the urban vs rural population distribution?",
                "What is the gender ratio (sex ratio) in Kurukshetra?",
                "Which are the most populated towns and villages?"
            ],
            
            '🗺️ Geographic & Administrative': [
                "What is the total area of Kurukshetra district?",
                "How many blocks and tehsils are in Kurukshetra?",
                "What are the district boundaries of Kurukshetra?",
                "How many villages are in Kurukshetra district?",
                "What is the administrative structure of the district?"
            ],
            
            '📈 Development Indicators': [
                "What is the literacy rate in Kurukshetra?",
                "What is the Human Development Index (HDI) of Kurukshetra?",
                "How does Kurukshetra rank among Haryana districts in development?",
                "What is the per capita income in Kurukshetra?",
                "What percentage of population has access to basic amenities?",
                "What is the unemployment rate in Kurukshetra?",
                "How has district infrastructure developed in recent years?"
            ],
            
            '🏥 Health & Education': [
                "How many hospitals and primary health centers exist?",
                "What is the infant mortality rate in Kurukshetra?",
                "How many schools and educational institutions are there?",
                "What is the child sex ratio in the district?",
                "What percentage of children are enrolled in schools?",
                "What are the major health indicators in Kurukshetra?"
            ],
            
            '💼 Economic Statistics': [
                "What are the main economic sectors in Kurukshetra?",
                "What percentage of population works in agriculture?",
                "What is the industrial contribution to district economy?",
                "How many people work in the services sector?",
                "What is the poverty rate in Kurukshetra district?"
            ],
            
            '🏘️ Urbanization & Infrastructure': [
                "What percentage of Kurukshetra is urbanized?",
                "How many households are in the district?",
                "What is the average household size?",
                "What percentage have electricity and piped water supply?",
                "How has urban growth progressed in recent decades?",
                "What is the status of road and transport infrastructure?"
            ]
        };
        
        const categories = Object.keys(readyQuestions);
        
        container.innerHTML = `
            <h2>📊 Demographics & Statistics</h2>
            <p>Population, area, and development data</p>
            
            <!-- Selection Mode -->
            <div style="margin: 1.5rem 0;">
                <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem;">
                    <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                        <input type="radio" name="demo-mode" value="ready" checked 
                               onchange="window.AppFunctions.toggleDemoMode('ready')">
                        <span style="display: flex; align-items: center; gap: 0.3rem;">
                            <i class="fas fa-list-ul"></i> Ready Questions
                        </span>
                    </label>
                    
                    <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                        <input type="radio" name="demo-mode" value="custom" 
                               onchange="window.AppFunctions.toggleDemoMode('custom')">
                        <span style="display: flex; align-items: center; gap: 0.3rem;">
                            <i class="fas fa-edit"></i> Ask Your Own
                        </span>
                    </label>
                </div>
            </div>
            
            <!-- Ready Questions Section -->
            <div id="demo-ready-section">
                <div class="form-group">
                    <label for="demo-category-select">
                        <i class="fas fa-folder"></i> Select Category:
                    </label>
                    <select id="demo-category-select" onchange="window.AppFunctions.loadDemoQuestions()">
                        <option value="">-- Choose a Category --</option>
                        ${categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                    </select>
                </div>
                
                <div class="form-group" id="demo-question-group" style="display:none;">
                    <label for="demo-question-select">
                        <i class="fas fa-question-circle"></i> Select Question:
                    </label>
                    <select id="demo-question-select"></select>
                </div>
                
                <button id="demo-submit-ready" onclick="window.AppFunctions.submitDemoReady()" 
                        class="submit-btn" style="display:none;">
                    <i class="fas fa-search"></i> Get Statistics
                </button>
            </div>
            
            <!-- Custom Question Section -->
            <div id="demo-custom-section" style="display:none;">
                <div class="form-group">
                    <label for="demo-custom-input">
                        <i class="fas fa-edit"></i> Enter Your Question:
                    </label>
                    <textarea id="demo-custom-input" rows="3" 
                              placeholder="Example: What is the literacy rate in rural Kurukshetra?"
                              style="width:100%;padding:0.75rem;border:2px solid #e5e7eb;border-radius:8px;font-size:0.95rem;"></textarea>
                </div>
                
                <button onclick="window.AppFunctions.submitDemoCustom()" class="submit-btn">
                    <i class="fas fa-search"></i> Get Statistics
                </button>
            </div>
            
            <!-- Quick Facts -->
            <div style="margin-top:2rem;padding:1.5rem;background:#f0f9ff;border-radius:12px;border:2px solid #bfdbfe;">
                <h3 style="color:#1e40af;margin-bottom:1rem;display:flex;align-items:center;gap:0.5rem;">
                    <i class="fas fa-info-circle"></i> Quick Facts
                </h3>
                <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;">
                    <div style="padding:0.75rem;background:white;border-radius:8px;">
                        <div style="color:#6b7280;font-size:0.85rem;margin-bottom:0.25rem;">District</div>
                        <div style="color:#1e40af;font-weight:600;font-size:1.1rem;">Kurukshetra</div>
                    </div>
                    <div style="padding:0.75rem;background:white;border-radius:8px;">
                        <div style="color:#6b7280;font-size:0.85rem;margin-bottom:0.25rem;">Area</div>
                        <div style="color:#1e40af;font-weight:600;font-size:1.1rem;">1,530 km²</div>
                    </div>
                    <div style="padding:0.75rem;background:white;border-radius:8px;">
                        <div style="color:#6b7280;font-size:0.85rem;margin-bottom:0.25rem;">Population</div>
                        <div style="color:#1e40af;font-weight:600;font-size:1.1rem;">~10 lakhs</div>
                    </div>
                </div>
            </div>
        `;
        
        // Store questions for later use
        window.demographicsQuestions = readyQuestions;
    }
    
    function renderGovernment(container) {
        const questions = QuestionsData.getQuestionsBySubmenu('government');
        const categories = [...new Set(questions.map(q => q.category))];
        
        container.innerHTML = `
            <h2>🏢 Government Offices & Services</h2>
            <p>Office locations, timings, and services</p>
            
            <div class="form-group">
                <label>Category:</label>
                <select id="gov-category" onchange="window.AppFunctions.loadGovQuestions()">
                    <option value="">-- Choose --</option>
                    ${categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                </select>
            </div>
            
            <div class="form-group" id="gov-questions" style="display:none;">
                <label>Service:</label>
                <select id="gov-question-select"></select>
            </div>
            
            <button class="submit-btn" onclick="window.AppFunctions.submitGovQuery()">
                <i class="fas fa-building"></i> Get Info
            </button>
            
            <div class="result-area" id="gov-result"></div>
        `;
    }
    
    function renderEducationHealth(container) {
        container.innerHTML = `
            <h2>🏫 Education & Healthcare</h2>
            <p>Schools, colleges, hospitals</p>
            
            <div style="display:flex;gap:1rem;margin-bottom:1.5rem;">
                <button class="submit-btn" onclick="window.AppFunctions.showEducation()" style="flex:1;">
                    🏫 Education
                </button>
                <button class="submit-btn" onclick="window.AppFunctions.showHealthcare()" style="flex:1;">
                    🏥 Healthcare
                </button>
            </div>
            
            <div id="edu-health-content"></div>
        `;
    }
    
    function renderInfrastructure(container) {
        container.innerHTML = `
            <h2>🚌 Infrastructure & Utilities</h2>
            <p>Transport, electricity, utilities</p>
            
            <div style="display:flex;gap:1rem;margin-bottom:1.5rem;">
                <button class="submit-btn" onclick="window.AppFunctions.showTransport()" style="flex:1;">
                    🚌 Transport
                </button>
                <button class="submit-btn" onclick="window.AppFunctions.showUtilities()" style="flex:1;">
                    💡 Utilities
                </button>
            </div>
            
            <div id="infra-content"></div>
        `;
    }
    
    function renderAdminResearch(container) {
        container.innerHTML = `
            <h2>📚 Administrative Research</h2>
            <p>City planning and development</p>
            
            <div class="form-group">
                <label>Question:</label>
                <input type="text" id="admin-research-input" placeholder="e.g., Smart city projects?" autocomplete="off">
            </div>
            
            <button class="submit-btn" onclick="window.AppFunctions.submitAdminResearch()">
                <i class="fas fa-search"></i> Research
            </button>
            
            <div class="result-area" id="admin-research-result"></div>
        `;
    }
    
    // =========================================================================
    // PUBLIC API - Uses existing APIModule for n8n calls
    // =========================================================================
    
    window.AppFunctions = {
        
        // Toggle between Explore and Custom modes
        toggleGitaMode: function(mode) {
            const exploreSection = document.getElementById('explore-section');
            const customSection = document.getElementById('custom-section');
            const exploreLabel = document.getElementById('explore-label');
            const customLabel = document.getElementById('custom-label');
            
            if (mode === 'explore') {
                exploreSection.style.display = 'block';
                customSection.style.display = 'none';
                
                exploreLabel.style.background = '#fffbf0';
                exploreLabel.style.borderColor = '#e6d5c3';
                exploreLabel.querySelector('span').style.color = '#d97706';
                
                customLabel.style.background = 'white';
                customLabel.style.borderColor = '#dee2e6';
                customLabel.querySelector('span').style.color = '#495057';
            } else {
                exploreSection.style.display = 'none';
                customSection.style.display = 'block';
                
                exploreLabel.style.background = 'white';
                exploreLabel.style.borderColor = '#dee2e6';
                exploreLabel.querySelector('span').style.color = '#495057';
                
                customLabel.style.background = '#f8f9fa';
                customLabel.style.borderColor = '#dee2e6';
                customLabel.querySelector('span').style.color = '#d97706';
            }
        },
        
        // Load Gita Questions by Category
        loadGitaQuestions: function() {
            const category = document.getElementById('gita-category').value;
            const questionsDropdown = document.getElementById('gita-questions-dropdown');
            const submitBtn = document.getElementById('gita-ready-submit-btn');
            
            if (!category) {
                questionsDropdown.style.display = 'none';
                submitBtn.style.display = 'none';
                return;
            }
            
            const questions = window.gitaReadyQuestions[category];
            const select = document.getElementById('gita-question-select');
            
            select.innerHTML = '<option value="">-- Choose Question --</option>' +
                questions.map(q => `<option value="${q}">${q}</option>`).join('');
            
            questionsDropdown.style.display = 'block';
            submitBtn.style.display = 'inline-block';
        },
        
        // Ready Question Handler (now takes question directly)
        askReadyQuestion: function(question) {
            if (!question) {
                alert('Please select a question');
                return;
            }
            
            // Set the question in the input field
            const input = document.getElementById('gita-input');
            if (input) {
                input.value = question;
            }
            
            // Auto-submit
            setTimeout(() => {
                this.submitGitaQuestion();
            }, 300);
        },
        
        // SITES - Toggle between Browse and Search modes
        toggleSiteMode: function(mode) {
            const browseSection = document.getElementById('browse-section');
            const searchSection = document.getElementById('search-section');
            const browseLabel = document.getElementById('browse-label');
            const searchLabel = document.getElementById('search-label');
            
            if (mode === 'browse') {
                browseSection.style.display = 'block';
                searchSection.style.display = 'none';
                
                browseLabel.style.background = '#fffbf0';
                browseLabel.style.borderColor = '#e6d5c3';
                browseLabel.querySelector('span').style.color = '#d97706';
                
                searchLabel.style.background = 'white';
                searchLabel.style.borderColor = '#dee2e6';
                searchLabel.querySelector('span').style.color = '#495057';
            } else {
                browseSection.style.display = 'none';
                searchSection.style.display = 'block';
                
                browseLabel.style.background = 'white';
                browseLabel.style.borderColor = '#dee2e6';
                browseLabel.querySelector('span').style.color = '#495057';
                
                searchLabel.style.background = '#f8f9fa';
                searchLabel.style.borderColor = '#dee2e6';
                searchLabel.querySelector('span').style.color = '#d97706';
            }
        },
        
        // SITES - Browse Mode
        loadSitesByCategory: function() {
            const category = document.getElementById('site-category').value;
            if (!category) return;
            
            const api = TourGuideData.get();
            const sites = api.getSitesByCategory(category);
            const select = document.getElementById('site-select');
            
            select.innerHTML = '<option value="">-- Choose Site --</option>' +
                sites.map(site => `<option value="${site.id}">${site.name}${site.mustVisit?' ⭐':''}</option>`).join('');
            
            document.getElementById('site-selection').style.display = 'block';
            document.getElementById('view-site-btn').style.display = 'inline-block';
        },
        
        // SITES - Search Mode: Select from autocomplete
        selectSiteFromSearch: function(siteId, siteName) {
            document.getElementById('site-search-input').value = siteName;
            document.getElementById('selected-site-id').value = siteId;
            document.getElementById('site-suggestions').style.display = 'none';
        },
        
        // SITES - Search Mode: View selected site
        viewSearchedSite: function() {
            const siteId = document.getElementById('selected-site-id').value;
            if (!siteId) {
                alert('Please search and select a site first');
                return;
            }
            
            const api = TourGuideData.get();
            const site = api.getSiteById(parseInt(siteId));
            if (!site) {
                alert('Site not found!');
                return;
            }
            
            this.showSiteModal(site);
        },
        
        // SITES - Browse Mode: View site details
        viewSiteDetails: function() {
            const siteId = document.getElementById('site-select').value;
            if (!siteId) { alert('Please select a site'); return; }
            
            const api = TourGuideData.get();
            const site = api.getSiteById(parseInt(siteId));
            if (!site) { alert('Site not found!'); return; }
            
            this.showSiteModal(site);
        },
        
        // Show Site Modal
        showSiteModal: function(site) {
            const siteUrl = `https://kkrtour.com/List.php?id=${site.id}`;
            
            const modalHTML = `
                <div id="site-modal" style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.7);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem;
                    animation: fadeIn 0.3s ease-in-out;
                ">
                    <div style="
                        background: white;
                        border-radius: 16px;
                        max-width: 900px;
                        width: 100%;
                        max-height: 90vh;
                        overflow-y: auto;
                        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                        animation: slideUp 0.3s ease-out;
                    ">
                        <!-- Modal Header -->
                        <div style="
                            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                            padding: 1.2rem 1.5rem;
                            border-radius: 16px 16px 0 0;
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                        ">
                            <h3 style="
                                color: white;
                                margin: 0;
                                font-size: 1.1rem;
                                display: flex;
                                align-items: center;
                                gap: 0.5rem;
                            ">
                                <i class="fas fa-map-marker-alt"></i>
                                Site Details
                            </h3>
                            
                            <!-- Icon Buttons in Header -->
                            <div style="display:flex;align-items:center;gap:0.5rem;">
                                <button onclick="window.AppFunctions.shareSiteWhatsApp()" title="Share on WhatsApp" style="
                                    background: rgba(255,255,255,0.2);
                                    border: none;
                                    color: white;
                                    width: 36px;
                                    height: 36px;
                                    border-radius: 50%;
                                    cursor: pointer;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    transition: all 0.2s;
                                " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                                    <i class="fab fa-whatsapp" style="font-size:1.2rem;"></i>
                                </button>
                                
                                <button onclick="window.AppFunctions.printSiteDetails()" title="Print" style="
                                    background: rgba(255,255,255,0.2);
                                    border: none;
                                    color: white;
                                    width: 36px;
                                    height: 36px;
                                    border-radius: 50%;
                                    cursor: pointer;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    transition: all 0.2s;
                                " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                                    <i class="fas fa-print"></i>
                                </button>
                                
                                <a href="${siteUrl}" target="_blank" title="Open Full Page" style="
                                    background: rgba(255,255,255,0.2);
                                    border: none;
                                    color: white;
                                    width: 36px;
                                    height: 36px;
                                    border-radius: 50%;
                                    cursor: pointer;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    transition: all 0.2s;
                                    text-decoration: none;
                                " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                                    <i class="fas fa-external-link-alt"></i>
                                </a>
                                
                                <button onclick="window.AppFunctions.closeSiteModal()" title="Close" style="
                                    background: rgba(255,255,255,0.2);
                                    border: none;
                                    color: white;
                                    width: 36px;
                                    height: 36px;
                                    border-radius: 50%;
                                    cursor: pointer;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    transition: all 0.2s;
                                " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Modal Body -->
                        <div style="padding: 1.5rem;">
                            <!-- Site Info Section -->
                            <div style="
                                background: #f0f9ff;
                                border: 1px solid #bfdbfe;
                                border-radius: 10px;
                                padding: 1rem;
                                margin-bottom: 1.2rem;
                            ">
                                <h4 style="margin: 0 0 0.5rem 0; color: #1e40af; font-size: 1.1rem; font-weight: 600;">
                                    ${site.name} ${site.mustVisit?'⭐':''}
                                </h4>
                                <p style="margin: 0.3rem 0; color: #1e3a8a; font-size: 0.9rem;">
                                    <strong>📂 Category:</strong> ${site.category}
                                </p>
                                ${site.mustVisit?'<p style="margin:0.3rem 0;color:#d97706;font-weight:600;font-size:0.9rem;">⭐ Must Visit Site</p>':''}
                            </div>
                            
                            <!-- Iframe Section -->
                            <div style="
                                border: 2px solid #e5e7eb;
                                border-radius: 10px;
                                overflow: hidden;
                                margin-bottom: 1.2rem;
                            ">
                                <iframe src="${siteUrl}" style="
                                    width: 100%;
                                    height: 500px;
                                    border: none;
                                "></iframe>
                            </div>
                            
                            <!-- Disclaimer -->
                            <div style="
                                background: #fef2f2;
                                border: 1px solid #fecaca;
                                border-radius: 8px;
                                padding: 0.7rem;
                                font-size: 0.8rem;
                                color: #991b1b;
                                display: flex;
                                align-items: flex-start;
                                gap: 0.5rem;
                            ">
                                <i class="fas fa-info-circle" style="margin-top: 0.1rem; font-size: 0.9rem;"></i>
                                <div>
                                    <strong>Source:</strong> Information displayed from kkrtour.com
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <style>
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes slideUp {
                        from { transform: translateY(50px); opacity: 0; }
                        to { transform: translateY(0); opacity: 1; }
                    }
                    
                    @media (max-width: 640px) {
                        #site-modal > div {
                            margin: 0.5rem;
                            border-radius: 12px !important;
                        }
                        #site-modal > div > div:first-child {
                            padding: 1rem !important;
                            border-radius: 12px 12px 0 0 !important;
                        }
                        #site-modal > div > div:first-child h3 {
                            font-size: 0.95rem !important;
                        }
                        #site-modal > div > div:first-child button,
                        #site-modal > div > div:first-child a {
                            width: 32px !important;
                            height: 32px !important;
                        }
                        #site-modal iframe {
                            height: 400px !important;
                        }
                    }
                </style>
            `;
            
            // Add modal to body
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            
            // Store site for actions
            window.currentSite = site;
            window.currentSiteUrl = siteUrl;
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        },
        
        // Close Site Modal
        closeSiteModal: function() {
            const modal = document.getElementById('site-modal');
            if (modal) {
                modal.remove();
                document.body.style.overflow = '';
            }
        },
        
        // Share Site on WhatsApp
        shareSiteWhatsApp: function() {
            const site = window.currentSite;
            const url = window.currentSiteUrl;
            const text = `*${site.name}*${site.mustVisit?' ⭐':''}\n\n📂 Category: ${site.category}\n\n🔗 View Details: ${url}\n\n_From Kurukshetra Mitra - Heritage Guide_`;
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
            window.open(whatsappUrl, '_blank');
        },
        
        // Print Site Details
        printSiteDetails: function() {
            const site = window.currentSite;
            const url = window.currentSiteUrl;
            
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html>
                <head>
                    <title>${site.name} - Details</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 2rem; max-width: 800px; margin: 0 auto; }
                        h1 { color: #d97706; border-bottom: 3px solid #d97706; padding-bottom: 0.5rem; }
                        .info { background: #f0f9ff; padding: 1rem; border-radius: 8px; margin: 1rem 0; }
                        .footer { margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #ccc; font-size: 0.9rem; color: #666; }
                    </style>
                </head>
                <body>
                    <h1>🛕 ${site.name} ${site.mustVisit?'⭐':''}</h1>
                    <div class="info">
                        <p><strong>Category:</strong> ${site.category}</p>
                        ${site.mustVisit?'<p style="color:#d97706;font-weight:bold;">⭐ Must Visit Site</p>':''}
                        <p><strong>More Info:</strong> <a href="${url}">${url}</a></p>
                    </div>
                    <div class="footer">
                        <p><em>Generated by Kurukshetra Mitra - Your Complete Guide</em></p>
                        <p><em>Date: ${new Date().toLocaleDateString()}</em></p>
                        <p><em>Source: kkrtour.com</em></p>
                    </div>
                </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        },
        
        // GITA - Uses APIModule if available, otherwise direct fetch
        submitGitaQuestion: async function() {
            const input = document.getElementById('gita-input');
            const question = input.value.trim();
            if (!question) { alert('Please enter a question'); return; }
            
            // Show modal with loading
            this.showLoadingModal(question);
            
            try {
                // Use APIModule if available
                let data;
                if (typeof APIModule !== 'undefined' && typeof APIModule.queryN8N === 'function') {
                    data = await APIModule.queryN8N(question, 'PHILOSOPHICAL_AI_QUERY');
                } else {
                    const response = await fetch(AppState.n8nWebhook, {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({question, queryType: 'PHILOSOPHICAL_AI_QUERY'})
                    });
                    
                    if (!response.ok) {
                        throw new Error(`Server error: ${response.status}`);
                    }
                    
                    data = await response.json();
                }
                
                // Update modal with answer
                this.showAnswerModal(question, data.answer || data.response || 'No response received');
                
            } catch (error) {
                console.error('Error:', error);
                this.closeAnswerModal();
                
                let errorMessage = '';
                if (error.message.includes('Failed to fetch') || error.message.includes('ERR_NAME_NOT_RESOLVED')) {
                    errorMessage = 'Unable to connect to server. Please check your internet connection.';
                } else {
                    errorMessage = error.message;
                }
                
                alert('❌ Error: ' + errorMessage);
            }
        },
        
        // Show Loading Modal
        showLoadingModal: function(question) {
            const modalHTML = `
                <div id="answer-modal" style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.7);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem;
                    animation: fadeIn 0.3s ease-in-out;
                ">
                    <div style="
                        background: white;
                        border-radius: 16px;
                        max-width: 600px;
                        width: 100%;
                        padding: 3rem;
                        text-align: center;
                        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                        animation: slideUp 0.3s ease-out;
                    ">
                        <div class="spinner" style="margin: 0 auto 1.5rem;"></div>
                        <h3 style="color: #d97706; margin: 0 0 0.5rem 0; font-size: 1.1rem;">
                            🕉️ Seeking Wisdom from Bhagavad Gita...
                        </h3>
                        <p style="color: #666; font-size: 0.9rem; margin: 0;">
                            Please wait while we find the answer
                        </p>
                    </div>
                </div>
                
                <style>
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes slideUp {
                        from { transform: translateY(50px); opacity: 0; }
                        to { transform: translateY(0); opacity: 1; }
                    }
                </style>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            document.body.style.overflow = 'hidden';
        },
        
        // Show Answer Modal
        showAnswerModal: function(question, answer) {
            // Remove existing modal
            const existing = document.getElementById('answer-modal');
            if (existing) existing.remove();
            
            // Create modal HTML
            const modalHTML = `
                <div id="answer-modal" style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.7);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem;
                    animation: fadeIn 0.3s ease-in-out;
                ">
                    <div style="
                        background: white;
                        border-radius: 16px;
                        max-width: 650px;
                        width: 100%;
                        max-height: 90vh;
                        overflow-y: auto;
                        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                        animation: slideUp 0.3s ease-out;
                    ">
                        <!-- Modal Header -->
                        <div style="
                            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                            padding: 1.2rem 1.5rem;
                            border-radius: 16px 16px 0 0;
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                        ">
                            <h3 style="
                                color: white;
                                margin: 0;
                                font-size: 1.1rem;
                                display: flex;
                                align-items: center;
                                gap: 0.5rem;
                            ">
                                <i class="fas fa-robot"></i>
                                AI Response
                            </h3>
                            
                            <!-- Icon Buttons in Header -->
                            <div style="display:flex;align-items:center;gap:0.5rem;">
                                <button onclick="window.AppFunctions.listenAnswer()" title="Listen" style="
                                    background: rgba(255,255,255,0.2);
                                    border: none;
                                    color: white;
                                    width: 36px;
                                    height: 36px;
                                    border-radius: 50%;
                                    cursor: pointer;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    transition: all 0.2s;
                                " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                                    <i class="fas fa-volume-up" id="listen-icon"></i>
                                </button>
                                
                                <button onclick="window.AppFunctions.shareWhatsApp()" title="Share on WhatsApp" style="
                                    background: rgba(255,255,255,0.2);
                                    border: none;
                                    color: white;
                                    width: 36px;
                                    height: 36px;
                                    border-radius: 50%;
                                    cursor: pointer;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    transition: all 0.2s;
                                " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                                    <i class="fab fa-whatsapp" style="font-size:1.2rem;"></i>
                                </button>
                                
                                <button onclick="window.AppFunctions.printAnswer()" title="Print" style="
                                    background: rgba(255,255,255,0.2);
                                    border: none;
                                    color: white;
                                    width: 36px;
                                    height: 36px;
                                    border-radius: 50%;
                                    cursor: pointer;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    transition: all 0.2s;
                                " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                                    <i class="fas fa-print"></i>
                                </button>
                                
                                <button onclick="window.AppFunctions.closeAnswerModal()" title="Close" style="
                                    background: rgba(255,255,255,0.2);
                                    border: none;
                                    color: white;
                                    width: 36px;
                                    height: 36px;
                                    border-radius: 50%;
                                    cursor: pointer;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    transition: all 0.2s;
                                " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Modal Body -->
                        <div style="padding: 1.5rem;">
                            <!-- Question Section -->
                            <div style="
                                background: #f0f9ff;
                                border: 1px solid #bfdbfe;
                                border-radius: 10px;
                                padding: 1rem;
                                margin-bottom: 1.2rem;
                            ">
                                <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
                                    <i class="fas fa-question-circle" style="color: #3b82f6; font-size: 1.1rem; margin-top: 0.2rem;"></i>
                                    <div style="flex:1;">
                                        <h4 style="margin: 0 0 0.4rem 0; color: #1e40af; font-size: 0.85rem; font-weight: 600;">Question:</h4>
                                        <p style="margin: 0; color: #1e3a8a; line-height: 1.5; font-size: 0.9rem;">${question}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Answer Section -->
                            <div style="
                                background: #fffbeb;
                                border: 1px solid #fde68a;
                                border-radius: 10px;
                                padding: 1rem;
                                margin-bottom: 1.2rem;
                            ">
                                <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
                                    <i class="fas fa-lightbulb" style="color: #d97706; font-size: 1.1rem; margin-top: 0.2rem;"></i>
                                    <div style="flex: 1;">
                                        <h4 style="margin: 0 0 0.5rem 0; color: #92400e; font-size: 0.85rem; font-weight: 600;">Answer:</h4>
                                        <div id="answer-text" style="color: #78350f; line-height: 1.7; white-space: pre-wrap; font-size: 0.9rem;">${answer}</div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Disclaimer -->
                            <div style="
                                background: #fef2f2;
                                border: 1px solid #fecaca;
                                border-radius: 8px;
                                padding: 0.7rem;
                                font-size: 0.8rem;
                                color: #991b1b;
                                display: flex;
                                align-items: flex-start;
                                gap: 0.5rem;
                            ">
                                <i class="fas fa-exclamation-triangle" style="margin-top: 0.1rem; font-size: 0.9rem;"></i>
                                <div>
                                    <strong>Disclaimer:</strong> This is an AI-generated response for guidance purposes only. Please verify important information from official sources.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <style>
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes slideUp {
                        from { transform: translateY(50px); opacity: 0; }
                        to { transform: translateY(0); opacity: 1; }
                    }
                    
                    @media (max-width: 640px) {
                        #answer-modal > div {
                            margin: 0.5rem;
                            border-radius: 12px !important;
                        }
                        #answer-modal > div > div:first-child {
                            padding: 1rem !important;
                            border-radius: 12px 12px 0 0 !important;
                        }
                        #answer-modal > div > div:first-child h3 {
                            font-size: 0.95rem !important;
                        }
                        #answer-modal > div > div:first-child button {
                            width: 32px !important;
                            height: 32px !important;
                        }
                        #answer-modal > div > div:nth-child(2) {
                            padding: 1rem !important;
                        }
                        #answer-modal .fab.fa-whatsapp {
                            font-size: 1rem !important;
                        }
                    }
                </style>
            `;
            
            // Add modal to body
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            
            // Store question and answer for actions
            window.currentQuestion = question;
            window.currentAnswer = answer;
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        },
        
        // Close Modal
        closeAnswerModal: function() {
            const modal = document.getElementById('answer-modal');
            if (modal) {
                modal.remove();
                document.body.style.overflow = '';
                
                // Stop speech if playing
                if (window.currentSpeech) {
                    window.speechSynthesis.cancel();
                    window.currentSpeech = null;
                }
            }
        },
        
        // Listen to Answer (Text-to-Speech)
        listenAnswer: function() {
            const listenIcon = document.getElementById('listen-icon');
            
            if (window.currentSpeech && window.speechSynthesis.speaking) {
                // Stop speaking
                window.speechSynthesis.cancel();
                window.currentSpeech = null;
                if (listenIcon) {
                    listenIcon.className = 'fas fa-volume-up';
                }
            } else {
                // Start speaking
                const utterance = new SpeechSynthesisUtterance(window.currentAnswer);
                utterance.lang = 'en-US';
                utterance.rate = 0.9;
                utterance.pitch = 1;
                
                utterance.onend = function() {
                    if (listenIcon) {
                        listenIcon.className = 'fas fa-volume-up';
                    }
                    window.currentSpeech = null;
                };
                
                window.speechSynthesis.speak(utterance);
                window.currentSpeech = utterance;
                if (listenIcon) {
                    listenIcon.className = 'fas fa-stop';
                }
            }
        },
        
        // Share on WhatsApp
        shareWhatsApp: function() {
            const text = `*Question:* ${window.currentQuestion}\n\n*Answer:*\n${window.currentAnswer}\n\n_From Kurukshetra Mitra - Gita Wisdom_`;
            const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
            window.open(url, '_blank');
        },
        
        // Print Answer
        printAnswer: function() {
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html>
                <head>
                    <title>Gita Wisdom - Answer</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 2rem; max-width: 800px; margin: 0 auto; }
                        h1 { color: #d97706; border-bottom: 3px solid #d97706; padding-bottom: 0.5rem; }
                        .question { background: #f0f9ff; padding: 1rem; border-radius: 8px; margin: 1rem 0; }
                        .answer { background: #fffbeb; padding: 1rem; border-radius: 8px; margin: 1rem 0; line-height: 1.8; white-space: pre-wrap; }
                        .footer { margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #ccc; font-size: 0.9rem; color: #666; }
                    </style>
                </head>
                <body>
                    <h1>🕉️ Gita Wisdom & Spirituality</h1>
                    <div class="question">
                        <h3>Question:</h3>
                        <p>${window.currentQuestion}</p>
                    </div>
                    <div class="answer">
                        <h3>Answer:</h3>
                        <div>${window.currentAnswer}</div>
                    </div>
                    <div class="footer">
                        <p><em>Generated by Kurukshetra Mitra - Your Complete Guide</em></p>
                        <p><em>Date: ${new Date().toLocaleDateString()}</em></p>
                    </div>
                </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        },
        
        
        // STAY & TRAVEL - Toggle between Browse and Search modes
        toggleStayMode: function(mode) {
            const browseSection = document.getElementById('stay-browse-section');
            const searchSection = document.getElementById('stay-search-section');
            const browseLabel = document.getElementById('stay-browse-label');
            const searchLabel = document.getElementById('stay-search-label');
            
            if (mode === 'browse') {
                browseSection.style.display = 'block';
                searchSection.style.display = 'none';
                
                browseLabel.style.background = '#fffbf0';
                browseLabel.style.borderColor = '#e6d5c3';
                browseLabel.querySelector('span').style.color = '#d97706';
                
                searchLabel.style.background = 'white';
                searchLabel.style.borderColor = '#dee2e6';
                searchLabel.querySelector('span').style.color = '#495057';
            } else {
                browseSection.style.display = 'none';
                searchSection.style.display = 'block';
                
                browseLabel.style.background = 'white';
                browseLabel.style.borderColor = '#dee2e6';
                browseLabel.querySelector('span').style.color = '#495057';
                
                searchLabel.style.background = '#f8f9fa';
                searchLabel.style.borderColor = '#dee2e6';
                searchLabel.querySelector('span').style.color = '#d97706';
            }
        },
        
        // STAY & TRAVEL - Browse Mode: Load questions by category
        loadStayQuestions: function() {
            const category = document.getElementById('stay-category').value;
            if (!category) {
                document.getElementById('stay-questions').style.display = 'none';
                document.getElementById('stay-submit-btn').style.display = 'none';
                return;
            }
            
            const questions = QuestionsData.getQuestionsBySubmenu('stay_travel')
                .filter(q => q.category === category);
            
            const select = document.getElementById('stay-question-select');
            select.innerHTML = '<option value="">-- Choose Question --</option>' +
                questions.map(q => `<option value="${q.id}">${q.question}</option>`).join('');
            
            document.getElementById('stay-questions').style.display = 'block';
            document.getElementById('stay-submit-btn').style.display = 'inline-block';
        },
        
        // STAY & TRAVEL - Search Mode: Select from autocomplete
        selectStayFromSearch: function(questionId, questionText) {
            document.getElementById('stay-search-input').value = questionText;
            document.getElementById('selected-stay-question-id').value = questionId;
            document.getElementById('stay-suggestions').style.display = 'none';
        },
        
        // STAY & TRAVEL - Search Mode: Submit searched question
        submitSearchedStayQuery: async function() {
            const questionId = document.getElementById('selected-stay-question-id').value;
            if (!questionId) {
                alert('Please search and select a question first');
                return;
            }
            
            const q = QuestionsData.getAllQuestions().find(q => q.id === questionId);
            if (!q) {
                alert('Question not found');
                return;
            }
            
            this.showStayLoadingModal(q.question);
            
            try {
                let data;
                if (typeof APIModule !== 'undefined' && typeof APIModule.queryN8N === 'function') {
                    data = await APIModule.queryN8N(q.question, 'PRACTICAL_INFO_QUERY');
                } else {
                    const response = await fetch(AppState.n8nWebhook, {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({question: q.question, queryType: 'PRACTICAL_INFO_QUERY'})
                    });
                    
                    if (!response.ok) {
                        throw new Error(`Server error: ${response.status}`);
                    }
                    
                    data = await response.json();
                }
                
                this.showStayAnswerModal(q.question, data.answer || data.response || 'No response received');
                
            } catch (error) {
                console.error('Error:', error);
                this.closeStayModal();
                alert('❌ Error: Unable to fetch information. Please check your connection.');
            }
        },
        
        // STAY & TRAVEL - Browse Mode: Submit query
        submitStayQuery: async function() {
            const select = document.getElementById('stay-question-select');
            if (!select || !select.value) { 
                alert('Please select a question'); 
                return; 
            }
            
            const q = QuestionsData.getAllQuestions().find(q => q.id === select.value);
            const question = q ? q.question : '';
            
            if (!question) {
                alert('Question not found');
                return;
            }
            
            this.showStayLoadingModal(question);
            
            try {
                let data;
                if (typeof APIModule !== 'undefined' && typeof APIModule.queryN8N === 'function') {
                    data = await APIModule.queryN8N(question, 'PRACTICAL_INFO_QUERY');
                } else {
                    const response = await fetch(AppState.n8nWebhook, {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({question, queryType: 'PRACTICAL_INFO_QUERY'})
                    });
                    
                    if (!response.ok) {
                        throw new Error(`Server error: ${response.status}`);
                    }
                    
                    data = await response.json();
                }
                
                this.showStayAnswerModal(question, data.answer || data.response || 'No response received');
                
            } catch (error) {
                console.error('Error:', error);
                this.closeStayModal();
                alert('❌ Error: Unable to fetch information. Please check your connection.');
            }
        },
        
        // Show Stay Loading Modal
        showStayLoadingModal: function(question) {
            const modalHTML = `
                <div id="stay-modal" style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.7);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem;
                    animation: fadeIn 0.3s ease-in-out;
                ">
                    <div style="
                        background: white;
                        border-radius: 16px;
                        max-width: 600px;
                        width: 100%;
                        padding: 3rem;
                        text-align: center;
                        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                        animation: slideUp 0.3s ease-out;
                    ">
                        <div class="spinner" style="margin: 0 auto 1.5rem;"></div>
                        <h3 style="color: #d97706; margin: 0 0 0.5rem 0; font-size: 1.1rem;">
                            🔍 Searching Information...
                        </h3>
                        <p style="color: #666; font-size: 0.9rem; margin: 0;">
                            Please wait while we find the information
                        </p>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            document.body.style.overflow = 'hidden';
        },
        
        // Show Stay Answer Modal
        showStayAnswerModal: function(question, answer) {
            // Remove existing modal
            const existing = document.getElementById('stay-modal');
            if (existing) existing.remove();
            
            const modalHTML = `
                <div id="stay-modal" style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.7);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem;
                    animation: fadeIn 0.3s ease-in-out;
                ">
                    <div style="
                        background: white;
                        border-radius: 16px;
                        max-width: 650px;
                        width: 100%;
                        max-height: 90vh;
                        overflow-y: auto;
                        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                        animation: slideUp 0.3s ease-out;
                    ">
                        <!-- Modal Header -->
                        <div style="
                            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                            padding: 1.2rem 1.5rem;
                            border-radius: 16px 16px 0 0;
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                        ">
                            <h3 style="
                                color: white;
                                margin: 0;
                                font-size: 1.1rem;
                                display: flex;
                                align-items: center;
                                gap: 0.5rem;
                            ">
                                <i class="fas fa-info-circle"></i>
                                Information
                            </h3>
                            
                            <!-- Icon Buttons in Header -->
                            <div style="display:flex;align-items:center;gap:0.5rem;">
                                <button onclick="window.AppFunctions.shareStayWhatsApp()" title="Share on WhatsApp" style="
                                    background: rgba(255,255,255,0.2);
                                    border: none;
                                    color: white;
                                    width: 36px;
                                    height: 36px;
                                    border-radius: 50%;
                                    cursor: pointer;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    transition: all 0.2s;
                                " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                                    <i class="fab fa-whatsapp" style="font-size:1.2rem;"></i>
                                </button>
                                
                                <button onclick="window.AppFunctions.printStayInfo()" title="Print" style="
                                    background: rgba(255,255,255,0.2);
                                    border: none;
                                    color: white;
                                    width: 36px;
                                    height: 36px;
                                    border-radius: 50%;
                                    cursor: pointer;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    transition: all 0.2s;
                                " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                                    <i class="fas fa-print"></i>
                                </button>
                                
                                <button onclick="window.AppFunctions.closeStayModal()" title="Close" style="
                                    background: rgba(255,255,255,0.2);
                                    border: none;
                                    color: white;
                                    width: 36px;
                                    height: 36px;
                                    border-radius: 50%;
                                    cursor: pointer;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    transition: all 0.2s;
                                " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Modal Body -->
                        <div style="padding: 1.5rem;">
                            <!-- Question Section -->
                            <div style="
                                background: #f0f9ff;
                                border: 1px solid #bfdbfe;
                                border-radius: 10px;
                                padding: 1rem;
                                margin-bottom: 1.2rem;
                            ">
                                <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
                                    <i class="fas fa-question-circle" style="color: #3b82f6; font-size: 1.1rem; margin-top: 0.2rem;"></i>
                                    <div style="flex:1;">
                                        <h4 style="margin: 0 0 0.4rem 0; color: #1e40af; font-size: 0.85rem; font-weight: 600;">Question:</h4>
                                        <p style="margin: 0; color: #1e3a8a; line-height: 1.5; font-size: 0.9rem;">${question}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Answer Section -->
                            <div style="
                                background: #fffbeb;
                                border: 1px solid #fde68a;
                                border-radius: 10px;
                                padding: 1rem;
                                margin-bottom: 1.2rem;
                            ">
                                <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
                                    <i class="fas fa-lightbulb" style="color: #d97706; font-size: 1.1rem; margin-top: 0.2rem;"></i>
                                    <div style="flex: 1;">
                                        <h4 style="margin: 0 0 0.5rem 0; color: #92400e; font-size: 0.85rem; font-weight: 600;">Information:</h4>
                                        <div style="color: #78350f; line-height: 1.7; white-space: pre-wrap; font-size: 0.9rem;">${answer}</div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Disclaimer -->
                            <div style="
                                background: #fef2f2;
                                border: 1px solid #fecaca;
                                border-radius: 8px;
                                padding: 0.7rem;
                                font-size: 0.8rem;
                                color: #991b1b;
                                display: flex;
                                align-items: flex-start;
                                gap: 0.5rem;
                            ">
                                <i class="fas fa-exclamation-triangle" style="margin-top: 0.1rem; font-size: 0.9rem;"></i>
                                <div>
                                    <strong>Disclaimer:</strong> This is an AI-generated response. Please verify important information before making decisions.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <style>
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes slideUp {
                        from { transform: translateY(50px); opacity: 0; }
                        to { transform: translateY(0); opacity: 1; }
                    }
                    
                    @media (max-width: 640px) {
                        #stay-modal > div {
                            margin: 0.5rem;
                            border-radius: 12px !important;
                        }
                        #stay-modal > div > div:first-child {
                            padding: 1rem !important;
                            border-radius: 12px 12px 0 0 !important;
                        }
                        #stay-modal > div > div:first-child h3 {
                            font-size: 0.95rem !important;
                        }
                        #stay-modal > div > div:first-child button {
                            width: 32px !important;
                            height: 32px !important;
                        }
                        #stay-modal > div > div:nth-child(2) {
                            padding: 1rem !important;
                        }
                    }
                </style>
            `;
            
            // Add modal to body
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            
            // Store for actions
            window.currentStayQuestion = question;
            window.currentStayAnswer = answer;
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        },
        
        // Close Stay Modal
        closeStayModal: function() {
            const modal = document.getElementById('stay-modal');
            if (modal) {
                modal.remove();
                document.body.style.overflow = '';
            }
        },
        
        // Share Stay on WhatsApp
        shareStayWhatsApp: function() {
            const question = window.currentStayQuestion;
            const answer = window.currentStayAnswer;
            const text = `*Question:* ${question}\n\n*Information:*\n${answer}\n\n_From Kurukshetra Mitra - Stay & Travel Guide_`;
            const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
            window.open(url, '_blank');
        },
        
        // Print Stay Info
        printStayInfo: function() {
            const question = window.currentStayQuestion;
            const answer = window.currentStayAnswer;
            
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html>
                <head>
                    <title>Stay, Food & Travel - Information</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 2rem; max-width: 800px; margin: 0 auto; }
                        h1 { color: #d97706; border-bottom: 3px solid #d97706; padding-bottom: 0.5rem; }
                        .question { background: #f0f9ff; padding: 1rem; border-radius: 8px; margin: 1rem 0; }
                        .answer { background: #fffbeb; padding: 1rem; border-radius: 8px; margin: 1rem 0; line-height: 1.8; white-space: pre-wrap; }
                        .footer { margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #ccc; font-size: 0.9rem; color: #666; }
                    </style>
                </head>
                <body>
                    <h1>🏨 Stay, Food & Travel Information</h1>
                    <div class="question">
                        <h3>Question:</h3>
                        <p>${question}</p>
                    </div>
                    <div class="answer">
                        <h3>Information:</h3>
                        <div>${answer}</div>
                    </div>
                    <div class="footer">
                        <p><em>Generated by Kurukshetra Mitra - Your Complete Guide</em></p>
                        <p><em>Date: ${new Date().toLocaleDateString()}</em></p>
                    </div>
                </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        },
        
        // Add other functions following same pattern...
        // (Festival, Research, Government, Education, Infrastructure, Admin Research)
        // All use the same pattern: check for APIModule, use it if available, else direct fetch
        
        loadFestivalQuestions: function() {
            const category = document.getElementById('festival-category').value;
            if (!category) {
                document.getElementById('festival-questions').style.display = 'none';
                return;
            }
            
            const questions = QuestionsData.getQuestionsBySubmenu('festivals_events')
                .filter(q => q.category === category);
            
            const select = document.getElementById('festival-question-select');
            select.innerHTML = '<option value="">-- Choose --</option>' +
                questions.map(q => `<option value="${q.id}">${q.question}</option>`).join('');
            
            document.getElementById('festival-questions').style.display = 'block';
        },
        
        submitFestivalQuery: async function() {
            const select = document.getElementById('festival-question-select');
            if (!select||!select.value) { alert('Please select'); return; }
            
            const q = QuestionsData.getAllQuestions().find(q => q.id === select.value);
            const question = q ? q.question : '';
            
            const resultArea = document.getElementById('festival-result');
            resultArea.innerHTML = '<div class="loading"><div class="spinner"></div><p>Fetching...</p></div>';
            resultArea.classList.add('show');
            
            try {
                let data;
                if (typeof APIModule !== 'undefined' && typeof APIModule.queryN8N === 'function') {
                    data = await APIModule.queryN8N(question, 'PRACTICAL_INFO_QUERY');
                } else {
                    const response = await fetch(AppState.n8nWebhook, {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({question, queryType: 'PRACTICAL_INFO_QUERY'})
                    });
                    data = await response.json();
                }
                
                resultArea.innerHTML = `<div style="line-height:1.8;">${data.answer||data.response||'Info'}</div>`;
            } catch (error) {
                resultArea.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
            }
        },
        
        
        // HERITAGE RESEARCH - Toggle modes
        toggleHeritageMode: function(mode) {
            const exploreSection = document.getElementById('heritage-explore-section');
            const customSection = document.getElementById('heritage-custom-section');
            const exploreLabel = document.getElementById('heritage-explore-label');
            const customLabel = document.getElementById('heritage-custom-label');
            
            if (mode === 'explore') {
                exploreSection.style.display = 'block';
                customSection.style.display = 'none';
                
                exploreLabel.style.background = '#fffbf0';
                exploreLabel.style.borderColor = '#e6d5c3';
                exploreLabel.querySelector('span').style.color = '#d97706';
                
                customLabel.style.background = 'white';
                customLabel.style.borderColor = '#dee2e6';
                customLabel.querySelector('span').style.color = '#495057';
            } else {
                exploreSection.style.display = 'none';
                customSection.style.display = 'block';
                
                exploreLabel.style.background = 'white';
                exploreLabel.style.borderColor = '#dee2e6';
                exploreLabel.querySelector('span').style.color = '#495057';
                
                customLabel.style.background = '#f8f9fa';
                customLabel.style.borderColor = '#dee2e6';
                customLabel.querySelector('span').style.color = '#d97706';
            }
        },
        
        // HERITAGE RESEARCH - Load questions by category
        loadHeritageQuestions: function() {
            const category = document.getElementById('heritage-category').value;
            const questionsDropdown = document.getElementById('heritage-questions-dropdown');
            const submitBtn = document.getElementById('heritage-ready-submit-btn');
            
            if (!category) {
                questionsDropdown.style.display = 'none';
                submitBtn.style.display = 'none';
                return;
            }
            
            const questions = window.heritageReadyQuestions[category];
            const select = document.getElementById('heritage-question-select');
            
            select.innerHTML = '<option value="">-- Choose Question --</option>' +
                questions.map(q => `<option value="${q}">${q}</option>`).join('');
            
            questionsDropdown.style.display = 'block';
            submitBtn.style.display = 'inline-block';
        },
        
        // HERITAGE RESEARCH - Submit ready-made question
        submitHeritageReady: async function() {
            const select = document.getElementById('heritage-question-select');
            const question = select.value;
            
            if (!question) {
                alert('Please select a question');
                return;
            }
            
            this.showHeritageLoadingModal();
            
            try {
                console.log('=== Heritage Research Debug Start ===');
                console.log('Question:', question);
                console.log('Webhook URL:', AppState.n8nHeritageResearch);
                
                // Prepare request body in the format n8n expects
                const requestBody = {
                    query: question,
                    language: "English",
                    category: "Heritage_Research"
                };
                
                console.log('Request body:', requestBody);
                
                // Heritage Research uses separate webhook
                const response = await fetch(AppState.n8nHeritageResearch, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(requestBody)
                });
                
                console.log('Response status:', response.status);
                console.log('Response ok:', response.ok);
                
                if (!response.ok) {
                    throw new Error(`Server error: ${response.status}`);
                }
                
                // Check if response has content
                const text = await response.text();
                console.log('Response text length:', text.length);
                console.log('Response preview:', text.substring(0, 200));
                
                if (!text || text.trim() === '') {
                    console.error('EMPTY RESPONSE!');
                    throw new Error('Empty response from server');
                }
                
                // Try to parse JSON
                let data;
                try {
                    data = JSON.parse(text);
                    console.log('Parsed data - Is array?:', Array.isArray(data));
                    
                    // Handle array response (n8n returns array)
                    if (Array.isArray(data) && data.length > 0) {
                        console.log('Extracting first element from array');
                        data = data[0]; // Extract first item from array
                    }
                    
                    console.log('Data has choices?:', !!data.choices);
                } catch (e) {
                    console.error('JSON PARSE ERROR:', e);
                    console.error('Invalid JSON:', text.substring(0, 200));
                    throw new Error('Invalid response format from server');
                }
                
                // Extract response from n8n structure
                let answer;
                
                // Check for new formattedAnswer (HTML format from n8n)
                if (data.formattedAnswer) {
                    console.log('✅ Using formattedAnswer HTML format');
                    answer = data.formattedAnswer;
                }
                // Check for AI explanation with markdown code blocks
                else if (data.aiExplanation) {
                    console.log('✅ Using AI explanation format');
                    
                    let explanation = data.aiExplanation;
                    
                    // Remove markdown code blocks if present
                    explanation = explanation.replace(/```json\n?/g, '').replace(/```\n?/g, '');
                    
                    try {
                        // Try to parse the JSON inside
                        const parsed = JSON.parse(explanation);
                        
                        // Build formatted answer
                        answer = '';
                        
                        if (parsed.research_question) {
                            answer += `<b>Research Question:</b> ${parsed.research_question}<br><br>`;
                        }
                        
                        if (parsed.response) {
                            answer += `<b>Findings:</b><br>${parsed.response}<br><br>`;
                        }
                        
                        if (parsed.evidence) {
                            answer += `<b>Evidence Found:</b><br>${parsed.evidence}<br><br>`;
                        }
                        
                        if (parsed.time_period) {
                            answer += `<b>Time Period:</b> ${parsed.time_period}<br>`;
                        }
                        
                        if (parsed.location) {
                            answer += `<b>Location:</b> ${parsed.location}<br>`;
                        }
                        
                        if (parsed.note) {
                            answer += `<br><b>Note:</b> ${parsed.note}<br>`;
                        }
                        
                        if (data.disclaimer) {
                            answer += `<br>---<br><b>Disclaimer:</b> ${data.disclaimer}`;
                        }
                    } catch (e) {
                        // If can't parse, just show the raw explanation
                        console.warn('Could not parse aiExplanation as JSON:', e);
                        answer = explanation;
                        if (data.disclaimer) {
                            answer += `<br><br>---<br><b>Disclaimer:</b> ${data.disclaimer}`;
                        }
                    }
                }
                // Check for old structured format with primaryFinding
                else if (data.primaryFinding) {
                    console.log('✅ Using structured Heritage Research format (DB validated)');
                    
                    // Build formatted answer from structured data
                    const finding = data.primaryFinding;
                    
                    answer = `<b>Topic:</b> ${finding.topic}<br><br>`;
                    answer += `<b>Evidence Status:</b><br>`;
                    answer += `• Archaeological Evidence: ${finding.evidenceStatus}<br>`;
                    answer += `• Evidence Type: ${finding.evidenceType}<br>`;
                    answer += `• Literary Reference: ${finding.literaryReference}<br>`;
                    answer += `• Source Authority: ${finding.sourceAuthority}<br>`;
                    
                    if (finding.evidenceNotes) {
                        answer += `<br><b>Notes:</b><br>${finding.evidenceNotes}<br>`;
                    }
                    
                    if (finding.periodAssociated) {
                        answer += `<br><b>Period:</b> ${finding.periodAssociated}<br>`;
                    }
                    
                    // Add supporting context if available
                    if (data.supportingContext && data.supportingContext.length > 0) {
                        answer += `<br><b>Additional Context:</b><br>`;
                        data.supportingContext.forEach(ctx => {
                            answer += `• ${ctx.topic}: ${ctx.notes}<br>`;
                        });
                    }
                    
                    if (data.disclaimer) {
                        answer += `<br>---<br><b>Disclaimer:</b> ${data.disclaimer}`;
                    }
                }
                // Check for NO_RESPONSE safety fallback
                else if (data.responseType === 'NO_RESPONSE' || data.status === 'NO_DATA') {
                    console.log('⚠️ No response available');
                    answer = data.message || 'No research data could be generated for this query. Please try rephrasing your question or contact support.';
                }
                // Fallback to old formats
                else if (data.choices && data.choices[0] && data.choices[0].message) {
                    console.log('✅ Using Groq AI format');
                    answer = data.choices[0].message.content;
                } else if (data.response) {
                    console.log('✅ Using response format');
                    answer = data.response;
                } else if (data.answer) {
                    console.log('✅ Using answer format');
                    answer = data.answer;
                } else if (data.directAnswer) {
                    console.log('✅ Using directAnswer format');
                    answer = data.directAnswer;
                } else {
                    console.error('❌ NO RECOGNIZED FORMAT!');
                    console.error('Data keys:', Object.keys(data));
                    console.error('Response type:', data.responseType);
                    answer = 'No response received from the heritage research system.';
                }
                
                console.log('Final answer length:', answer ? answer.length : 0);
                console.log('=== Heritage Research Debug End ===');
                
                this.showHeritageAnswerModal(question, answer);
                
            } catch (error) {
                console.error('Error:', error);
                this.closeHeritageModal();
                
                let errorMessage = 'Unable to fetch research data. ';
                if (error.message.includes('Empty response')) {
                    errorMessage += 'The server returned an empty response. Please check your n8n workflow.';
                } else if (error.message.includes('Invalid response format')) {
                    errorMessage += 'The server returned invalid data. Please check your n8n workflow output.';
                } else if (error.message.includes('Failed to fetch')) {
                    errorMessage += 'Please check your internet connection.';
                } else {
                    errorMessage += error.message;
                }
                
                alert('❌ Error: ' + errorMessage);
            }
        },
        
        // HERITAGE RESEARCH - Submit custom question
        submitHeritageResearch: async function() {
            const input = document.getElementById('heritage-research-input');
            const question = input.value.trim();
            
            if (!question) {
                alert('Please enter a research question');
                return;
            }
            
            this.showHeritageLoadingModal();
            
            try {
                console.log('=== Heritage Research Custom Debug Start ===');
                console.log('Question:', question);
                
                // Prepare request body in the format n8n expects
                const requestBody = {
                    query: question,
                    language: "English",
                    category: "Heritage_Research"
                };
                
                console.log('Request body:', requestBody);
                
                // Heritage Research uses separate webhook
                const response = await fetch(AppState.n8nHeritageResearch, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(requestBody)
                });
                
                console.log('Response status:', response.status);
                
                if (!response.ok) {
                    throw new Error(`Server error: ${response.status}`);
                }
                
                // Check if response has content
                const text = await response.text();
                console.log('Response text length:', text.length);
                
                if (!text || text.trim() === '') {
                    throw new Error('Empty response from server');
                }
                
                // Try to parse JSON
                let data;
                try {
                    data = JSON.parse(text);
                    
                    // Handle array response (n8n returns array)
                    if (Array.isArray(data) && data.length > 0) {
                        data = data[0];
                    }
                } catch (e) {
                    console.error('Invalid JSON response:', text.substring(0, 200));
                    throw new Error('Invalid response format from server');
                }
                
                // Extract response from n8n structure
                let answer;
                
                // Check for new formattedAnswer (HTML format from n8n)
                if (data.formattedAnswer) {
                    console.log('✅ Using formattedAnswer HTML format');
                    answer = data.formattedAnswer;
                }
                // Check for AI explanation with markdown code blocks
                else if (data.aiExplanation) {
                    console.log('✅ Using AI explanation format');
                    
                    let explanation = data.aiExplanation;
                    
                    // Remove markdown code blocks if present
                    explanation = explanation.replace(/```json\n?/g, '').replace(/```\n?/g, '');
                    
                    try {
                        // Try to parse the JSON inside
                        const parsed = JSON.parse(explanation);
                        
                        // Build formatted answer with HTML
                        answer = '';
                        
                        if (parsed.research_question) {
                            answer += `<b>Research Question:</b> ${parsed.research_question}<br><br>`;
                        }
                        
                        if (parsed.response) {
                            answer += `<b>Findings:</b><br>${parsed.response}<br><br>`;
                        }
                        
                        if (parsed.evidence) {
                            answer += `<b>Evidence Found:</b><br>${parsed.evidence}<br><br>`;
                        }
                        
                        if (parsed.time_period) {
                            answer += `<b>Time Period:</b> ${parsed.time_period}<br>`;
                        }
                        
                        if (parsed.location) {
                            answer += `<b>Location:</b> ${parsed.location}<br>`;
                        }
                        
                        if (parsed.note) {
                            answer += `<br><b>Note:</b> ${parsed.note}<br>`;
                        }
                        
                        if (data.disclaimer) {
                            answer += `<br>---<br><b>Disclaimer:</b> ${data.disclaimer}`;
                        }
                    } catch (e) {
                        // If can't parse, just show the raw explanation
                        console.warn('Could not parse aiExplanation as JSON:', e);
                        answer = explanation;
                        if (data.disclaimer) {
                            answer += `<br><br>---<br><b>Disclaimer:</b> ${data.disclaimer}`;
                        }
                    }
                }
                // Check for old structured format with primaryFinding
                else if (data.primaryFinding) {
                    console.log('✅ Using structured Heritage Research format (DB validated)');
                    
                    const finding = data.primaryFinding;
                    
                    answer = `<b>Topic:</b> ${finding.topic}<br><br>`;
                    answer += `<b>Evidence Status:</b><br>`;
                    answer += `• Archaeological Evidence: ${finding.evidenceStatus}<br>`;
                    answer += `• Evidence Type: ${finding.evidenceType}<br>`;
                    answer += `• Literary Reference: ${finding.literaryReference}<br>`;
                    answer += `• Source Authority: ${finding.sourceAuthority}<br>`;
                    
                    if (finding.evidenceNotes) {
                        answer += `<br><b>Notes:</b><br>${finding.evidenceNotes}<br>`;
                    }
                    
                    if (finding.periodAssociated) {
                        answer += `<br><b>Period:</b> ${finding.periodAssociated}<br>`;
                    }
                    
                    if (data.supportingContext && data.supportingContext.length > 0) {
                        answer += `<br><b>Additional Context:</b><br>`;
                        data.supportingContext.forEach(ctx => {
                            answer += `• ${ctx.topic}: ${ctx.notes}<br>`;
                        });
                    }
                    
                    if (data.disclaimer) {
                        answer += `<br>---<br><b>Disclaimer:</b> ${data.disclaimer}`;
                    }
                }
                // Check for NO_RESPONSE safety fallback
                else if (data.responseType === 'NO_RESPONSE' || data.status === 'NO_DATA') {
                    console.log('⚠️ No response available');
                    answer = data.message || 'No research data could be generated for this query. Please try rephrasing your question or contact support.';
                }
                // Fallback to old formats
                else if (data.choices && data.choices[0] && data.choices[0].message) {
                    answer = data.choices[0].message.content;
                } else if (data.response) {
                    answer = data.response;
                } else if (data.answer) {
                    answer = data.answer;
                } else if (data.directAnswer) {
                    answer = data.directAnswer;
                } else {
                    console.error('❌ NO RECOGNIZED FORMAT!');
                    answer = 'No response received from the heritage research system.';
                }
                
                this.showHeritageAnswerModal(question, answer);
                
            } catch (error) {
                console.error('Error:', error);
                this.closeHeritageModal();
                
                let errorMessage = 'Unable to fetch research data. ';
                if (error.message.includes('Empty response')) {
                    errorMessage += 'The server returned an empty response. Please check your n8n workflow.';
                } else if (error.message.includes('Invalid response format')) {
                    errorMessage += 'The server returned invalid data. Please check your n8n workflow output.';
                } else if (error.message.includes('Failed to fetch')) {
                    errorMessage += 'Please check your internet connection.';
                } else {
                    errorMessage += error.message;
                }
                
                alert('❌ Error: ' + errorMessage);
            }
        },
        
        // Show Heritage Loading Modal
        showHeritageLoadingModal: function() {
            const modalHTML = `
                <div id="heritage-modal" style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.7);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem;
                    animation: fadeIn 0.3s ease-in-out;
                ">
                    <div style="
                        background: white;
                        border-radius: 16px;
                        max-width: 600px;
                        width: 100%;
                        padding: 3rem;
                        text-align: center;
                        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                        animation: slideUp 0.3s ease-out;
                    ">
                        <div class="spinner" style="margin: 0 auto 1.5rem;"></div>
                        <h3 style="color: #d97706; margin: 0 0 0.5rem 0; font-size: 1.1rem;">
                            📚 Researching Heritage Data...
                        </h3>
                        <p style="color: #666; font-size: 0.9rem; margin: 0;">
                            Please wait while we gather information
                        </p>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            document.body.style.overflow = 'hidden';
        },
        
        // Show Heritage Answer Modal
        showHeritageAnswerModal: function(question, answer) {
            // Remove existing modal
            const existing = document.getElementById('heritage-modal');
            if (existing) existing.remove();
            
            const modalHTML = `
                <div id="heritage-modal" style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.7);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem;
                    animation: fadeIn 0.3s ease-in-out;
                ">
                    <div style="
                        background: white;
                        border-radius: 16px;
                        max-width: 650px;
                        width: 100%;
                        max-height: 90vh;
                        overflow-y: auto;
                        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                        animation: slideUp 0.3s ease-out;
                    ">
                        <!-- Modal Header -->
                        <div style="
                            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                            padding: 1.2rem 1.5rem;
                            border-radius: 16px 16px 0 0;
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                        ">
                            <h3 style="
                                color: white;
                                margin: 0;
                                font-size: 1.1rem;
                                display: flex;
                                align-items: center;
                                gap: 0.5rem;
                            ">
                                <i class="fas fa-book"></i>
                                Research Results
                            </h3>
                            
                            <!-- Icon Buttons in Header -->
                            <div style="display:flex;align-items:center;gap:0.5rem;">
                                <button onclick="window.AppFunctions.shareHeritageWhatsApp()" title="Share on WhatsApp" style="
                                    background: rgba(255,255,255,0.2);
                                    border: none;
                                    color: white;
                                    width: 36px;
                                    height: 36px;
                                    border-radius: 50%;
                                    cursor: pointer;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    transition: all 0.2s;
                                " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                                    <i class="fab fa-whatsapp" style="font-size:1.2rem;"></i>
                                </button>
                                
                                <button onclick="window.AppFunctions.printHeritageInfo()" title="Print" style="
                                    background: rgba(255,255,255,0.2);
                                    border: none;
                                    color: white;
                                    width: 36px;
                                    height: 36px;
                                    border-radius: 50%;
                                    cursor: pointer;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    transition: all 0.2s;
                                " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                                    <i class="fas fa-print"></i>
                                </button>
                                
                                <button onclick="window.AppFunctions.closeHeritageModal()" title="Close" style="
                                    background: rgba(255,255,255,0.2);
                                    border: none;
                                    color: white;
                                    width: 36px;
                                    height: 36px;
                                    border-radius: 50%;
                                    cursor: pointer;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    transition: all 0.2s;
                                " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Modal Body -->
                        <div style="padding: 1.5rem;">
                            <!-- Question Section -->
                            <div style="
                                background: #f0f9ff;
                                border: 1px solid #bfdbfe;
                                border-radius: 10px;
                                padding: 1rem;
                                margin-bottom: 1.2rem;
                            ">
                                <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
                                    <i class="fas fa-question-circle" style="color: #3b82f6; font-size: 1.1rem; margin-top: 0.2rem;"></i>
                                    <div style="flex:1;">
                                        <h4 style="margin: 0 0 0.4rem 0; color: #1e40af; font-size: 0.85rem; font-weight: 600;">Research Question:</h4>
                                        <p style="margin: 0; color: #1e3a8a; line-height: 1.5; font-size: 0.9rem;">${question}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Answer Section -->
                            <div style="
                                background: #fffbeb;
                                border: 1px solid #fde68a;
                                border-radius: 10px;
                                padding: 1rem;
                                margin-bottom: 1.2rem;
                            ">
                                <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
                                    <i class="fas fa-scroll" style="color: #d97706; font-size: 1.1rem; margin-top: 0.2rem;"></i>
                                    <div style="flex: 1;">
                                        <h4 style="margin: 0 0 0.5rem 0; color: #92400e; font-size: 0.85rem; font-weight: 600;">Research Findings:</h4>
                                        <div id="heritage-answer-content" style="color: #78350f; line-height: 1.7; font-size: 0.9rem;"></div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Disclaimer -->
                            <div style="
                                background: #fef2f2;
                                border: 1px solid #fecaca;
                                border-radius: 8px;
                                padding: 0.7rem;
                                font-size: 0.8rem;
                                color: #991b1b;
                                display: flex;
                                align-items: flex-start;
                                gap: 0.5rem;
                            ">
                                <i class="fas fa-exclamation-triangle" style="margin-top: 0.1rem; font-size: 0.9rem;"></i>
                                <div>
                                    <strong>Disclaimer:</strong> This is AI-generated research. Please verify from academic sources for scholarly work.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <style>
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes slideUp {
                        from { transform: translateY(50px); opacity: 0; }
                        to { transform: translateY(0); opacity: 1; }
                    }
                    
                    @media (max-width: 640px) {
                        #heritage-modal > div {
                            margin: 0.5rem;
                            border-radius: 12px !important;
                        }
                        #heritage-modal > div > div:first-child {
                            padding: 1rem !important;
                            border-radius: 12px 12px 0 0 !important;
                        }
                        #heritage-modal > div > div:first-child h3 {
                            font-size: 0.95rem !important;
                        }
                        #heritage-modal > div > div:first-child button {
                            width: 32px !important;
                            height: 32px !important;
                        }
                        #heritage-modal > div > div:nth-child(2) {
                            padding: 1rem !important;
                        }
                    }
                </style>
            `;
            
            // Add modal to body
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            
            // Populate answer content (supports both HTML and plain text)
            const answerDiv = document.getElementById('heritage-answer-content');
            if (answerDiv) {
                // Convert \n to <br> for plain text formatting
                const formattedAnswer = answer.replace(/\n/g, '<br>');
                answerDiv.innerHTML = formattedAnswer;
            }
            
            // Store for actions
            window.currentHeritageQuestion = question;
            window.currentHeritageAnswer = answer;
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        },
        
        // Close Heritage Modal
        closeHeritageModal: function() {
            const modal = document.getElementById('heritage-modal');
            if (modal) {
                modal.remove();
                document.body.style.overflow = '';
            }
        },
        
        // Share Heritage on WhatsApp
        shareHeritageWhatsApp: function() {
            const question = window.currentHeritageQuestion;
            const answer = window.currentHeritageAnswer;
            const text = `*Research Question:* ${question}\n\n*Findings:*\n${answer}\n\n_From Kurukshetra Mitra - Heritage Research_`;
            const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
            window.open(url, '_blank');
        },
        
        // Print Heritage Info
        printHeritageInfo: function() {
            const question = window.currentHeritageQuestion;
            const answer = window.currentHeritageAnswer;
            
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html>
                <head>
                    <title>Heritage Research - Results</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 2rem; max-width: 800px; margin: 0 auto; }
                        h1 { color: #d97706; border-bottom: 3px solid #d97706; padding-bottom: 0.5rem; }
                        .question { background: #f0f9ff; padding: 1rem; border-radius: 8px; margin: 1rem 0; }
                        .answer { background: #fffbeb; padding: 1rem; border-radius: 8px; margin: 1rem 0; line-height: 1.8; white-space: pre-wrap; }
                        .footer { margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #ccc; font-size: 0.9rem; color: #666; }
                    </style>
                </head>
                <body>
                    <h1>📚 Heritage Research</h1>
                    <div class="question">
                        <h3>Research Question:</h3>
                        <p>${question}</p>
                    </div>
                    <div class="answer">
                        <h3>Research Findings:</h3>
                        <div>${answer}</div>
                    </div>
                    <div class="footer">
                        <p><em>Generated by Kurukshetra Mitra - Heritage Research</em></p>
                        <p><em>Date: ${new Date().toLocaleDateString()}</em></p>
                        <p><em>Note: Please verify from academic sources for scholarly work</em></p>
                    </div>
                </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        },
        
        // ==================== DEMOGRAPHICS & STATISTICS ====================
        
        // Toggle Demographics mode
        toggleDemoMode: function(mode) {
            const readySection = document.getElementById('demo-ready-section');
            const customSection = document.getElementById('demo-custom-section');
            
            if (mode === 'ready') {
                readySection.style.display = 'block';
                customSection.style.display = 'none';
            } else {
                readySection.style.display = 'none';
                customSection.style.display = 'block';
            }
        },
        
        // Load Demographics questions
        loadDemoQuestions: function() {
            const categorySelect = document.getElementById('demo-category-select');
            const questionGroup = document.getElementById('demo-question-group');
            const questionSelect = document.getElementById('demo-question-select');
            const submitBtn = document.getElementById('demo-submit-ready');
            
            const category = categorySelect.value;
            
            if (!category) {
                questionGroup.style.display = 'none';
                submitBtn.style.display = 'none';
                return;
            }
            
            const questions = window.demographicsQuestions[category] || [];
            
            questionSelect.innerHTML = '<option value="">-- Choose a Question --</option>' +
                questions.map(q => `<option value="${q}">${q}</option>`).join('');
            
            questionGroup.style.display = 'block';
            submitBtn.style.display = 'inline-flex';
        },
        
        // Submit Demographics ready question
        submitDemoReady: async function() {
            const questionSelect = document.getElementById('demo-question-select');
            const question = questionSelect.value;
            
            if (!question) {
                alert('Please select a question');
                return;
            }
            
            this.showDemoLoadingModal();
            
            try {
                const response = await fetch(AppState.n8nDemographics, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        question: question,
                        queryType: 'DEMOGRAPHICS'
                    })
                });
                
                if (!response.ok) {
                    throw new Error(`Server error: ${response.status}`);
                }
                
                const text = await response.text();
                if (!text || text.trim() === '') {
                    throw new Error('Empty response from server');
                }
                
                let data;
                try {
                    data = JSON.parse(text);
                    if (Array.isArray(data) && data.length > 0) {
                        data = data[0];
                    }
                } catch (e) {
                    throw new Error('Invalid response format from server');
                }
                
                // Extract answer
                const answer = data.answer || data.response || data.formattedAnswer || 'No data available';
                
                this.showDemoAnswerModal(question, answer);
                
            } catch (error) {
                console.error('Error:', error);
                this.closeDemoModal();
                alert('❌ Error: Unable to fetch statistics. Please try again.');
            }
        },
        
        // Submit Demographics custom question
        submitDemoCustom: async function() {
            const input = document.getElementById('demo-custom-input');
            const question = input.value.trim();
            
            if (!question) {
                alert('Please enter a question');
                return;
            }
            
            this.showDemoLoadingModal();
            
            try {
                const response = await fetch(AppState.n8nDemographics, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        question: question,
                        queryType: 'DEMOGRAPHICS'
                    })
                });
                
                if (!response.ok) {
                    throw new Error(`Server error: ${response.status}`);
                }
                
                const text = await response.text();
                if (!text || text.trim() === '') {
                    throw new Error('Empty response from server');
                }
                
                let data;
                try {
                    data = JSON.parse(text);
                    if (Array.isArray(data) && data.length > 0) {
                        data = data[0];
                    }
                } catch (e) {
                    throw new Error('Invalid response format from server');
                }
                
                const answer = data.answer || data.response || data.formattedAnswer || 'No data available';
                
                this.showDemoAnswerModal(question, answer);
                
            } catch (error) {
                console.error('Error:', error);
                this.closeDemoModal();
                alert('❌ Error: Unable to fetch statistics. Please try again.');
            }
        },
        
        // Show Demographics loading modal
        showDemoLoadingModal: function() {
            const existing = document.getElementById('demo-modal');
            if (existing) existing.remove();
            
            const modalHTML = `
                <div id="demo-modal" style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.7);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: fadeIn 0.3s ease-in-out;
                ">
                    <div style="
                        background: white;
                        border-radius: 16px;
                        padding: 2rem;
                        text-align: center;
                        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    ">
                        <div class="spinner" style="
                            width: 50px;
                            height: 50px;
                            border: 4px solid #f3f4f6;
                            border-top: 4px solid #3b82f6;
                            border-radius: 50%;
                            animation: spin 1s linear infinite;
                            margin: 0 auto 1rem auto;
                        "></div>
                        <p style="color: #1e40af; font-weight: 600; margin: 0;">
                            <i class="fas fa-chart-bar"></i> Fetching Statistics...
                        </p>
                        <p style="color: #6b7280; font-size: 0.9rem; margin: 0.5rem 0 0 0;">
                            Please wait while we gather the data
                        </p>
                    </div>
                </div>
                
                <style>
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                </style>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        },
        
        // Show Demographics answer modal
        showDemoAnswerModal: function(question, answer) {
            const existing = document.getElementById('demo-modal');
            if (existing) existing.remove();
            
            const modalHTML = `
                <div id="demo-modal" style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.7);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem;
                    animation: fadeIn 0.3s ease-in-out;
                ">
                    <div style="
                        background: white;
                        border-radius: 16px;
                        max-width: 650px;
                        width: 100%;
                        max-height: 90vh;
                        overflow-y: auto;
                        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                        animation: slideUp 0.3s ease-out;
                    ">
                        <!-- Header -->
                        <div style="
                            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                            padding: 1.2rem 1.5rem;
                            border-radius: 16px 16px 0 0;
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                        ">
                            <h3 style="
                                color: white;
                                margin: 0;
                                font-size: 1.1rem;
                                display: flex;
                                align-items: center;
                                gap: 0.5rem;
                            ">
                                <i class="fas fa-chart-bar"></i>
                                Statistics Results
                            </h3>
                            
                            <button onclick="window.AppFunctions.closeDemoModal()" title="Close" style="
                                background: rgba(255,255,255,0.2);
                                border: none;
                                color: white;
                                width: 36px;
                                height: 36px;
                                border-radius: 50%;
                                cursor: pointer;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                transition: all 0.2s;
                            " onmouseover="this.style.background='rgba(255,255,255,0.3)'" 
                               onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        
                        <!-- Body -->
                        <div style="padding: 1.5rem;">
                            <!-- Question -->
                            <div style="
                                background: #f0f9ff;
                                border: 1px solid #bfdbfe;
                                border-radius: 10px;
                                padding: 1rem;
                                margin-bottom: 1.2rem;
                            ">
                                <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
                                    <i class="fas fa-question-circle" style="color: #3b82f6; font-size: 1.1rem; margin-top: 0.2rem;"></i>
                                    <div style="flex:1;">
                                        <h4 style="margin: 0 0 0.4rem 0; color: #1e40af; font-size: 0.85rem; font-weight: 600;">Question:</h4>
                                        <p style="margin: 0; color: #1e3a8a; line-height: 1.5; font-size: 0.9rem;">${question}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Answer -->
                            <div style="
                                background: #fffbeb;
                                border: 1px solid #fde68a;
                                border-radius: 10px;
                                padding: 1rem;
                                margin-bottom: 1.2rem;
                            ">
                                <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
                                    <i class="fas fa-database" style="color: #d97706; font-size: 1.1rem; margin-top: 0.2rem;"></i>
                                    <div style="flex: 1;">
                                        <h4 style="margin: 0 0 0.5rem 0; color: #92400e; font-size: 0.85rem; font-weight: 600;">Data:</h4>
                                        <div id="demo-answer-content" style="color: #78350f; line-height: 1.7; font-size: 0.9rem;"></div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Disclaimer -->
                            <div style="
                                background: #fef2f2;
                                border: 1px solid #fecaca;
                                border-radius: 8px;
                                padding: 0.7rem;
                                font-size: 0.8rem;
                                color: #991b1b;
                                display: flex;
                                align-items: flex-start;
                                gap: 0.5rem;
                            ">
                                <i class="fas fa-exclamation-triangle" style="margin-top: 0.1rem; font-size: 0.9rem;"></i>
                                <div>
                                    <strong>Note:</strong> Data is based on official sources. For latest statistics, refer to census and government reports.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <style>
                    @keyframes slideUp {
                        from { transform: translateY(50px); opacity: 0; }
                        to { transform: translateY(0); opacity: 1; }
                    }
                </style>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            
            // Populate answer content
            const answerDiv = document.getElementById('demo-answer-content');
            if (answerDiv) {
                const formattedAnswer = answer.replace(/\n/g, '<br>');
                answerDiv.innerHTML = formattedAnswer;
            }
        },
        
        // Close Demographics modal
        closeDemoModal: function() {
            const modal = document.getElementById('demo-modal');
            if (modal) {
                modal.remove();
                document.body.style.overflow = '';
            }
        },
        
        submitResearchQuery: async function() {
            const input = document.getElementById('research-input');
            const question = input.value.trim();
            if (!question) { alert('Please enter question'); return; }
            
            const resultArea = document.getElementById('research-result');
            resultArea.innerHTML = '<div class="loading"><div class="spinner"></div><p>Researching...</p></div>';
            resultArea.classList.add('show');
            
            try {
                let data;
                if (typeof APIModule !== 'undefined' && typeof APIModule.queryN8N === 'function') {
                    data = await APIModule.queryN8N(question, 'RESEARCH_QUERY');
                } else {
                    const response = await fetch(AppState.n8nWebhook, {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({question, queryType: 'RESEARCH_QUERY'})
                    });
                    data = await response.json();
                }
                
                resultArea.innerHTML = `<div style="line-height:1.8;">${data.answer||data.response||'Research results'}</div>`;
            } catch (error) {
                resultArea.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
            }
        },
        
        loadGovQuestions: function() {
            const category = document.getElementById('gov-category').value;
            if (!category) {
                document.getElementById('gov-questions').style.display = 'none';
                return;
            }
            
            const questions = QuestionsData.getQuestionsBySubmenu('government')
                .filter(q => q.category === category);
            
            const select = document.getElementById('gov-question-select');
            select.innerHTML = '<option value="">-- Choose --</option>' +
                questions.map(q => `<option value="${q.id}">${q.question}</option>`).join('');
            
            document.getElementById('gov-questions').style.display = 'block';
        },
        
        submitGovQuery: async function() {
            const select = document.getElementById('gov-question-select');
            if (!select||!select.value) { alert('Please select'); return; }
            
            const q = QuestionsData.getAllQuestions().find(q => q.id === select.value);
            const question = q ? q.question : '';
            
            const resultArea = document.getElementById('gov-result');
            resultArea.innerHTML = '<div class="loading"><div class="spinner"></div><p>Fetching...</p></div>';
            resultArea.classList.add('show');
            
            try {
                let data;
                if (typeof APIModule !== 'undefined' && typeof APIModule.queryN8N === 'function') {
                    data = await APIModule.queryN8N(question, 'PRACTICAL_INFO_QUERY');
                } else {
                    const response = await fetch(AppState.n8nWebhook, {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({question, queryType: 'PRACTICAL_INFO_QUERY'})
                    });
                    data = await response.json();
                }
                
                resultArea.innerHTML = `<div style="line-height:1.8;">${data.answer||data.response||'Info'}</div>`;
            } catch (error) {
                resultArea.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
            }
        },
        
        showEducation: function() {
            const content = document.getElementById('edu-health-content');
            const questions = QuestionsData.getQuestionsBySubmenu('education_health')
                .filter(q => q.category === 'Education');
            
            content.innerHTML = `
                <h3>🏫 Education</h3>
                <div class="form-group">
                    <select id="edu-select">
                        <option value="">-- Choose --</option>
                        ${questions.map(q => `<option value="${q.id}">${q.question}</option>`).join('')}
                    </select>
                </div>
                <button class="submit-btn" onclick="window.AppFunctions.submitEduHealthQuery('edu')">Get Info</button>
                <div class="result-area" id="edu-result"></div>
            `;
        },
        
        showHealthcare: function() {
            const content = document.getElementById('edu-health-content');
            const questions = QuestionsData.getQuestionsBySubmenu('education_health')
                .filter(q => q.category === 'Healthcare');
            
            content.innerHTML = `
                <h3>🏥 Healthcare</h3>
                <div class="form-group">
                    <select id="health-select">
                        <option value="">-- Choose --</option>
                        ${questions.map(q => `<option value="${q.id}">${q.question}</option>`).join('')}
                    </select>
                </div>
                <button class="submit-btn" onclick="window.AppFunctions.submitEduHealthQuery('health')">Get Info</button>
                <div class="result-area" id="health-result"></div>
            `;
        },
        
        submitEduHealthQuery: async function(type) {
            const selectId = type==='edu'?'edu-select':'health-select';
            const resultId = type==='edu'?'edu-result':'health-result';
            
            const select = document.getElementById(selectId);
            if (!select||!select.value) { alert('Please select'); return; }
            
            const q = QuestionsData.getAllQuestions().find(q => q.id === select.value);
            const question = q ? q.question : '';
            
            const resultArea = document.getElementById(resultId);
            resultArea.innerHTML = '<div class="loading"><div class="spinner"></div><p>Fetching...</p></div>';
            resultArea.classList.add('show');
            
            try {
                let data;
                if (typeof APIModule !== 'undefined' && typeof APIModule.queryN8N === 'function') {
                    data = await APIModule.queryN8N(question, 'PRACTICAL_INFO_QUERY');
                } else {
                    const response = await fetch(AppState.n8nWebhook, {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({question, queryType: 'PRACTICAL_INFO_QUERY'})
                    });
                    data = await response.json();
                }
                
                resultArea.innerHTML = `<div style="line-height:1.8;">${data.answer||data.response||'Info'}</div>`;
            } catch (error) {
                resultArea.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
            }
        },
        
        showTransport: function() {
            const content = document.getElementById('infra-content');
            const questions = QuestionsData.getQuestionsBySubmenu('infrastructure')
                .filter(q => q.category === 'Transport');
            
            content.innerHTML = `
                <h3>🚌 Transport</h3>
                <div class="form-group">
                    <select id="transport-select">
                        <option value="">-- Choose --</option>
                        ${questions.map(q => `<option value="${q.id}">${q.question}</option>`).join('')}
                    </select>
                </div>
                <button class="submit-btn" onclick="window.AppFunctions.submitInfraQuery('transport')">Get Info</button>
                <div class="result-area" id="transport-result"></div>
            `;
        },
        
        showUtilities: function() {
            const content = document.getElementById('infra-content');
            const questions = QuestionsData.getQuestionsBySubmenu('infrastructure')
                .filter(q => q.category === 'Utilities');
            
            content.innerHTML = `
                <h3>💡 Utilities</h3>
                <div class="form-group">
                    <select id="utilities-select">
                        <option value="">-- Choose --</option>
                        ${questions.map(q => `<option value="${q.id}">${q.question}</option>`).join('')}
                    </select>
                </div>
                <button class="submit-btn" onclick="window.AppFunctions.submitInfraQuery('utilities')">Get Info</button>
                <div class="result-area" id="utilities-result"></div>
            `;
        },
        
        submitInfraQuery: async function(type) {
            const selectId = type==='transport'?'transport-select':'utilities-select';
            const resultId = type==='transport'?'transport-result':'utilities-result';
            
            const select = document.getElementById(selectId);
            if (!select||!select.value) { alert('Please select'); return; }
            
            const q = QuestionsData.getAllQuestions().find(q => q.id === select.value);
            const question = q ? q.question : '';
            
            const resultArea = document.getElementById(resultId);
            resultArea.innerHTML = '<div class="loading"><div class="spinner"></div><p>Fetching...</p></div>';
            resultArea.classList.add('show');
            
            try {
                let data;
                if (typeof APIModule !== 'undefined' && typeof APIModule.queryN8N === 'function') {
                    data = await APIModule.queryN8N(question, 'PRACTICAL_INFO_QUERY');
                } else {
                    const response = await fetch(AppState.n8nWebhook, {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({question, queryType: 'PRACTICAL_INFO_QUERY'})
                    });
                    data = await response.json();
                }
                
                resultArea.innerHTML = `<div style="line-height:1.8;">${data.answer||data.response||'Info'}</div>`;
            } catch (error) {
                resultArea.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
            }
        },
        
        submitAdminResearch: async function() {
            const input = document.getElementById('admin-research-input');
            const question = input.value.trim();
            if (!question) { alert('Please enter question'); return; }
            
            const resultArea = document.getElementById('admin-research-result');
            resultArea.innerHTML = '<div class="loading"><div class="spinner"></div><p>Researching...</p></div>';
            resultArea.classList.add('show');
            
            try {
                let data;
                if (typeof APIModule !== 'undefined' && typeof APIModule.queryN8N === 'function') {
                    data = await APIModule.queryN8N(question, 'RESEARCH_QUERY');
                } else {
                    const response = await fetch(AppState.n8nWebhook, {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({question, queryType: 'RESEARCH_QUERY'})
                    });
                    data = await response.json();
                }
                
                resultArea.innerHTML = `<div style="line-height:1.8;">${data.answer||data.response||'Research results'}</div>`;
            } catch (error) {
                resultArea.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
            }
        }
    };
    
    // =========================================================================
    // AUTO-INITIALIZE
    // =========================================================================
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();
