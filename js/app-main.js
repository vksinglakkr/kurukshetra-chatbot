/**
 * KURUKSHETRA MITRA - MAIN APP CONTROLLER
 * Handles tab switching, submenu selection, and content rendering
 */

(function() {
    'use strict';
    
    // =========================================
    // STATE MANAGEMENT
    // =========================================
    
    const AppState = {
        currentTab: 'heritage',
        currentSubmenu: null,
        n8nWebhook: 'https://yourn8n.com/webhook/ask-gitaV2n8n' // Replace with actual webhook
    };
    
    // =========================================
    // DOM ELEMENTS
    // =========================================
    
    const Elements = {
        mainTabs: document.querySelectorAll('.main-tab'),
        tabContents: {
            heritage: document.getElementById('heritage-content'),
            admin: document.getElementById('admin-content')
        },
        contentAreas: {
            heritage: document.getElementById('heritage-dynamic-content'),
            admin: document.getElementById('admin-dynamic-content')
        }
    };
    
    // =========================================
    // INITIALIZATION
    // =========================================
    
    function init() {
        console.log('🕉️ Kurukshetra Mitra initializing...');
        
        // Setup main tab switching
        Elements.mainTabs.forEach(tab => {
            tab.addEventListener('click', handleTabSwitch);
        });
        
        // Setup submenu cards
        document.querySelectorAll('.submenu-card').forEach(card => {
            card.addEventListener('click', handleSubmenuSelect);
        });
        
        console.log('✅ Kurukshetra Mitra ready!');
    }
    
    // =========================================
    // TAB SWITCHING
    // =========================================
    
    function handleTabSwitch(e) {
        const tab = e.currentTarget.dataset.tab;
        
        // Update tab buttons
        Elements.mainTabs.forEach(t => t.classList.remove('active'));
        e.currentTarget.classList.add('active');
        
        // Update content visibility
        Object.keys(Elements.tabContents).forEach(key => {
            if (key === tab) {
                Elements.tabContents[key].style.display = 'block';
            } else {
                Elements.tabContents[key].style.display = 'none';
            }
        });
        
        // Clear content
        Elements.contentAreas[tab].innerHTML = '';
        
        // Update state
        AppState.currentTab = tab;
        AppState.currentSubmenu = null;
        
        // Remove active class from all submenu cards
        document.querySelectorAll('.submenu-card').forEach(card => {
            card.classList.remove('active');
        });
    }
    
    // =========================================
    // SUBMENU SELECTION
    // =========================================
    
    function handleSubmenuSelect(e) {
        const card = e.currentTarget;
        const submenu = card.dataset.submenu;
        
        // Update active state
        document.querySelectorAll('.submenu-card').forEach(c => {
            c.classList.remove('active');
        });
        card.classList.add('active');
        
        // Update state
        AppState.currentSubmenu = submenu;
        
        // Render content based on submenu
        renderSubmenuContent(submenu);
    }
    
    // =========================================
    // CONTENT RENDERING
    // =========================================
    
    function renderSubmenuContent(submenu) {
        const contentArea = Elements.contentAreas[AppState.currentTab];
        
        switch(submenu) {
            case 'gita_wisdom':
                renderGitaWisdom(contentArea);
                break;
            case 'temples_sites':
                renderTemplesSites(contentArea);
                break;
            case 'stay_travel':
                renderStayTravel(contentArea);
                break;
            case 'festivals':
                renderFestivals(contentArea);
                break;
            case 'heritage_research':
                renderHeritageResearch(contentArea);
                break;
            case 'demographics':
                renderDemographics(contentArea);
                break;
            case 'government':
                renderGovernment(contentArea);
                break;
            case 'education_health':
                renderEducationHealth(contentArea);
                break;
            case 'infrastructure':
                renderInfrastructure(contentArea);
                break;
            case 'admin_research':
                renderAdminResearch(contentArea);
                break;
            default:
                contentArea.innerHTML = '<p>Content coming soon...</p>';
        }
    }
    
    // =========================================
    // SUBMENU 1: GITA WISDOM
    // =========================================
    
    function renderGitaWisdom(container) {
        container.innerHTML = `
            <h2>📿 Gita Wisdom & Spirituality</h2>
            <p>Ask any question about life, spirituality, or Bhagavad Gita teachings</p>
            
            <div class="form-group">
                <label>Your Question:</label>
                <input type="text" id="gita-input" placeholder="e.g., How to deal with stress according to Gita?" autocomplete="off">
                <div id="gita-suggestions" style="margin-top: 0.5rem;"></div>
            </div>
            
            <button class="submit-btn" onclick="window.AppFunctions.submitGitaQuestion()">
                <i class="fas fa-paper-plane"></i> Ask Question
            </button>
            
            <div class="result-area" id="gita-result"></div>
        `;
        
        // Setup autocomplete
        setupAutocomplete('gita-input', 'gita-suggestions', 'gita_wisdom');
    }
    
    // =========================================
    // SUBMENU 2: TEMPLES & SITES
    // =========================================
    
    function renderTemplesSites(container) {
        const categories = TourGuideData.getAllCategories();
        
        container.innerHTML = `
            <h2>🛕 Temples, Museums & Heritage Sites</h2>
            <p>Explore 80+ sites with virtual tours, maps, and detailed information</p>
            
            <div class="form-group">
                <label>Select Category:</label>
                <select id="site-category" onchange="window.AppFunctions.loadSitesByCategory()">
                    <option value="">-- Choose Category --</option>
                    ${categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                </select>
            </div>
            
            <div class="form-group" id="site-selection" style="display:none;">
                <label>Select Site:</label>
                <select id="site-select">
                    <option value="">-- Choose Site --</option>
                </select>
            </div>
            
            <button class="submit-btn" onclick="window.AppFunctions.viewSiteDetails()" style="display:none;" id="view-site-btn">
                <i class="fas fa-eye"></i> View Site Details
            </button>
            
            <div class="result-area" id="site-result"></div>
        `;
    }
    
    // =========================================
    // SUBMENU 3: STAY & TRAVEL
    // =========================================
    
    function renderStayTravel(container) {
        const questions = QuestionsData.getQuestionsBySubmenu('stay_travel');
        const categories = [...new Set(questions.map(q => q.category))];
        
        container.innerHTML = `
            <h2>🏨 Stay, Food & Travel</h2>
            <p>Find accommodation, restaurants, transport, and facilities</p>
            
            <div class="form-group">
                <label>Ask or Select:</label>
                <input type="text" id="stay-input" placeholder="e.g., Best hotels near Brahma Sarovar?" autocomplete="off">
            </div>
            
            <p style="text-align: center; margin: 1rem 0; color: #999;">OR</p>
            
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
        
        setupAutocomplete('stay-input', null, 'stay_travel');
    }
    
    // =========================================
    // SUBMENU 4: FESTIVALS & EVENTS
    // =========================================
    
    function renderFestivals(container) {
        const questions = QuestionsData.getQuestionsBySubmenu('festivals_events');
        const categories = [...new Set(questions.map(q => q.category))];
        
        container.innerHTML = `
            <h2>📅 Festivals & Events</h2>
            <p>Find upcoming festivals, events, and cultural programs</p>
            
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
                <i class="fas fa-calendar"></i> Get Event Info
            </button>
            
            <div class="result-area" id="festival-result"></div>
        `;
    }
    
    // =========================================
    // SUBMENU 5: HERITAGE RESEARCH
    // =========================================
    
    function renderHeritageResearch(container) {
        container.innerHTML = `
            <h2>📚 Heritage Research</h2>
            <p>Ask research questions about history, archaeology, and culture</p>
            
            <div class="form-group">
                <label>Research Question:</label>
                <input type="text" id="research-input" placeholder="e.g., Archaeological evidence of Mahabharata war?" autocomplete="off">
            </div>
            
            <button class="submit-btn" onclick="window.AppFunctions.submitResearchQuery()">
                <i class="fas fa-search"></i> Research
            </button>
            
            <div class="result-area" id="research-result"></div>
        `;
        
        setupAutocomplete('research-input', null, 'heritage_research');
    }
    
    // =========================================
    // SUBMENU 6: DEMOGRAPHICS
    // =========================================
    
    function renderDemographics(container) {
        container.innerHTML = `
            <h2>📊 Demographics & Statistics</h2>
            <p>Population, area, literacy, and development data</p>
            
            <div style="padding: 2rem; text-align: center;">
                <p style="margin-bottom: 2rem;">View comprehensive demographic data and statistics:</p>
                
                <a href="https://haryanaepaper.com" target="_blank" class="submit-btn" style="display: inline-block; text-decoration: none;">
                    <i class="fas fa-external-link-alt"></i> View Haryana DataVista
                </a>
            </div>
            
            <div style="margin-top: 2rem; padding: 1.5rem; background: #f8f9fa; border-radius: 12px;">
                <h3 style="color: #d97706; margin-bottom: 1rem;">Quick Facts:</h3>
                <ul style="list-style: none; padding-left: 0;">
                    <li style="padding: 0.5rem 0;">📍 <strong>District:</strong> Kurukshetra</li>
                    <li style="padding: 0.5rem 0;">📏 <strong>Area:</strong> 1,530 km²</li>
                    <li style="padding: 0.5rem 0;">👥 <strong>Population:</strong> ~10 lakhs (approx)</li>
                    <li style="padding: 0.5rem 0;">📚 <strong>Literacy:</strong> High literacy district</li>
                </ul>
            </div>
        `;
    }
    
    // =========================================
    // SUBMENU 7-10: Similar patterns...
    // =========================================
    
    function renderGovernment(container) {
        const questions = QuestionsData.getQuestionsBySubmenu('government');
        const categories = [...new Set(questions.map(q => q.category))];
        
        container.innerHTML = `
            <h2>🏢 Government Offices & Services</h2>
            <p>Find office locations, timings, and services</p>
            
            <div class="form-group">
                <label>Service Category:</label>
                <select id="gov-category" onchange="window.AppFunctions.loadGovQuestions()">
                    <option value="">-- Choose Category --</option>
                    ${categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                </select>
            </div>
            
            <div class="form-group" id="gov-questions" style="display:none;">
                <label>Service:</label>
                <select id="gov-question-select"></select>
            </div>
            
            <button class="submit-btn" onclick="window.AppFunctions.submitGovQuery()">
                <i class="fas fa-building"></i> Get Information
            </button>
            
            <div class="result-area" id="gov-result"></div>
        `;
    }
    
    function renderEducationHealth(container) {
        container.innerHTML = `
            <h2>🏫 Education & Healthcare</h2>
            <p>Schools, colleges, hospitals, and healthcare facilities</p>
            
            <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem;">
                <button class="submit-btn" onclick="window.AppFunctions.showEducation()" style="flex: 1;">
                    🏫 Education
                </button>
                <button class="submit-btn" onclick="window.AppFunctions.showHealthcare()" style="flex: 1;">
                    🏥 Healthcare
                </button>
            </div>
            
            <div id="edu-health-content"></div>
        `;
    }
    
    function renderInfrastructure(container) {
        container.innerHTML = `
            <h2>🚌 Infrastructure & Utilities</h2>
            <p>Transport, electricity, water, and other utilities</p>
            
            <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem;">
                <button class="submit-btn" onclick="window.AppFunctions.showTransport()" style="flex: 1;">
                    🚌 Transport
                </button>
                <button class="submit-btn" onclick="window.AppFunctions.showUtilities()" style="flex: 1;">
                    💡 Utilities
                </button>
            </div>
            
            <div id="infra-content"></div>
        `;
    }
    
    function renderAdminResearch(container) {
        container.innerHTML = `
            <h2>📚 Administrative Research</h2>
            <p>City planning, development projects, and governance</p>
            
            <div class="form-group">
                <label>Research Question:</label>
                <input type="text" id="admin-research-input" placeholder="e.g., Smart city projects in Kurukshetra?" autocomplete="off">
            </div>
            
            <button class="submit-btn" onclick="window.AppFunctions.submitAdminResearch()">
                <i class="fas fa-search"></i> Research
            </button>
            
            <div class="result-area" id="admin-research-result"></div>
        `;
    }
    
    // =========================================
    // AUTOCOMPLETE SETUP
    // =========================================
    
    function setupAutocomplete(inputId, suggestionsId, submenu) {
        const input = document.getElementById(inputId);
        if (!input) return;
        
        input.addEventListener('input', function(e) {
            const query = e.target.value;
            if (query.length < 2) return;
            
            const suggestions = QuestionsData.getAutocompleteSuggestions(query, submenu, 5);
            console.log('Suggestions:', suggestions);
            // Add autocomplete UI here
        });
    }
    
    // =========================================
    // PUBLIC FUNCTIONS
    // =========================================
    
    window.AppFunctions = {
        // Site functions
        loadSitesByCategory: function() {
            const category = document.getElementById('site-category').value;
            if (!category) return;
            
            const sites = TourGuideData.getSitesByCategory(category);
            const select = document.getElementById('site-select');
            select.innerHTML = '<option value="">-- Choose Site --</option>' +
                sites.map(site => `<option value="${site.id}">${site.name}</option>`).join('');
            
            document.getElementById('site-selection').style.display = 'block';
            document.getElementById('view-site-btn').style.display = 'block';
        },
        
        viewSiteDetails: function() {
            const siteId = document.getElementById('site-select').value;
            if (!siteId) return;
            
            const site = TourGuideData.getSiteById(siteId);
            const resultArea = document.getElementById('site-result');
            
            resultArea.innerHTML = `
                <h3>${site.name}</h3>
                <p><strong>Category:</strong> ${site.category}</p>
                ${site.mustVisit ? '<span style="color: gold;">⭐ Must Visit Site</span>' : ''}
                
                <div class="iframe-container">
                    <iframe src="${site.url}"></iframe>
                </div>
                
                <div style="margin-top: 1rem; text-align: center;">
                    <a href="${site.url}" target="_blank" class="submit-btn">
                        <i class="fas fa-external-link-alt"></i> Open Full Page
                    </a>
                </div>
            `;
            
            resultArea.classList.add('show');
        },
        
        // Gita functions
        submitGitaQuestion: async function() {
            const input = document.getElementById('gita-input');
            const question = input.value.trim();
            if (!question) return;
            
            const resultArea = document.getElementById('gita-result');
            resultArea.innerHTML = '<div class="loading"><div class="spinner"></div><p>Seeking wisdom...</p></div>';
            resultArea.classList.add('show');
            
            // Call n8n webhook
            try {
                const response = await fetch(AppState.n8nWebhook, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        question: question,
                        queryType: 'PHILOSOPHICAL_AI_QUERY'
                    })
                });
                
                const data = await response.json();
                resultArea.innerHTML = `
                    <h3>Answer:</h3>
                    <p>${data.answer || 'Response received'}</p>
                `;
            } catch (error) {
                resultArea.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
            }
        },
        
        // Add other functions similarly...
        submitStayQuery: function() { console.log('Stay query submitted'); },
        loadStayQuestions: function() {},
        submitFestivalQuery: function() {},
        loadFestivalQuestions: function() {},
        submitResearchQuery: function() {},
        submitGovQuery: function() {},
        loadGovQuestions: function() {},
        showEducation: function() {},
        showHealthcare: function() {},
        showTransport: function() {},
        showUtilities: function() {},
        submitAdminResearch: function() {}
    };
    
    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();
