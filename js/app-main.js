// ============================================
// KURUKSHETRA MITRA - COMPLETE APP
// Version: 2.0 - Universal AI System
// ============================================

// ============================================
// 1. INITIALIZE (MUST BE FIRST!)
// ============================================

// Initialize AppFunctions object
window.AppFunctions = window.AppFunctions || {};

// AppState Configuration
const AppState = {
    currentMenu: 'main',
    currentSubmenu: null,
    chatHistory: [],
    n8nWebhook: 'https://n8n-workflow-test.duckdns.org/webhook-test/kurukshetra-chatbot',
    n8nUniversal: 'https://n8n-workflow-test.duckdns.org/webhook/kurukshetra-demographics'
};

// ============================================
// 2. UTILITY FUNCTIONS
// ============================================

function navigateTo(menu, submenu = null) {
    AppState.currentMenu = menu;
    AppState.currentSubmenu = submenu;
    renderContent();
}

function renderContent() {
    const contentArea = document.getElementById('content-area');
    
    // Safety check - if content-area doesn't exist, wait
    if (!contentArea) {
        console.warn('Content area not found, waiting for DOM...');
        return;
    }
    
    if (AppState.currentMenu === 'main') {
        contentArea.innerHTML = renderMainMenu();
    } else if (AppState.currentSubmenu) {
        const renderFunction = window[`render${AppState.currentSubmenu}`];
        if (typeof renderFunction === 'function') {
            contentArea.innerHTML = renderFunction();
        } else {
            contentArea.innerHTML = '<p>Feature coming soon...</p>';
        }
    }
}

// ============================================
// 3. MAIN MENU
// ============================================

function renderMainMenu() {
    return `
        <div class="main-menu">
            <div class="welcome-section">
                <h1>🕉️ Welcome to Kurukshetra Mitra</h1>
                <p>Your AI-powered guide to the sacred land of Kurukshetra</p>
            </div>
            
            <div class="menu-grid">
                <div class="menu-card" onclick="navigateTo('submenu', 'HeritageResearch')">
                    <i class="fas fa-landmark"></i>
                    <h3>Heritage & Tourism</h3>
                    <p>Archaeological sites and historical information</p>
                </div>
                
                <div class="menu-card" onclick="navigateTo('submenu', 'Demographics')">
                    <i class="fas fa-chart-line"></i>
                    <h3>Demographics & Statistics</h3>
                    <p>Population, area, and development data</p>
                </div>
                
                <div class="menu-card coming-soon">
                    <i class="fas fa-calendar-alt"></i>
                    <h3>Festivals & Events</h3>
                    <p>Annual celebrations and cultural programs</p>
                </div>
                
                <div class="menu-card coming-soon">
                    <i class="fas fa-building"></i>
                    <h3>Government Offices</h3>
                    <p>Administrative services and contact info</p>
                </div>
                
                <div class="menu-card coming-soon">
                    <i class="fas fa-graduation-cap"></i>
                    <h3>Educational Institutions</h3>
                    <p>Schools, colleges, and universities</p>
                </div>
                
                <div class="menu-card coming-soon">
                    <i class="fas fa-road"></i>
                    <h3>Infrastructure</h3>
                    <p>Roads, railways, and development projects</p>
                </div>
                
                <div class="menu-card coming-soon">
                    <i class="fas fa-museum"></i>
                    <h3>Museums & Attractions</h3>
                    <p>Cultural centers and tourist spots</p>
                </div>
                
                <div class="menu-card coming-soon">
                    <i class="fas fa-search"></i>
                    <h3>Admin Research</h3>
                    <p>Administrative data and reports</p>
                </div>
            </div>
        </div>
    `;
}

// ============================================
// 4. HERITAGE RESEARCH MODULE
// ============================================

function renderHeritageResearch() {
    return `
        <div class="submenu-container">
            <div class="submenu-header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                <i class="fas fa-landmark"></i>
                <h2>🏛️ Heritage & Tourism Research</h2>
                <p>Archaeological evidence, temples, and historical sites</p>
                <button class="back-btn" onclick="navigateTo('main')">
                    <i class="fas fa-arrow-left"></i> Back to Main Menu
                </button>
            </div>
            
            <div class="heritage-mode-selector">
                <button class="mode-btn active" onclick="window.toggleHeritageMode('ready')">
                    <i class="fas fa-list-ul"></i> Ready Questions
                </button>
                <button class="mode-btn" onclick="window.toggleHeritageMode('custom')">
                    <i class="fas fa-keyboard"></i> Ask Your Own
                </button>
            </div>
            
            <div id="heritage-ready-mode" class="heritage-input-section">
                <div class="form-group">
                    <label><i class="fas fa-folder-open"></i> Select Category:</label>
                    <select id="heritage-category-select" class="form-control" onchange="window.loadHeritageQuestions()">
                        <option value="">-- Choose a category --</option>
                        <option value="mahabharata-war">📜 Mahabharata War Evidence</option>
                        <option value="sacred-sites">💧 Sacred Water Bodies</option>
                        <option value="temples">🕉️ Temples & Shrines</option>
                        <option value="excavations">🔍 Archaeological Excavations</option>
                        <option value="pilgrimage">🚶 Pilgrimage & Traditions</option>
                        <option value="mythology">📖 Mythology & Puranas</option>
                        <option value="monuments">🏰 Historical Monuments</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label><i class="fas fa-question-circle"></i> Select Question:</label>
                    <select id="heritage-question-select" class="form-control">
                        <option value="">-- First select a category --</option>
                    </select>
                </div>
                
                <button class="submit-btn" onclick="window.submitHeritageReady()">
                    <i class="fas fa-search"></i> Get Research
                </button>
            </div>
            
            <div id="heritage-custom-mode" class="heritage-input-section" style="display: none;">
                <div class="form-group">
                    <label><i class="fas fa-pen"></i> Enter Your Question:</label>
                    <textarea 
                        id="heritage-custom-input" 
                        class="form-control" 
                        rows="4" 
                        placeholder="Example: What archaeological evidence exists for the Mahabharata war in Kurukshetra?"
                    ></textarea>
                </div>
                
                <button class="submit-btn" onclick="window.submitHeritageCustom()">
                    <i class="fas fa-paper-plane"></i> Submit Question
                </button>
            </div>
        </div>
    `;
}

// Heritage Toggle Mode
window.toggleHeritageMode = function(mode) {
    const readyMode = document.getElementById('heritage-ready-mode');
    const customMode = document.getElementById('heritage-custom-mode');
    const buttons = document.querySelectorAll('.heritage-mode-selector .mode-btn');
    
    buttons.forEach(btn => btn.classList.remove('active'));
    
    if (mode === 'ready') {
        readyMode.style.display = 'block';
        customMode.style.display = 'none';
        buttons[0].classList.add('active');
    } else {
        readyMode.style.display = 'none';
        customMode.style.display = 'block';
        buttons[1].classList.add('active');
    }
};

// Load Heritage Questions
window.loadHeritageQuestions = function() {
    const category = document.getElementById('heritage-category-select').value;
    const questionSelect = document.getElementById('heritage-question-select');
    
    const questions = {
        'mahabharata-war': [
            'What archaeological evidence exists for the Mahabharata war?',
            'What is the Painted Grey Ware culture?',
            'Which excavation sites are in Kurukshetra?',
            'What do experts say about the war evidence?',
            'Why is archaeological evidence limited?'
        ],
        'sacred-sites': [
            'What is the history of Brahma Sarovar?',
            'Tell me about Sannihit Sarovar',
            'What is the significance of Jyotisar?',
            'How many sacred water bodies are there?',
            'What is the 48 Kos Parikrama?'
        ],
        'temples': [
            'Tell me about Sthaneshwar Mahadev Temple',
            'What is the history of Bhadrakali Temple?',
            'Describe Jyotisar Temple complex',
            'Which temples are important in Kurukshetra?',
            'What festivals are celebrated at temples?'
        ],
        'excavations': [
            'What has been found at Thanesar Mound?',
            'Describe the Amin archaeological site',
            'What artifacts have been discovered?',
            'Which period do the findings belong to?',
            'What does ASI say about excavations?'
        ],
        'pilgrimage': [
            'What is the 48 Kos Parikrama route?',
            'When is Somavati Amavasya celebrated?',
            'What are the major pilgrimage sites?',
            'What rituals are performed?',
            'What facilities exist for pilgrims?'
        ],
        'mythology': [
            'What is the connection to Mahabharata?',
            'Where was the Bhagavad Gita delivered?',
            'What is the significance of Kurukshetra?',
            'What do Puranas say about this place?',
            'What is the historical timeline?'
        ],
        'monuments': [
            'Tell me about Sheikh Chilli\'s Tomb',
            'What Mughal monuments exist here?',
            'Which monuments are ASI protected?',
            'What is the architectural significance?',
            'How old are these structures?'
        ]
    };
    
    questionSelect.innerHTML = '<option value="">-- Choose a question --</option>';
    
    if (questions[category]) {
        questions[category].forEach(q => {
            const option = document.createElement('option');
            option.value = q;
            option.textContent = q;
            questionSelect.appendChild(option);
        });
    }
};

// Submit Heritage Ready
window.submitHeritageReady = async function() {
    const category = document.getElementById('heritage-category-select').value;
    const question = document.getElementById('heritage-question-select').value;
    
    if (!question) {
        alert('Please select a question');
        return;
    }
    
    window.showHeritageLoadingModal();
    
    try {
        const response = await fetch(AppState.n8nUniversal, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                question: question,
                queryType: 'HERITAGE_RESEARCH'
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Heritage response:', data);
        
        window.closeHeritageLoadingModal();
        
        let answer = data.formattedAnswer || data.answer || 'No answer received from the system.';
        window.showHeritageAnswerModal(question, answer);
        
    } catch (error) {
        window.closeHeritageLoadingModal();
        console.error('Error:', error);
        alert('Error fetching heritage information. Please try again.');
    }
};

// Submit Heritage Custom
window.submitHeritageCustom = async function() {
    const question = document.getElementById('heritage-custom-input').value.trim();
    
    if (!question) {
        alert('Please enter your question');
        return;
    }
    
    window.showHeritageLoadingModal();
    
    try {
        const response = await fetch(AppState.n8nUniversal, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                question: question,
                queryType: 'HERITAGE_RESEARCH'
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Heritage response:', data);
        
        window.closeHeritageLoadingModal();
        
        let answer = data.formattedAnswer || data.answer || 'No answer received from the system.';
        window.showHeritageAnswerModal(question, answer);
        
        document.getElementById('heritage-custom-input').value = '';
        
    } catch (error) {
        window.closeHeritageLoadingModal();
        console.error('Error:', error);
        alert('Error fetching heritage information. Please try again.');
    }
};

// Heritage Modals
window.showHeritageLoadingModal = function() {
    const modal = document.createElement('div');
    modal.id = 'heritage-loading-modal';
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);display:flex;justify-content:center;align-items:center;z-index:10000;';
    modal.innerHTML = '<div style="background:white;padding:40px;border-radius:15px;text-align:center;"><div class="spinner" style="width:60px;height:60px;border:6px solid #f3f3f3;border-top:6px solid #4a90e2;border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 20px;"></div><p style="font-size:18px;color:#333;margin:0;">Searching Heritage Information...</p></div>';
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
};

window.closeHeritageLoadingModal = function() {
    const modal = document.getElementById('heritage-loading-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
};

window.showHeritageAnswerModal = function(question, answer) {
    const modal = document.createElement('div');
    modal.id = 'heritage-answer-modal';
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);display:flex;justify-content:center;align-items:center;z-index:10000;overflow-y:auto;padding:20px;';
    modal.innerHTML = `
        <div style="background:white;max-width:800px;width:100%;border-radius:15px;box-shadow:0 10px 40px rgba(0,0,0,0.3);max-height:90vh;display:flex;flex-direction:column;">
            <div style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;padding:25px;border-radius:15px 15px 0 0;display:flex;justify-content:space-between;align-items:center;">
                <div style="display:flex;align-items:center;gap:15px;">
                    <i class="fas fa-landmark" style="font-size:28px;"></i>
                    <h3 style="margin:0;font-size:22px;">Heritage Research Results</h3>
                </div>
                <button onclick="window.closeHeritageAnswerModal()" style="background:rgba(255,255,255,0.2);border:none;color:white;width:35px;height:35px;border-radius:50%;cursor:pointer;font-size:20px;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div style="padding:30px;overflow-y:auto;flex:1;">
                <div style="background:#f0f9ff;padding:20px;border-radius:10px;margin-bottom:25px;border-left:4px solid #667eea;">
                    <p style="margin:0;color:#1e40af;font-weight:600;"><i class="fas fa-question-circle"></i> Question:</p>
                    <p style="margin:10px 0 0 0;color:#1e3a8a;font-size:16px;">${question}</p>
                </div>
                <div style="background:#fffbeb;padding:25px;border-radius:10px;margin-bottom:20px;border-left:4px solid #f59e0b;">
                    <p style="margin:0 0 15px 0;color:#92400e;font-weight:600;"><i class="fas fa-scroll"></i> Historical Information:</p>
                    <div style="color:#78350f;font-size:15px;line-height:1.8;">${answer}</div>
                </div>
                <div style="background:#fef2f2;padding:15px;border-radius:8px;border-left:4px solid #ef4444;">
                    <p style="margin:0;color:#991b1b;font-size:13px;"><i class="fas fa-exclamation-triangle"></i> <strong>Note:</strong> Information is based on historical records and archaeological evidence.</p>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    modal.addEventListener('click', (e) => { if (e.target === modal) window.closeHeritageAnswerModal(); });
};

window.closeHeritageAnswerModal = function() {
    const modal = document.getElementById('heritage-answer-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
};

// ============================================
// 5. DEMOGRAPHICS MODULE
// ============================================

function renderDemographics() {
    return `
        <div class="submenu-container">
            <div class="submenu-header" style="background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);">
                <i class="fas fa-chart-line"></i>
                <h2>📊 Demographics & Statistics</h2>
                <p>Population, area, and development data</p>
                <button class="back-btn" onclick="navigateTo('main')">
                    <i class="fas fa-arrow-left"></i> Back to Main Menu
                </button>
            </div>
            
            <div class="demo-mode-selector">
                <button class="mode-btn active" onclick="window.toggleDemoMode('ready')">
                    <i class="fas fa-list-ul"></i> Ready Questions
                </button>
                <button class="mode-btn" onclick="window.toggleDemoMode('custom')">
                    <i class="fas fa-keyboard"></i> Ask Your Own
                </button>
            </div>
            
            <div id="demo-ready-mode" class="demo-input-section">
                <div class="form-group">
                    <label><i class="fas fa-folder-open"></i> Select Category:</label>
                    <select id="demo-category-select" class="form-control" onchange="window.loadDemoQuestions()">
                        <option value="">-- Choose a category --</option>
                        <option value="population">📍 Population Data</option>
                        <option value="geography">🗺️ Geographic & Administrative</option>
                        <option value="development">📈 Development Indicators</option>
                        <option value="health">🏥 Health & Education</option>
                        <option value="economy">💼 Economic Statistics</option>
                        <option value="urbanization">🏘️ Urbanization & Infrastructure</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label><i class="fas fa-question-circle"></i> Select Question:</label>
                    <select id="demo-question-select" class="form-control">
                        <option value="">-- First select a category --</option>
                    </select>
                </div>
                
                <button class="submit-btn" onclick="window.submitDemoReady()">
                    <i class="fas fa-search"></i> Get Statistics
                </button>
            </div>
            
            <div id="demo-custom-mode" class="demo-input-section" style="display: none;">
                <div class="form-group">
                    <label><i class="fas fa-pen"></i> Enter Your Question:</label>
                    <textarea 
                        id="demo-custom-input" 
                        class="form-control" 
                        rows="4" 
                        placeholder="Example: What is the current population of Kurukshetra district?"
                    ></textarea>
                </div>
                
                <button class="submit-btn" onclick="window.submitDemoCustom()">
                    <i class="fas fa-paper-plane"></i> Submit Question
                </button>
            </div>
            
            <div class="quick-facts">
                <h3><i class="fas fa-info-circle"></i> Quick Facts</h3>
                <div class="fact-grid">
                    <div class="fact-item">
                        <span class="fact-label">District:</span>
                        <span class="fact-value">Kurukshetra</span>
                    </div>
                    <div class="fact-item">
                        <span class="fact-label">Area:</span>
                        <span class="fact-value">1,530 km²</span>
                    </div>
                    <div class="fact-item">
                        <span class="fact-label">Population:</span>
                        <span class="fact-value">~10 lakhs</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Demographics Toggle Mode
window.toggleDemoMode = function(mode) {
    const readyMode = document.getElementById('demo-ready-mode');
    const customMode = document.getElementById('demo-custom-mode');
    const buttons = document.querySelectorAll('.demo-mode-selector .mode-btn');
    
    buttons.forEach(btn => btn.classList.remove('active'));
    
    if (mode === 'ready') {
        readyMode.style.display = 'block';
        customMode.style.display = 'none';
        buttons[0].classList.add('active');
    } else {
        readyMode.style.display = 'none';
        customMode.style.display = 'block';
        buttons[1].classList.add('active');
    }
};

// Load Demo Questions
window.loadDemoQuestions = function() {
    const category = document.getElementById('demo-category-select').value;
    const questionSelect = document.getElementById('demo-question-select');
    
    const questions = {
        'population': [
            'What is the current population of Kurukshetra district?',
            'What is the population density?',
            'What is the gender ratio?',
            'What is the urban-rural population split?',
            'What is the child sex ratio?',
            'How many households are there?'
        ],
        'geography': [
            'What is the total area of the district?',
            'How many blocks are in Kurukshetra?',
            'What are the administrative divisions?',
            'Which districts border Kurukshetra?',
            'How many villages are there?'
        ],
        'development': [
            'What is the literacy rate?',
            'What is the HDI of Kurukshetra?',
            'What is the per capita income?',
            'What is the unemployment rate?',
            'What is the poverty rate?',
            'What are the development indicators?'
        ],
        'health': [
            'How many hospitals are there?',
            'What is the infant mortality rate?',
            'How many doctors are available?',
            'What are the health indicators?',
            'How many PHCs are there?'
        ],
        'economy': [
            'What is the per capita income?',
            'What are the main economic sectors?',
            'What percentage works in agriculture?',
            'What is the industrial contribution?',
            'What is the poverty rate?'
        ],
        'urbanization': [
            'What is the urbanization percentage?',
            'How many households have electricity?',
            'What is the water supply coverage?',
            'What is the urban growth rate?',
            'What infrastructure exists?'
        ]
    };
    
    questionSelect.innerHTML = '<option value="">-- Choose a question --</option>';
    
    if (questions[category]) {
        questions[category].forEach(q => {
            const option = document.createElement('option');
            option.value = q;
            option.textContent = q;
            questionSelect.appendChild(option);
        });
    }
};

// Submit Demo Ready
window.submitDemoReady = async function() {
    const category = document.getElementById('demo-category-select').value;
    const question = document.getElementById('demo-question-select').value;
    
    if (!question) {
        alert('Please select a question');
        return;
    }
    
    window.showDemoLoadingModal();
    
    try {
        const response = await fetch(AppState.n8nUniversal, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                question: question,
                queryType: 'DEMOGRAPHICS'
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Demographics response:', data);
        
        window.closeDemoLoadingModal();
        
        let answer = data.formattedAnswer || data.answer || 'No answer received from the system.';
        window.showDemoAnswerModal(question, answer);
        
    } catch (error) {
        window.closeDemoLoadingModal();
        console.error('Error:', error);
        alert('Error fetching statistics. Please try again.');
    }
};

// Submit Demo Custom
window.submitDemoCustom = async function() {
    const question = document.getElementById('demo-custom-input').value.trim();
    
    if (!question) {
        alert('Please enter your question');
        return;
    }
    
    window.showDemoLoadingModal();
    
    try {
        const response = await fetch(AppState.n8nUniversal, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                question: question,
                queryType: 'DEMOGRAPHICS'
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Demographics response:', data);
        
        window.closeDemoLoadingModal();
        
        let answer = data.formattedAnswer || data.answer || 'No answer received from the system.';
        window.showDemoAnswerModal(question, answer);
        
        document.getElementById('demo-custom-input').value = '';
        
    } catch (error) {
        window.closeDemoLoadingModal();
        console.error('Error:', error);
        alert('Error fetching statistics. Please try again.');
    }
};

// Demographics Modals
window.showDemoLoadingModal = function() {
    const modal = document.createElement('div');
    modal.id = 'demo-loading-modal';
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);display:flex;justify-content:center;align-items:center;z-index:10000;';
    modal.innerHTML = '<div style="background:white;padding:40px;border-radius:15px;text-align:center;"><div class="spinner" style="width:60px;height:60px;border:6px solid #f3f3f3;border-top:6px solid #3b82f6;border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 20px;"></div><p style="font-size:18px;color:#333;margin:0;">Fetching Statistics...</p></div>';
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
};

window.closeDemoLoadingModal = function() {
    const modal = document.getElementById('demo-loading-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
};

window.showDemoAnswerModal = function(question, answer) {
    const modal = document.createElement('div');
    modal.id = 'demo-answer-modal';
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);display:flex;justify-content:center;align-items:center;z-index:10000;overflow-y:auto;padding:20px;';
    modal.innerHTML = `
        <div style="background:white;max-width:800px;width:100%;border-radius:15px;box-shadow:0 10px 40px rgba(0,0,0,0.3);max-height:90vh;display:flex;flex-direction:column;">
            <div style="background:linear-gradient(135deg,#3b82f6 0%,#1e40af 100%);color:white;padding:25px;border-radius:15px 15px 0 0;display:flex;justify-content:space-between;align-items:center;">
                <div style="display:flex;align-items:center;gap:15px;">
                    <i class="fas fa-chart-bar" style="font-size:28px;"></i>
                    <h3 style="margin:0;font-size:22px;">Statistics Results</h3>
                </div>
                <button onclick="window.closeDemoModal()" style="background:rgba(255,255,255,0.2);border:none;color:white;width:35px;height:35px;border-radius:50%;cursor:pointer;font-size:20px;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div style="padding:30px;overflow-y:auto;flex:1;">
                <div style="background:#eff6ff;padding:20px;border-radius:10px;margin-bottom:25px;border-left:4px solid #3b82f6;">
                    <p style="margin:0;color:#1e40af;font-weight:600;"><i class="fas fa-question-circle"></i> Question:</p>
                    <p style="margin:10px 0 0 0;color:#1e3a8a;font-size:16px;">${question}</p>
                </div>
                <div style="background:#fffbeb;padding:25px;border-radius:10px;margin-bottom:20px;border-left:4px solid #f59e0b;">
                    <p style="margin:0 0 15px 0;color:#92400e;font-weight:600;"><i class="fas fa-database"></i> Data:</p>
                    <div style="color:#78350f;font-size:15px;line-height:1.8;">${answer}</div>
                </div>
                <div style="background:#fef2f2;padding:15px;border-radius:8px;border-left:4px solid #ef4444;">
                    <p style="margin:0;color:#991b1b;font-size:13px;"><i class="fas fa-info-circle"></i> <strong>Note:</strong> Data is based on official sources. For latest statistics, refer to census and government reports.</p>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    modal.addEventListener('click', (e) => { if (e.target === modal) window.closeDemoModal(); });
};

window.closeDemoModal = function() {
    const modal = document.getElementById('demo-answer-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
};

// ============================================
// 6. INITIALIZE APP (AT THE VERY END)
// ============================================

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

function initializeApp() {
    console.log('Initializing Kurukshetra Mitra App...');
    
    // Add spinner animation
    const style = document.createElement('style');
    style.textContent = '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
    document.head.appendChild(style);
    
    // Check if content-area exists
    const contentArea = document.getElementById('content-area');
    if (contentArea) {
        renderContent();
        console.log('Kurukshetra Mitra App Loaded Successfully! 🕉️');
    } else {
        console.error('❌ ERROR: #content-area element not found in HTML!');
        console.error('Please make sure your HTML has: <div id="content-area"></div>');
        
        // Try to create content-area if body exists
        if (document.body) {
            console.log('Attempting to create content-area...');
            const contentDiv = document.createElement('div');
            contentDiv.id = 'content-area';
            document.body.appendChild(contentDiv);
            renderContent();
            console.log('✅ Content-area created and app initialized!');
        }
    }
}

// Export functions to window
window.navigateTo = navigateTo;
window.renderMainMenu = renderMainMenu;
window.renderHeritageResearch = renderHeritageResearch;
window.renderDemographics = renderDemographics;
