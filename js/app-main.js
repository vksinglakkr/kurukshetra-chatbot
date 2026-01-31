// ============================================
// KURUKSHETRA MITRA - Using Existing CSS
// ============================================

console.log('🕉️ Loading Kurukshetra Mitra...');

// App Configuration
const AppState = {
    currentMenu: 'main',
    currentSubmenu: null,
    n8nUniversal: 'https://n8n-workflow-test.duckdns.org/webhook/kurukshetra-demographics'
};

// ============================================
// NAVIGATION
// ============================================

function navigateTo(menu, submenu = null) {
    console.log('Navigating to:', menu, submenu);
    AppState.currentMenu = menu;
    AppState.currentSubmenu = submenu;
    renderContent();
}

function renderContent() {
    const contentArea = document.getElementById('content-area');
    
    if (!contentArea) {
        console.error('Content area not found!');
        return;
    }
    
    if (AppState.currentMenu === 'main') {
        contentArea.innerHTML = getMainMenuHTML();
    } else if (AppState.currentSubmenu === 'HeritageResearch') {
        contentArea.innerHTML = getHeritageHTML();
    } else if (AppState.currentSubmenu === 'Demographics') {
        contentArea.innerHTML = getDemographicsHTML();
    }
}

// ============================================
// MAIN MENU HTML
// ============================================

function getMainMenuHTML() {
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
                    <p>Coming Soon</p>
                </div>
                
                <div class="menu-card coming-soon">
                    <i class="fas fa-building"></i>
                    <h3>Government Offices</h3>
                    <p>Coming Soon</p>
                </div>
                
                <div class="menu-card coming-soon">
                    <i class="fas fa-graduation-cap"></i>
                    <h3>Educational Institutions</h3>
                    <p>Coming Soon</p>
                </div>
                
                <div class="menu-card coming-soon">
                    <i class="fas fa-road"></i>
                    <h3>Infrastructure</h3>
                    <p>Coming Soon</p>
                </div>
            </div>
        </div>
    `;
}

// ============================================
// HERITAGE RESEARCH HTML
// ============================================

function getHeritageHTML() {
    return `
        <div class="submenu-container">
            <div class="submenu-header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                <h2>🏛️ Heritage & Tourism Research</h2>
                <p>Archaeological evidence, temples, and historical sites</p>
                <button class="back-btn" onclick="navigateTo('main')">
                    <i class="fas fa-arrow-left"></i> Back to Main Menu
                </button>
            </div>
            
            <div class="tab-selector">
                <button class="tab-btn active" onclick="toggleHeritageMode('ready')">
                    <i class="fas fa-list-ul"></i> Ready Questions
                </button>
                <button class="tab-btn" onclick="toggleHeritageMode('custom')">
                    <i class="fas fa-keyboard"></i> Ask Your Own
                </button>
            </div>
            
            <div id="heritage-ready-mode" class="input-section">
                <div class="form-group">
                    <label><i class="fas fa-folder-open"></i> Select Category:</label>
                    <select id="heritage-category-select" class="form-control" onchange="loadHeritageQuestions()">
                        <option value="">-- Choose a category --</option>
                        <option value="mahabharata-war">📜 Mahabharata War Evidence</option>
                        <option value="sacred-sites">💧 Sacred Water Bodies</option>
                        <option value="temples">🕉️ Temples & Shrines</option>
                        <option value="excavations">🔍 Archaeological Excavations</option>
                        <option value="pilgrimage">🚶 Pilgrimage & Traditions</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label><i class="fas fa-question-circle"></i> Select Question:</label>
                    <select id="heritage-question-select" class="form-control">
                        <option value="">-- First select a category --</option>
                    </select>
                </div>
                
                <button class="btn btn-primary" onclick="submitHeritageReady()">
                    <i class="fas fa-search"></i> Get Research
                </button>
            </div>
            
            <div id="heritage-custom-mode" class="input-section" style="display: none;">
                <div class="form-group">
                    <label><i class="fas fa-pen"></i> Enter Your Question:</label>
                    <textarea 
                        id="heritage-custom-input" 
                        class="form-control" 
                        rows="4" 
                        placeholder="Example: What archaeological evidence exists for the Mahabharata war?"
                    ></textarea>
                </div>
                
                <button class="btn btn-primary" onclick="submitHeritageCustom()">
                    <i class="fas fa-paper-plane"></i> Submit Question
                </button>
            </div>
        </div>
    `;
}

// ============================================
// DEMOGRAPHICS HTML
// ============================================

function getDemographicsHTML() {
    return `
        <div class="submenu-container">
            <div class="submenu-header" style="background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);">
                <h2>📊 Demographics & Statistics</h2>
                <p>Population, area, and development data</p>
                <button class="back-btn" onclick="navigateTo('main')">
                    <i class="fas fa-arrow-left"></i> Back to Main Menu
                </button>
            </div>
            
            <div class="tab-selector">
                <button class="tab-btn active" onclick="toggleDemoMode('ready')">
                    <i class="fas fa-list-ul"></i> Ready Questions
                </button>
                <button class="tab-btn" onclick="toggleDemoMode('custom')">
                    <i class="fas fa-keyboard"></i> Ask Your Own
                </button>
            </div>
            
            <div id="demo-ready-mode" class="input-section">
                <div class="form-group">
                    <label><i class="fas fa-folder-open"></i> Select Category:</label>
                    <select id="demo-category-select" class="form-control" onchange="loadDemoQuestions()">
                        <option value="">-- Choose a category --</option>
                        <option value="population">📍 Population Data</option>
                        <option value="geography">🗺️ Geographic Data</option>
                        <option value="development">📈 Development Indicators</option>
                        <option value="health">🏥 Health Data</option>
                        <option value="economy">💼 Economic Statistics</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label><i class="fas fa-question-circle"></i> Select Question:</label>
                    <select id="demo-question-select" class="form-control">
                        <option value="">-- First select a category --</option>
                    </select>
                </div>
                
                <button class="btn btn-primary" onclick="submitDemoReady()">
                    <i class="fas fa-search"></i> Get Statistics
                </button>
            </div>
            
            <div id="demo-custom-mode" class="input-section" style="display: none;">
                <div class="form-group">
                    <label><i class="fas fa-pen"></i> Enter Your Question:</label>
                    <textarea 
                        id="demo-custom-input" 
                        class="form-control" 
                        rows="4" 
                        placeholder="Example: What is the current population of Kurukshetra?"
                    ></textarea>
                </div>
                
                <button class="btn btn-primary" onclick="submitDemoCustom()">
                    <i class="fas fa-paper-plane"></i> Submit Question
                </button>
            </div>
            
            <div class="info-card">
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

// ============================================
// HERITAGE FUNCTIONS
// ============================================

function toggleHeritageMode(mode) {
    const readyMode = document.getElementById('heritage-ready-mode');
    const customMode = document.getElementById('heritage-custom-mode');
    const buttons = document.querySelectorAll('.tab-selector .tab-btn');
    
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
}

function loadHeritageQuestions() {
    const category = document.getElementById('heritage-category-select').value;
    const questionSelect = document.getElementById('heritage-question-select');
    
    const questions = {
        'mahabharata-war': [
            'What archaeological evidence exists for the Mahabharata war?',
            'What is the Painted Grey Ware culture?',
            'Why is archaeological evidence limited?'
        ],
        'sacred-sites': [
            'What is the history of Brahma Sarovar?',
            'Tell me about Sannihit Sarovar',
            'What is the significance of Jyotisar?'
        ],
        'temples': [
            'Tell me about Sthaneshwar Mahadev Temple',
            'What is the history of Bhadrakali Temple?',
            'Describe Jyotisar Temple complex'
        ],
        'excavations': [
            'What has been found at Thanesar Mound?',
            'Describe the Amin archaeological site',
            'What artifacts have been discovered?'
        ],
        'pilgrimage': [
            'What is the 48 Kos Parikrama route?',
            'When is Somavati Amavasya celebrated?',
            'What are the major pilgrimage sites?'
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
}

async function submitHeritageReady() {
    const question = document.getElementById('heritage-question-select').value;
    
    if (!question) {
        alert('Please select a question');
        return;
    }
    
    alert('Sending: ' + question);
    
    try {
        const response = await fetch(AppState.n8nUniversal, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                question: question,
                queryType: 'HERITAGE_RESEARCH'
            })
        });
        
        const data = await response.json();
        console.log('Response:', data);
        alert('Answer: ' + (data.formattedAnswer || data.answer || 'No answer'));
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error: ' + error.message);
    }
}

async function submitHeritageCustom() {
    const question = document.getElementById('heritage-custom-input').value.trim();
    
    if (!question) {
        alert('Please enter your question');
        return;
    }
    
    alert('Sending: ' + question);
    
    try {
        const response = await fetch(AppState.n8nUniversal, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                question: question,
                queryType: 'HERITAGE_RESEARCH'
            })
        });
        
        const data = await response.json();
        console.log('Response:', data);
        alert('Answer: ' + (data.formattedAnswer || data.answer || 'No answer'));
        
        document.getElementById('heritage-custom-input').value = '';
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error: ' + error.message);
    }
}

// ============================================
// DEMOGRAPHICS FUNCTIONS
// ============================================

function toggleDemoMode(mode) {
    const readyMode = document.getElementById('demo-ready-mode');
    const customMode = document.getElementById('demo-custom-mode');
    const buttons = document.querySelectorAll('.tab-selector .tab-btn');
    
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
}

function loadDemoQuestions() {
    const category = document.getElementById('demo-category-select').value;
    const questionSelect = document.getElementById('demo-question-select');
    
    const questions = {
        'population': [
            'What is the current population of Kurukshetra district?',
            'What is the population density?',
            'What is the gender ratio?',
            'What is the child sex ratio?'
        ],
        'geography': [
            'What is the total area of the district?',
            'How many blocks are in Kurukshetra?',
            'What are the administrative divisions?',
            'How many villages are there?'
        ],
        'development': [
            'What is the literacy rate?',
            'What is the per capita income?',
            'What are the development indicators?',
            'What is the HDI of Kurukshetra?'
        ],
        'health': [
            'How many hospitals are there?',
            'What is the infant mortality rate?',
            'How many doctors are available?',
            'What are the health indicators?'
        ],
        'economy': [
            'What is the per capita income?',
            'What are the main economic sectors?',
            'What percentage works in agriculture?',
            'What is the poverty rate?'
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
}

async function submitDemoReady() {
    const question = document.getElementById('demo-question-select').value;
    
    if (!question) {
        alert('Please select a question');
        return;
    }
    
    alert('Sending: ' + question);
    
    try {
        const response = await fetch(AppState.n8nUniversal, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                question: question,
                queryType: 'DEMOGRAPHICS'
            })
        });
        
        const data = await response.json();
        console.log('Response:', data);
        alert('Answer: ' + (data.formattedAnswer || data.answer || 'No answer'));
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error: ' + error.message);
    }
}

async function submitDemoCustom() {
    const question = document.getElementById('demo-custom-input').value.trim();
    
    if (!question) {
        alert('Please enter your question');
        return;
    }
    
    alert('Sending: ' + question);
    
    try {
        const response = await fetch(AppState.n8nUniversal, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                question: question,
                queryType: 'DEMOGRAPHICS'
            })
        });
        
        const data = await response.json();
        console.log('Response:', data);
        alert('Answer: ' + (data.formattedAnswer || data.answer || 'No answer'));
        
        document.getElementById('demo-custom-input').value = '';
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error: ' + error.message);
    }
}

// ============================================
// INITIALIZE
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM Loaded');
    renderContent();
    console.log('✅ Kurukshetra Mitra Ready!');
});

console.log('✅ Script Loaded! 🕉️');
