/**
 * KURUKSHETRA MITRA - SIMPLIFIED MAIN APP
 * Minimal version that works
 */

console.log('🕉️ Kurukshetra Mitra Loading...');

// Wait for DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('📦 DOM Ready - Starting initialization...');
    
    try {
        // Initialize Platform Detector
        console.log('1️⃣ Platform Detector...');
        const platform = PlatformDetector.init();
        console.log('   ✅ Platform:', platform.platform);
        
        // Initialize Tour Guide Data
        console.log('2️⃣ Tour Guide Data...');
        const sites = TourGuideData.init();
        console.log('   ✅ Sites:', sites.getAllSites().length);
        
        // Initialize Questions Data
        console.log('3️⃣ Questions Data...');
        const questions = QuestionsData.init();
        console.log('   ✅ Questions:', questions.getAllQuestions().length);
        
        // Initialize API
        console.log('4️⃣ API Module...');
        const api = APIModule.init({ useMockData: true });
        console.log('   ✅ API Ready');
        
        // Initialize Modal
        console.log('5️⃣ Modal Controller...');
        const modal = ModalController.init();
        console.log('   ✅ Modal Ready');
        
        // Initialize Autocomplete
        console.log('6️⃣ Autocomplete...');
        const autocomplete = AutocompleteModule.init({
            inputElement: document.getElementById('mainSearch'),
            sitesData: sites,
            questionsData: questions,
            onSelect: (result) => {
                if (result.type === 'site') {
                    modal.showSiteDetail(result.data);
                } else {
                    modal.showQuestion(result.data);
                }
            }
        });
        console.log('   ✅ Autocomplete Ready');
        
        // Initialize Voice
        console.log('7️⃣ Voice Recognition...');
        const voice = VoiceRecognition.init({
            onCommand: (cmd) => console.log('Voice:', cmd.query)
        });
        console.log('   ✅ Voice Ready');
        
        // Initialize Chat
        console.log('8️⃣ Chat Mode...');
        const chat = ChatMode.init({
            container: document.getElementById('chat-widget'),
            tourGuideData: sites,
            questionsData: questions,
            sendWelcome: false
        });
        console.log('   ✅ Chat Ready');
        
        // Initialize WhatsApp
        console.log('9️⃣ WhatsApp Adapter...');
        const whatsapp = WhatsAppAdapter.init({
            baseUrl: window.location.origin
        });
        console.log('   ✅ WhatsApp Ready');
        
        // Initialize UI Controller
        console.log('🔟 UI Controller...');
        const ui = UIController.init({
            searchInput: document.getElementById('mainSearch'),
            modules: { sites, questions, api, modal, autocomplete }
        });
        console.log('   ✅ UI Ready');
        
        // Load UI
        console.log('🎨 Loading UI...');
        loadCategories(sites);
        loadFeaturedSites(sites, modal, whatsapp);
        updateStats(sites, questions);
        setupButtons(voice, chat, whatsapp);
        
        // Hide loading
        setTimeout(() => {
            document.getElementById('loadingOverlay').classList.add('hidden');
            console.log('✅ APP READY!');
        }, 500);
        
        // Store globally
        window.app = {
            sites, questions, api, modal, autocomplete,
            voice, chat, whatsapp, ui, platform
        };
        
    } catch (error) {
        console.error('❌ INITIALIZATION ERROR:', error);
        alert('Failed to initialize app: ' + error.message);
    }
});

// UI Functions
function loadCategories(sites) {
    const grid = document.getElementById('categoriesGrid');
    if (!grid) return;
    
    const cats = {};
    sites.getAllSites().forEach(s => {
        cats[s.category] = (cats[s.category] || 0) + 1;
    });
    
    const icons = {
        'Sacred Water Tank': '💧', 'Temple': '🛕', 'Museum': '🏛️',
        'Religious Site': '🕉️', 'Historical Site': '📜', 'Garden': '🌳',
        'Lake': '🌊', 'Park': '🏞️', 'Monument': '🗿', 'Cultural Center': '🎭'
    };
    
    grid.innerHTML = Object.entries(cats).slice(0, 8).map(([cat, count]) => `
        <div class="category-card" onclick="filterCategory('${cat}')">
            <div class="category-icon">${icons[cat] || '📍'}</div>
            <div class="category-name">${cat}</div>
            <div class="category-count">${count} sites</div>
        </div>
    `).join('');
}

function loadFeaturedSites(sites, modal, whatsapp) {
    const grid = document.getElementById('featuredSites');
    if (!grid) return;
    
    const featured = sites.getMustVisitSites().slice(0, 6);
    const icons = {
        'Sacred Water Tank': '💧', 'Temple': '🛕', 'Museum': '🏛️',
        'Religious Site': '🕉️', 'Historical Site': '📜', 'Garden': '🌳'
    };
    
    grid.innerHTML = featured.map(site => `
        <div class="site-card" onclick="showSite('${site.id}')">
            <div class="site-image">${icons[site.category] || '📍'}</div>
            <div class="site-content">
                <h3 class="site-title">${site.name}</h3>
                <span class="site-category">${site.category}</span>
                <p class="site-description">${(site.description || 'No description available').substring(0, 120)}...</p>
                <div class="site-actions">
                    <button class="site-action-btn primary" onclick="event.stopPropagation(); showSite('${site.id}')">
                        <i class="fas fa-info-circle"></i> Details
                    </button>
                    <button class="site-action-btn secondary" onclick="event.stopPropagation(); shareSite('${site.id}')">
                        <i class="fab fa-whatsapp"></i> Share
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function updateStats(sites, questions) {
    const all = sites.getAllSites();
    const must = sites.getMustVisitSites();
    const cats = new Set(all.map(s => s.category));
    const qs = questions.getAllQuestions();
    
    document.getElementById('statSites').textContent = all.length;
    document.getElementById('statQuestions').textContent = qs.length + '+';
    document.getElementById('statCategories').textContent = cats.size;
    document.getElementById('statMustVisit').textContent = must.length;
}

function setupButtons(voice, chat, whatsapp) {
    document.getElementById('voiceBtn')?.addEventListener('click', () => {
        if (voice.isListening()) {
            voice.stop();
            document.getElementById('voiceBtn').classList.remove('active');
        } else {
            voice.start();
            document.getElementById('voiceBtn').classList.add('active');
        }
    });
    
    document.getElementById('chatBtn')?.addEventListener('click', () => {
        const widget = document.getElementById('chat-widget');
        const btn = document.getElementById('chatBtn');
        if (widget.classList.contains('active')) {
            widget.classList.remove('active');
            btn.classList.remove('active');
        } else {
            widget.classList.add('active');
            btn.classList.add('active');
            if (chat.getMessageCount() === 0) {
                chat.sendBotMessage('Namaste! 🙏 How can I help you?');
            }
        }
    });
    
    document.getElementById('shareBtn')?.addEventListener('click', () => {
        whatsapp.shareInvitation();
    });
}

// Global functions
function showSite(id) {
    window.app.modal.showSiteDetail(window.app.sites.getSiteById(id));
}

function shareSite(id) {
    window.app.whatsapp.shareSite(window.app.sites.getSiteById(id));
}

function filterCategory(cat) {
    const sites = window.app.sites.getSitesByCategory(cat);
    window.app.modal.open({
        title: `${cat} Sites`,
        size: 'large',
        content: `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:1rem">
            ${sites.map(s => `<div style="background:#f8f9fa;padding:1rem;border-radius:10px;cursor:pointer" onclick="showSite('${s.id}')">
                <h4 style="color:#8B4513">${s.name}</h4>
                <p style="font-size:0.9rem;color:#666">${(s.description || 'No description').substring(0,80)}...</p>
            </div>`).join('')}
        </div>`
    });
}

console.log('📝 App script loaded');
