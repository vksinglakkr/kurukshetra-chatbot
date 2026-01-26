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
        n8nWebhook: 'https://n8n-workflow-test.duckdns.org/webhook/ask-gitaV2n8n',
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
            <p>Find accommodation, restaurants, transport</p>
            
            <div class="form-group">
                <label>Category:</label>
                <select id="stay-category" onchange="window.AppFunctions.loadStayQuestions()">
                    <option value="">-- Choose Category --</option>
                    ${categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                </select>
            </div>
            
            <div class="form-group" id="stay-questions" style="display:none;">
                <label>Question:</label>
                <select id="stay-question-select"></select>
            </div>
            
            <button class="submit-btn" onclick="window.AppFunctions.submitStayQuery()">
                <i class="fas fa-search"></i> Get Information
            </button>
            
            <div class="result-area" id="stay-result"></div>
        `;
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
        container.innerHTML = `
            <h2>📚 Heritage Research</h2>
            <p>Research questions about history and archaeology</p>
            
            <div class="form-group">
                <label>Research Question:</label>
                <input type="text" id="research-input" placeholder="e.g., Archaeological evidence?" autocomplete="off">
            </div>
            
            <button class="submit-btn" onclick="window.AppFunctions.submitResearchQuery()">
                <i class="fas fa-search"></i> Research
            </button>
            
            <div class="result-area" id="research-result"></div>
        `;
    }
    
    function renderDemographics(container) {
        container.innerHTML = `
            <h2>📊 Demographics & Statistics</h2>
            <p>Population, area, and development data</p>
            
            <div style="padding:2rem;text-align:center;">
                <a href="https://haryanaepaper.com" target="_blank" class="submit-btn" style="display:inline-block;text-decoration:none;">
                    <i class="fas fa-external-link-alt"></i> View Haryana DataVista
                </a>
            </div>
            
            <div style="margin-top:2rem;padding:1.5rem;background:#f8f9fa;border-radius:12px;">
                <h3 style="color:#d97706;margin-bottom:1rem;">Quick Facts:</h3>
                <ul style="list-style:none;padding-left:0;">
                    <li style="padding:0.5rem 0;">📍 <strong>District:</strong> Kurukshetra</li>
                    <li style="padding:0.5rem 0;">📏 <strong>Area:</strong> 1,530 km²</li>
                    <li style="padding:0.5rem 0;">👥 <strong>Population:</strong> ~10 lakhs</li>
                </ul>
            </div>
        `;
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
        
        
        // STAY & TRAVEL
        loadStayQuestions: function() {
            const category = document.getElementById('stay-category').value;
            if (!category) {
                document.getElementById('stay-questions').style.display = 'none';
                return;
            }
            
            const questions = QuestionsData.getQuestionsBySubmenu('stay_travel')
                .filter(q => q.category === category);
            
            const select = document.getElementById('stay-question-select');
            select.innerHTML = '<option value="">-- Choose --</option>' +
                questions.map(q => `<option value="${q.id}">${q.question}</option>`).join('');
            
            document.getElementById('stay-questions').style.display = 'block';
        },
        
        submitStayQuery: async function() {
            const select = document.getElementById('stay-question-select');
            if (!select||!select.value) { alert('Please select'); return; }
            
            const q = QuestionsData.getAllQuestions().find(q => q.id === select.value);
            const question = q ? q.question : '';
            
            const resultArea = document.getElementById('stay-result');
            resultArea.innerHTML = '<div class="loading"><div class="spinner"></div><p>Searching...</p></div>';
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
                
                resultArea.innerHTML = `<div style="line-height:1.8;">${data.answer||data.response||'Info retrieved'}</div>`;
            } catch (error) {
                resultArea.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
            }
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
