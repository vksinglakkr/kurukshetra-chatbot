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
        n8nWebhook: 'https://n8n.virensingh.in/webhook/ask-gitaV2n8n',
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
            
            <!-- Ready-made Questions -->
            <div style="margin-bottom: 2rem;">
                <h3 style="color: #d97706; font-size: 1.1rem; margin-bottom: 1rem;">📖 Popular Questions:</h3>
                ${Object.entries(readyQuestions).map(([category, qs]) => `
                    <div style="margin-bottom: 1.5rem;">
                        <h4 style="color: #333; font-size: 0.95rem; margin-bottom: 0.8rem; font-weight: 600;">${category}</h4>
                        <div style="display: grid; gap: 0.5rem;">
                            ${qs.map(q => `
                                <button class="ready-question-btn" onclick="window.AppFunctions.askReadyQuestion('${q.replace(/'/g, "\\'")}')">
                                    ${q}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <!-- Custom Question Section at Bottom -->
            <div style="margin-top: 2rem; padding-top: 2rem; border-top: 2px solid #e6d5c3;">
                <h3 style="color: #d97706; font-size: 1.1rem; margin-bottom: 1rem;">✍️ Ask Your Own Question:</h3>
                
                <div class="form-group">
                    <label>Your Question:</label>
                    <input type="text" id="gita-input" placeholder="e.g., How to deal with stress?" autocomplete="off">
                    <div id="gita-suggestions"></div>
                </div>
                
                <button class="submit-btn" onclick="window.AppFunctions.submitGitaQuestion()">
                    <i class="fas fa-paper-plane"></i> Ask Question
                </button>
            </div>
            
            <div class="result-area" id="gita-result"></div>
        `;
        
        // Setup autocomplete after DOM is ready
        setTimeout(() => {
            const input = document.getElementById('gita-input');
            if (input && typeof AutocompleteModule !== 'undefined') {
                try {
                    AutocompleteModule.init(input, {
                        dataSource: questions.map(q => ({
                            id: q.id,
                            title: q.question,
                            category: q.category,
                            type: 'question'
                        })),
                        onSelect: function(item) {
                            input.value = item.title;
                        },
                        minChars: 2,
                        maxResults: 5
                    });
                } catch (error) {
                    console.warn('Autocomplete init failed:', error);
                }
            }
        }, 100);
    }
    
    function renderTemplesSites(container) {
        const api = TourGuideData.get();
        const categories = api.getAllCategories();
        
        container.innerHTML = `
            <h2>🛕 Temples, Museums & Heritage Sites</h2>
            <p>Explore 79+ sites from kkrtour.com</p>
            
            <div class="form-group">
                <label>Select Category:</label>
                <select id="site-category" onchange="window.AppFunctions.loadSitesByCategory()">
                    <option value="">-- Choose Category --</option>
                    ${categories.map(cat => `<option value="${cat.name}">${cat.icon} ${cat.name} (${cat.count})</option>`).join('')}
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
        
        // Ready Question Handler
        askReadyQuestion: function(question) {
            document.getElementById('gita-input').value = question;
            // Scroll to input
            document.getElementById('gita-input').scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Auto-submit after 500ms
            setTimeout(() => {
                this.submitGitaQuestion();
            }, 500);
        },
        
        // SITES
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
        
        viewSiteDetails: function() {
            const siteId = document.getElementById('site-select').value;
            if (!siteId) { alert('Please select a site'); return; }
            
            const api = TourGuideData.get();
            const site = api.getSiteById(parseInt(siteId));
            if (!site) { alert('Site not found!'); return; }
            
            const siteUrl = `https://kkrtour.com/List.php?id=${site.id}`;
            const resultArea = document.getElementById('site-result');
            
            resultArea.innerHTML = `
                <h3>${site.name}</h3>
                <p><strong>Category:</strong> ${site.category}</p>
                ${site.mustVisit?'<p style="color:gold;font-weight:bold;">⭐ Must Visit Site</p>':''}
                
                <div class="iframe-container">
                    <iframe src="${siteUrl}"></iframe>
                </div>
                
                <div style="margin-top:1rem;text-align:center;">
                    <a href="${siteUrl}" target="_blank" class="submit-btn">
                        <i class="fas fa-external-link-alt"></i> Open Full Page
                    </a>
                </div>
            `;
            
            resultArea.classList.add('show');
        },
        
        // GITA - Uses APIModule if available, otherwise direct fetch
        submitGitaQuestion: async function() {
            const input = document.getElementById('gita-input');
            const question = input.value.trim();
            if (!question) { alert('Please enter a question'); return; }
            
            const resultArea = document.getElementById('gita-result');
            resultArea.innerHTML = '<div class="loading"><div class="spinner"></div><p>Seeking wisdom...</p></div>';
            resultArea.classList.add('show');
            
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
                    data = await response.json();
                }
                
                resultArea.innerHTML = `
                    <h3>📿 Answer:</h3>
                    <div style="line-height:1.8;white-space:pre-wrap;">${data.answer||data.response||'No response'}</div>
                    <div style="margin-top:1rem;padding-top:1rem;border-top:1px solid #e6d5c3;font-size:0.9rem;color:#666;">
                        <em>Based on Bhagavad Gita teachings</em>
                    </div>
                `;
            } catch (error) {
                console.error('Error:', error);
                resultArea.innerHTML = `<p style="color:red;">❌ Error: ${error.message}</p>`;
            }
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
