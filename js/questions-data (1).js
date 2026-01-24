/**
 * QUESTIONS DATA - All questions organized by submenu
 * Total: 320+ questions across 10 submenus
 * Last Updated: January 24, 2026
 */

const QuestionsData = (function() {
    'use strict';
    
    const QUESTIONS_DATABASE = {
        
        // =====================================================
        // TAB 1: HERITAGE & TOURISM
        // =====================================================
        
        /**
         * SUBMENU 1: Gita Wisdom & Spirituality (50+ questions)
         */
        "gita_wisdom": [
            // Basic Teachings
            {id: "gita_1", question: "What is the main message of Bhagavad Gita?", category: "Basic Teachings", type: "ai"},
            {id: "gita_2", question: "Who spoke the Bhagavad Gita and to whom?", category: "Basic Teachings", type: "ai"},
            {id: "gita_3", question: "What is Dharma according to Gita?", category: "Basic Teachings", type: "ai"},
            {id: "gita_4", question: "What does Gita say about Karma?", category: "Basic Teachings", type: "ai"},
            {id: "gita_5", question: "How many chapters are there in Bhagavad Gita?", category: "Basic Teachings", type: "ai"},
            
            // Daily Life Application
            {id: "gita_10", question: "How can I apply Gita teachings in daily life?", category: "Daily Life", type: "ai"},
            {id: "gita_11", question: "What does Gita say about controlling anger?", category: "Daily Life", type: "ai"},
            {id: "gita_12", question: "How to overcome fear according to Gita?", category: "Daily Life", type: "ai"},
            {id: "gita_13", question: "What is the Gita's advice on dealing with stress?", category: "Daily Life", type: "ai"},
            {id: "gita_14", question: "How to find peace of mind as per Gita?", category: "Daily Life", type: "ai"},
            
            // Relationships
            {id: "gita_20", question: "What does Gita teach about relationships?", category: "Relationships", type: "ai"},
            {id: "gita_21", question: "How to deal with difficult people as per Gita?", category: "Relationships", type: "ai"},
            {id: "gita_22", question: "What is true friendship according to Gita?", category: "Relationships", type: "ai"},
            {id: "gita_23", question: "How should parents guide children per Gita?", category: "Relationships", type: "ai"},
            
            // Work & Career
            {id: "gita_30", question: "What is Karma Yoga?", category: "Work", type: "ai"},
            {id: "gita_31", question: "How to work without attachment to results?", category: "Work", type: "ai"},
            {id: "gita_32", question: "Should I change my career if unhappy?", category: "Work", type: "ai"},
            {id: "gita_33", question: "How to balance work and spirituality?", category: "Work", type: "ai"},
            
            // Spirituality
            {id: "gita_40", question: "What is meditation according to Gita?", category: "Spirituality", type: "ai"},
            {id: "gita_41", question: "How to start practicing Bhakti Yoga?", category: "Spirituality", type: "ai"},
            {id: "gita_42", question: "What is the path to self-realization?", category: "Spirituality", type: "ai"},
            {id: "gita_43", question: "Explain the concept of Atman and Brahman", category: "Spirituality", type: "ai"}
        ],
        
        /**
         * SUBMENU 2: Temples, Museums & Sites (Handled by Tour Guide Data)
         * This uses the tour-guide-data.js module
         */
        "temples_sites": [],  // Empty - handled by TourGuideData module
        
        /**
         * SUBMENU 3: Stay, Food & Travel (40+ questions)
         */
        "stay_travel": [
            // Accommodation
            {id: "stay_1", question: "Best hotels in Kurukshetra?", category: "Accommodation", type: "database"},
            {id: "stay_2", question: "Dharamshala near Brahma Sarovar?", category: "Accommodation", type: "database"},
            {id: "stay_3", question: "Budget accommodation options?", category: "Accommodation", type: "database"},
            {id: "stay_4", question: "Luxury hotels in Kurukshetra?", category: "Accommodation", type: "database"},
            {id: "stay_5", question: "Places to stay near Jyotisar?", category: "Accommodation", type: "database"},
            {id: "stay_6", question: "Hotel booking contact numbers?", category: "Accommodation", type: "database"},
            {id: "stay_7", question: "Guest houses for pilgrims?", category: "Accommodation", type: "database"},
            
            // Food & Restaurants
            {id: "food_1", question: "Best restaurants in Kurukshetra?", category: "Food", type: "database"},
            {id: "food_2", question: "Where to get vegetarian food?", category: "Food", type: "database"},
            {id: "food_3", question: "Local food specialties?", category: "Food", type: "database"},
            {id: "food_4", question: "Prasad available at temples?", category: "Food", type: "database"},
            {id: "food_5", question: "Street food places?", category: "Food", type: "database"},
            {id: "food_6", question: "Restaurants near Brahma Sarovar?", category: "Food", type: "database"},
            
            // Transport
            {id: "travel_1", question: "How to reach Kurukshetra from Delhi?", category: "Transport", type: "database"},
            {id: "travel_2", question: "Nearest airport to Kurukshetra?", category: "Transport", type: "database"},
            {id: "travel_3", question: "Train connectivity to Kurukshetra?", category: "Transport", type: "database"},
            {id: "travel_4", question: "Bus services to Kurukshetra?", category: "Transport", type: "database"},
            {id: "travel_5", question: "Local transport options?", category: "Transport", type: "database"},
            {id: "travel_6", question: "Auto rickshaw rates?", category: "Transport", type: "database"},
            {id: "travel_7", question: "Taxi booking services?", category: "Transport", type: "database"},
            {id: "travel_8", question: "Distance from Chandigarh?", category: "Transport", type: "database"},
            
            // Facilities
            {id: "facility_1", question: "Parking facilities near temples?", category: "Facilities", type: "database"},
            {id: "facility_2", question: "Wheelchair accessibility?", category: "Facilities", type: "database"},
            {id: "facility_3", question: "Washroom facilities for tourists?", category: "Facilities", type: "database"},
            {id: "facility_4", question: "ATM locations?", category: "Facilities", type: "database"},
            {id: "facility_5", question: "Medical facilities nearby?", category: "Facilities", type: "database"}
        ],
        
        /**
         * SUBMENU 4: Festivals & Events (30+ questions)
         */
        "festivals_events": [
            {id: "event_1", question: "When is Gita Jayanti celebrated?", category: "Major Festivals", type: "database"},
            {id: "event_2", question: "Solar Eclipse rituals at Brahma Sarovar?", category: "Major Festivals", type: "database"},
            {id: "event_3", question: "Somavati Amavasya celebrations?", category: "Major Festivals", type: "database"},
            {id: "event_4", question: "Gita Mahotsav events and schedule?", category: "Major Festivals", type: "database"},
            {id: "event_5", question: "Kartik Purnima at Sannihit Sarovar?", category: "Major Festivals", type: "database"},
            {id: "event_6", question: "Annakut festival celebration?", category: "Major Festivals", type: "database"},
            {id: "event_7", question: "Baisakhi mela dates and events?", category: "Major Festivals", type: "database"},
            {id: "event_8", question: "Navratri celebrations in temples?", category: "Major Festivals", type: "database"},
            {id: "event_9", question: "Janmashtami special programs?", category: "Major Festivals", type: "database"},
            {id: "event_10", question: "Mahashivratri rituals and timing?", category: "Major Festivals", type: "database"},
            
            // Cultural Programs
            {id: "event_20", question: "Cultural programs at Panorama?", category: "Cultural", type: "database"},
            {id: "event_21", question: "Light and sound show timings?", category: "Cultural", type: "database"},
            {id: "event_22", question: "Classical music concerts schedule?", category: "Cultural", type: "database"},
            {id: "event_23", question: "Traditional dance performances?", category: "Cultural", type: "database"},
            
            // Annual Events
            {id: "event_30", question: "Kurukshetra Fair dates?", category: "Annual Events", type: "database"},
            {id: "event_31", question: "International Gita Seminar schedule?", category: "Annual Events", type: "database"},
            {id: "event_32", question: "Yoga Day celebrations?", category: "Annual Events", type: "database"}
        ],
        
        /**
         * SUBMENU 5: Heritage Research (40+ questions)
         */
        "heritage_research": [
            {id: "research_1", question: "Archaeological evidence of Mahabharata war?", category: "Historical", type: "ai"},
            {id: "research_2", question: "Historical significance of Kurukshetra?", category: "Historical", type: "ai"},
            {id: "research_3", question: "Dating of Kurukshetra sites?", category: "Historical", type: "ai"},
            {id: "research_4", question: "Ancient texts mentioning Kurukshetra?", category: "Historical", type: "ai"},
            {id: "research_5", question: "Comparison of all Sarovars significance?", category: "Comparative", type: "ai"},
            {id: "research_6", question: "Evolution of temple architecture here?", category: "Architecture", type: "ai"},
            {id: "research_7", question: "Research papers on Gita philosophy?", category: "Philosophy", type: "ai"},
            {id: "research_8", question: "Geographical importance of Kurukshetra?", category: "Geography", type: "ai"},
            {id: "research_9", question: "Kurukshetra in Vedic literature?", category: "Literature", type: "ai"},
            {id: "research_10", question: "Timeline of major historical events?", category: "Historical", type: "ai"}
        ],
        
        // =====================================================
        // TAB 2: ADMINISTRATION & SERVICES
        // =====================================================
        
        /**
         * SUBMENU 6: Demographics & Statistics (External links)
         */
        "demographics": [
            {id: "demo_1", question: "Population of Kurukshetra?", category: "Population", type: "external", url: "https://haryanaepaper.com"},
            {id: "demo_2", question: "Area and geographical boundaries?", category: "Geography", type: "external"},
            {id: "demo_3", question: "Literacy rate statistics?", category: "Education", type: "external"},
            {id: "demo_4", question: "Economic indicators?", category: "Economy", type: "external"},
            {id: "demo_5", question: "Urban vs rural population?", category: "Population", type: "external"},
            {id: "demo_6", question: "Development indices?", category: "Development", type: "external"}
        ],
        
        /**
         * SUBMENU 7: Government Offices & Services (30+ questions)
         */
        "government": [
            // Municipal Services
            {id: "gov_1", question: "Municipal Corporation office location?", category: "Municipal", type: "database"},
            {id: "gov_2", question: "Property tax payment process?", category: "Municipal", type: "database"},
            {id: "gov_3", question: "Birth certificate application?", category: "Municipal", type: "database"},
            {id: "gov_4", question: "Death certificate process?", category: "Municipal", type: "database"},
            {id: "gov_5", question: "Marriage registration?", category: "Municipal", type: "database"},
            
            // Revenue Services
            {id: "gov_10", question: "Tehsil office timings and location?", category: "Revenue", type: "database"},
            {id: "gov_11", question: "Land records access?", category: "Revenue", type: "database"},
            {id: "gov_12", question: "Property mutation process?", category: "Revenue", type: "database"},
            
            // Police & Law
            {id: "gov_20", question: "Police station locations?", category: "Police", type: "database"},
            {id: "gov_21", question: "FIR filing process?", category: "Police", type: "database"},
            {id: "gov_22", question: "Passport office location?", category: "Documents", type: "database"},
            
            // Public Services
            {id: "gov_30", question: "Aadhaar enrollment center?", category: "Documents", type: "database"},
            {id: "gov_31", question: "Ration card application?", category: "Welfare", type: "database"},
            {id: "gov_32", question: "Voter ID card process?", category: "Documents", type: "database"}
        ],
        
        /**
         * SUBMENU 8: Education & Healthcare (40+ questions)
         */
        "education_health": [
            // Education
            {id: "edu_1", question: "Top schools in Kurukshetra?", category: "Education", type: "database"},
            {id: "edu_2", question: "Kurukshetra University admission process?", category: "Education", type: "database"},
            {id: "edu_3", question: "NIT Kurukshetra courses offered?", category: "Education", type: "database"},
            {id: "edu_4", question: "Coaching centers for competitive exams?", category: "Education", type: "database"},
            {id: "edu_5", question: "Government College for Girls admission?", category: "Education", type: "database"},
            {id: "edu_6", question: "Private schools and fees?", category: "Education", type: "database"},
            {id: "edu_7", question: "Vocational training institutes?", category: "Education", type: "database"},
            
            // Healthcare
            {id: "health_1", question: "List of hospitals in Kurukshetra?", category: "Healthcare", type: "database"},
            {id: "health_2", question: "Government hospital facilities?", category: "Healthcare", type: "database"},
            {id: "health_3", question: "Private hospitals and specialties?", category: "Healthcare", type: "database"},
            {id: "health_4", question: "24-hour emergency services?", category: "Healthcare", type: "database"},
            {id: "health_5", question: "Blood bank locations?", category: "Healthcare", type: "database"},
            {id: "health_6", question: "Ambulance services contact?", category: "Healthcare", type: "database"},
            {id: "health_7", question: "Diagnostic centers?", category: "Healthcare", type: "database"},
            {id: "health_8", question: "Pharmacy locations?", category: "Healthcare", type: "database"},
            {id: "health_9", question: "Maternity hospitals?", category: "Healthcare", type: "database"},
            {id: "health_10", question: "Pediatric specialists?", category: "Healthcare", type: "database"}
        ],
        
        /**
         * SUBMENU 9: Infrastructure & Utilities (30+ questions)
         */
        "infrastructure": [
            // Transport
            {id: "infra_1", question: "Bus routes and schedule?", category: "Transport", type: "database"},
            {id: "infra_2", question: "Vehicle registration office?", category: "Transport", type: "database"},
            {id: "infra_3", question: "Driving license application?", category: "Transport", type: "database"},
            {id: "infra_4", question: "Auto rickshaw stands?", category: "Transport", type: "database"},
            
            // Utilities
            {id: "infra_10", question: "Electricity board office?", category: "Utilities", type: "database"},
            {id: "infra_11", question: "New electricity connection?", category: "Utilities", type: "database"},
            {id: "infra_12", question: "Water supply department?", category: "Utilities", type: "database"},
            {id: "infra_13", question: "Gas agency locations?", category: "Utilities", type: "database"},
            {id: "infra_14", question: "LPG new connection?", category: "Utilities", type: "database"},
            {id: "infra_15", question: "Broadband internet providers?", category: "Utilities", type: "database"},
            {id: "infra_16", question: "Post office locations?", category: "Utilities", type: "database"}
        ],
        
        /**
         * SUBMENU 10: Administrative Research (20+ questions)
         */
        "admin_research": [
            {id: "admin_1", question: "City development projects?", category: "Development", type: "ai"},
            {id: "admin_2", question: "Urban planning initiatives?", category: "Planning", type: "ai"},
            {id: "admin_3", question: "Budget allocations for infrastructure?", category: "Finance", type: "ai"},
            {id: "admin_4", question: "Smart city projects in Kurukshetra?", category: "Development", type: "ai"},
            {id: "admin_5", question: "Administrative structure hierarchy?", category: "Governance", type: "ai"},
            {id: "admin_6", question: "Municipal committees and functions?", category: "Governance", type: "ai"},
            {id: "admin_7", question: "Public grievance redressal system?", category: "Services", type: "ai"},
            {id: "admin_8", question: "Transparency and RTI process?", category: "Governance", type: "ai"}
        ]
    };
    
    // Flatten all questions for search
    const ALL_QUESTIONS = [];
    Object.keys(QUESTIONS_DATABASE).forEach(submenu => {
        QUESTIONS_DATABASE[submenu].forEach(q => {
            ALL_QUESTIONS.push({
                ...q,
                submenu: submenu
            });
        });
    });
    
    // Public API
    return {
        /**
         * Get questions by submenu
         */
        getQuestionsBySubmenu(submenu) {
            return QUESTIONS_DATABASE[submenu] || [];
        },
        
        /**
         * Get all questions
         */
        getAllQuestions() {
            return ALL_QUESTIONS;
        },
        
        /**
         * Search questions
         */
        searchQuestions(query) {
            const q = query.toLowerCase();
            return ALL_QUESTIONS.filter(question => 
                question.question.toLowerCase().includes(q) ||
                (question.category && question.category.toLowerCase().includes(q))
            );
        },
        
        /**
         * Get autocomplete suggestions
         */
        getAutocompleteSuggestions(query, submenu = null, limit = 10) {
            if (!query || query.length < 2) return [];
            
            let questions = submenu ? 
                this.getQuestionsBySubmenu(submenu) : 
                ALL_QUESTIONS;
            
            const results = questions.filter(q => 
                q.question.toLowerCase().includes(query.toLowerCase())
            ).slice(0, limit);
            
            return results.map(q => ({
                type: 'question',
                id: q.id,
                title: q.question,
                subtitle: q.category || q.submenu,
                queryType: q.type,
                data: q
            }));
        },
        
        /**
         * Get questions by category
         */
        getQuestionsByCategory(category) {
            return ALL_QUESTIONS.filter(q => q.category === category);
        }
    };
})();

// Make available globally
if (typeof window !== 'undefined') {
    window.QuestionsData = QuestionsData;
}
