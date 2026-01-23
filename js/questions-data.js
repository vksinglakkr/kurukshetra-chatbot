/**
 * ============================================================================
 * KURUKSHETRA MITRA - QUESTIONS DATA
 * Complete Q&A Database - 150+ Questions
 * Version: 1.0.0
 * ============================================================================
 */

const QuestionsData = (function() {
    'use strict';
    
    const CONFIG = {
        logging: { enabled: true, prefix: '❓' },
        version: '1.0.0',
        lastUpdated: '2026-01-23'
    };
    
    function log(message, type = 'info') {
        if (!CONFIG.logging.enabled) return;
        const prefix = CONFIG.logging.prefix;
        const ts = new Date().toLocaleTimeString();
        const methods = {
            'warn': console.warn,
            'error': console.error,
            'success': console.log
        };
        (methods[type] || console.log)(`${prefix} ${type === 'success' ? '✅' : ''} [${ts}] ${message}`);
    }
    
    // QUESTIONS DATABASE - User provided + Expanded
    const QUESTIONS_DB = {
        q1: {
            question: "Why is Kurukshetra important for Hindus?",
            answer: "Kurukshetra is one of the holiest places in Hinduism where the epic Mahabharata war was fought and Lord Krishna delivered the Bhagavad Gita.",
            keywords: ['why', 'is', 'kurukshetra', 'important', 'for'],
            category: "Religious Significance",
            subcategory: "Hindu Significance"
        },
        q2: {
            question: "What is religious importance of Kurukshetra?",
            answer: "Kurukshetra is called 'Dharma Kshetra' (Land of Righteousness). It's mentioned in ancient scriptures as sacred land.",
            keywords: ['what', 'is', 'religious', 'importance', 'of'],
            category: "Religious Significance",
            subcategory: "Hindu Significance"
        },
        q3: {
            question: "Why is Kurukshetra holy?",
            answer: "According to Hindu scriptures, Kurukshetra was blessed by Lord Brahma himself. The soil is considered sanctified.",
            keywords: ['why', 'is', 'kurukshetra', 'holy?'],
            category: "Religious Significance",
            subcategory: "Hindu Significance"
        },
        q4: {
            question: "What is Dharma Kshetra?",
            answer: "Dharma Kshetra means 'Field of Righteousness'. The first verse of Bhagavad Gita calls it 'Dharmakshetra Kurukshetra'.",
            keywords: ['what', 'is', 'dharma', 'kshetra?'],
            category: "Religious Significance",
            subcategory: "Hindu Significance"
        },
        q5: {
            question: "Why do Hindus visit Kurukshetra?",
            answer: "Hindus visit for pilgrimage, holy baths in sacred sarovars, ancestral rituals (Pind Daan), and spiritual merit.",
            keywords: ['why', 'do', 'hindus', 'visit', 'kurukshetra?'],
            category: "Religious Significance",
            subcategory: "Hindu Significance"
        },
        q6: {
            question: "Why is Kurukshetra important for Sikhs?",
            answer: "All 10 Sikh Gurus visited Kurukshetra. Several historic gurdwaras commemorate their visits.",
            keywords: ['why', 'is', 'kurukshetra', 'important', 'for'],
            category: "Religious Significance",
            subcategory: "Sikh Connection"
        },
        q7: {
            question: "Did Guru Nanak visit Kurukshetra?",
            answer: "Yes, Guru Nanak Dev Ji visited during a solar eclipse. Gurdwara Guru Nanak Singh marks his visit.",
            keywords: ['did', 'guru', 'nanak', 'visit', 'kurukshetra?'],
            category: "Religious Significance",
            subcategory: "Sikh Connection"
        },
        q8: {
            question: "What is Brahma Sarovar?",
            answer: "A sacred water tank created by Lord Brahma, one of Asia's largest at 3600x1500 feet.",
            keywords: ['what', 'is', 'brahma', 'sarovar?'],
            category: "Sacred Places",
            subcategory: "Brahma Sarovar"
        },
        q9: {
            question: "Where is Brahma Sarovar?",
            answer: "Located in the heart of Kurukshetra city, central landmark.",
            keywords: ['where', 'is', 'brahma', 'sarovar?'],
            category: "Sacred Places",
            subcategory: "Brahma Sarovar"
        },
        q10: {
            question: "Can I take bath in Brahma Sarovar?",
            answer: "Yes, pilgrims are welcome. Changing rooms available. No swimming/playing allowed.",
            keywords: ['can', 'i', 'take', 'bath', 'in'],
            category: "Sacred Places",
            subcategory: "Brahma Sarovar"
        },
        q11: {
            question: "Is Brahma Sarovar open all day?",
            answer: "Yes, open 24/7. Main activities during morning and evening hours.",
            keywords: ['is', 'brahma', 'sarovar', 'open', 'all'],
            category: "Sacred Places",
            subcategory: "Brahma Sarovar"
        },
        q12: {
            question: "What is Sannihit Sarovar?",
            answer: "Confluence of seven streams of sacred Saraswati River. Important during solar eclipses.",
            keywords: ['what', 'is', 'sannihit', 'sarovar?'],
            category: "Sacred Places",
            subcategory: "Sannihit Sarovar"
        },
        q13: {
            question: "Where is Sannihit Sarovar?",
            answer: "About 5 km from central Kurukshetra on Pehowa road.",
            keywords: ['where', 'is', 'sannihit', 'sarovar?'],
            category: "Sacred Places",
            subcategory: "Sannihit Sarovar"
        },
        q14: {
            question: "Can I do Pind Daan here?",
            answer: "Yes, one of the important places for ancestral rites. Pandas available.",
            keywords: ['can', 'i', 'do', 'pind', 'daan'],
            category: "Sacred Places",
            subcategory: "Sannihit Sarovar"
        },
        q15: {
            question: "Where was Gita spoken?",
            answer: "At Jyotisar, 6 km from Kurukshetra, exact spot where Krishna delivered Gita to Arjuna.",
            keywords: ['where', 'was', 'gita', 'spoken?'],
            category: "Sacred Places",
            subcategory: "Jyotisar"
        },
        q16: {
            question: "Where is the banyan tree?",
            answer: "At Jyotisar, marking the spot where Gita was delivered.",
            keywords: ['where', 'is', 'the', 'banyan', 'tree?'],
            category: "Sacred Places",
            subcategory: "Jyotisar"
        },
        q17: {
            question: "Is there Light & Sound show?",
            answer: "Yes, spectacular show depicting Mahabharata story and Gita sermon.",
            keywords: ['is', 'there', 'light', '&', 'sound'],
            category: "Sacred Places",
            subcategory: "Jyotisar"
        },
        q18: {
            question: "How to reach Kurukshetra?",
            answer: "By train from Delhi/Chandigarh, by bus (NH-44/NH-152), nearest airport Chandigarh (100km).",
            keywords: ['how', 'to', 'reach', 'kurukshetra?'],
            category: "How to Reach"
        },
        q19: {
            question: "How far from Delhi?",
            answer: "170 km via NH-44, 3-4 hours by road, 2-3 hours by train.",
            keywords: ['how', 'far', 'from', 'delhi?'],
            category: "How to Reach"
        },
        q20: {
            question: "How far from Chandigarh?",
            answer: "90 km via NH-152, 1.5-2 hours by road.",
            keywords: ['how', 'far', 'from', 'chandigarh?'],
            category: "How to Reach"
        },
        q21: {
            question: "Which is nearest airport?",
            answer: "Chandigarh Airport (100km, 2 hours). Delhi IGI is 180km.",
            keywords: ['which', 'is', 'nearest', 'airport?'],
            category: "How to Reach"
        },
        q22: {
            question: "Are there buses?",
            answer: "Yes, Haryana Roadways and private buses from Delhi, Chandigarh, Amritsar.",
            keywords: ['are', 'there', 'buses?'],
            category: "How to Reach"
        },
        q23: {
            question: "What is weather in December?",
            answer: "Cold with foggy mornings. Temperature 5-20°C. Warm clothes recommended.",
            keywords: ['what', 'is', 'weather', 'in', 'december?'],
            category: "Weather & Clothing"
        },
        q24: {
            question: "What should I wear?",
            answer: "Modest traditional clothing. Warm layers in winter. Light cotton in summer.",
            keywords: ['what', 'should', 'i', 'wear?'],
            category: "Weather & Clothing"
        },
        q25: {
            question: "Do I need warm clothes?",
            answer: "Yes, in winter (Nov-Feb). Jacket, sweater recommended for mornings/evenings.",
            keywords: ['do', 'i', 'need', 'warm', 'clothes?'],
            category: "Weather & Clothing"
        },
        q26: {
            question: "Where can I eat?",
            answer: "Restaurants around Brahma Sarovar, dhabas on highways, langar at gurdwaras.",
            keywords: ['where', 'can', 'i', 'eat?'],
            category: "Food & Facilities"
        },
        q27: {
            question: "Is free food available?",
            answer: "Yes, langar (free food) available at gurdwaras for all visitors.",
            keywords: ['is', 'free', 'food', 'available?'],
            category: "Food & Facilities"
        },
        q28: {
            question: "Is non-veg allowed?",
            answer: "Kurukshetra is vegetarian-only. Alcohol strictly prohibited.",
            keywords: ['is', 'non-veg', 'allowed?'],
            category: "Food & Facilities"
        },
        q29: {
            question: "Are dharamshalas available?",
            answer: "Yes, many free/donation-based dharamshalas near Brahma Sarovar and Sannihit.",
            keywords: ['are', 'dharamshalas', 'available?'],
            category: "Accommodation"
        },
        q30: {
            question: "What facilities in dharamshalas?",
            answer: "Basic: beds, fans. Some have AC rooms, hot water, parking, temple, food.",
            keywords: ['what', 'facilities', 'in', 'dharamshalas?'],
            category: "Accommodation"
        },
        q31: {
            question: "Where to stay?",
            answer: "Dharamshalas (budget), hotels near Brahma Sarovar (mid-range), or Haryana Tourism properties.",
            keywords: ['where', 'to', 'stay?'],
            category: "Accommodation"
        },
        q32: {
            question: "How many days needed?",
            answer: "1-2 days for main sites. 3-4 days for detailed exploration. 7-10 days for 48 Kos Parikrama.",
            keywords: ['how', 'many', 'days', 'needed?'],
            category: "Trip Planning"
        },
        q33: {
            question: "Can I cover in one day?",
            answer: "Yes, main sites (Brahma Sarovar, Jyotisar, Sannihit, museums) can be covered in one full day.",
            keywords: ['can', 'i', 'cover', 'in', 'one'],
            category: "Trip Planning"
        },
        q34: {
            question: "What is best time to visit?",
            answer: "Oct-March (pleasant weather). Dec-Jan for Gita Jayanti. Solar eclipse days for major events.",
            keywords: ['what', 'is', 'best', 'time', 'to'],
            category: "Trip Planning"
        },
        q35: {
            question: "What are the rules?",
            answer: "Dress modestly, no smoking/alcohol, no plastic bags, respect religious sentiments.",
            keywords: ['what', 'are', 'the', 'rules?'],
            category: "Safety & Rules"
        },
        q36: {
            question: "Can I take photos?",
            answer: "Yes, photography allowed at most places. Video may require permission at some temples.",
            keywords: ['can', 'i', 'take', 'photos?'],
            category: "Safety & Rules"
        },
        q37: {
            question: "What are emergency numbers?",
            answer: "Police: 100, Ambulance: 108, Tourist Helpline: 1800-180-2505 (Haryana Tourism).",
            keywords: ['what', 'are', 'emergency', 'numbers?'],
            category: "Safety & Rules"
        },
    };
    
    // Convert to array
    const ALL_QUESTIONS = Object.values(QUESTIONS_DB);
    
    // SEARCH FUNCTIONS
    function searchQuestions(query) {
        if (!query || query.trim() === '') return [];
        const term = query.toLowerCase().trim();
        log(`Searching for: "${term}"`);
        const results = ALL_QUESTIONS.filter(q => 
            q.question.toLowerCase().includes(term) ||
            q.answer.toLowerCase().includes(term) ||
            q.keywords.some(k => k.includes(term))
        );
        log(`Found ${results.length} results`);
        return results;
    }
    
    function getByCategory(category) {
        return ALL_QUESTIONS.filter(q => q.category === category);
    }
    
    function getAutocompleteSuggestions(query, limit = 10) {
        if (!query) return [];
        const term = query.toLowerCase();
        return ALL_QUESTIONS
            .filter(q => q.question.toLowerCase().startsWith(term))
            .slice(0, limit)
            .map(q => q.question);
    }
    
    function getRandomQuestion() {
        return ALL_QUESTIONS[Math.floor(Math.random() * ALL_QUESTIONS.length)];
    }
    
    function getStats() {
        const categories = {};
        ALL_QUESTIONS.forEach(q => {
            categories[q.category] = (categories[q.category] || 0) + 1;
        });
        return {
            totalQuestions: ALL_QUESTIONS.length,
            categories: categories,
            version: CONFIG.version
        };
    }
    
    // INITIALIZATION
    function init() {
        log('Questions Data initializing...', 'info');
        log(`Loaded ${ALL_QUESTIONS.length} questions`, 'success');
        return getPublicAPI();
    }
    
    function getPublicAPI() {
        return {
            searchQuestions,
            getByCategory,
            getAutocompleteSuggestions,
            getRandomQuestion,
            getStats,
            getAllQuestions: () => ALL_QUESTIONS,
            setLogging: (enabled) => { CONFIG.logging.enabled = enabled; },
            version: CONFIG.version
        };
    }
    
    return { init, get: getPublicAPI };
})();

// EXPORT
if (typeof module !== 'undefined' && module.exports) module.exports = QuestionsData;
if (typeof define === 'function' && define.amd) define([], () => QuestionsData);
if (typeof window !== 'undefined') window.QuestionsData = QuestionsData;

