/**
 * ============================================================================
 * KURUKSHETRA MITRA - TOUR GUIDE DATA
 * Complete Database of 90 Heritage Sites
 * Version: 2.0.0
 * ============================================================================
 * 
 * This module contains structured data for all tourist sites in Kurukshetra,
 * extracted from kkrtour.com viewall.html
 * 
 * Features:
 * - 90 sites across 17 categories
 * - Search and filter functions
 * - Category organization
 * - Must-visit site flags
 * - Console logging for debugging
 * 
 * Data Source: kkrtour.com (Kurukshetra Tourism Official Website)
 * Last Updated: January 23, 2026
 */

const TourGuideData = (function() {
    'use strict';
    
    // =========================================================================
    // CONFIGURATION
    // =========================================================================
    
    const CONFIG = {
        logging: {
            enabled: true,
            prefix: '🗺️'
        },
        version: '2.0.0',
        dataSource: 'kkrtour.com',
        lastUpdated: '2026-01-23'
    };
    
    // =========================================================================
    // LOGGING
    // =========================================================================
    
    function log(message, type = 'info') {
        if (!CONFIG.logging.enabled) return;
        
        const prefix = CONFIG.logging.prefix;
        const timestamp = new Date().toLocaleTimeString();
        
        switch(type) {
            case 'warn':
                console.warn(`${prefix} [${timestamp}] ${message}`);
                break;
            case 'error':
                console.error(`${prefix} [${timestamp}] ${message}`);
                break;
            case 'success':
                console.log(`${prefix} ✅ [${timestamp}] ${message}`);
                break;
            default:
                console.log(`${prefix} [${timestamp}] ${message}`);
        }
    }
    
    // =========================================================================
    // CATEGORIES DATA
    // =========================================================================
    
    const CATEGORIES = [
        {
            id: 1,
            name: 'Major Mahabharata Sites',
            icon: '🕉️',
            description: 'Primary sites from the Mahabharata epic',
            count: 14
        },
        {
            id: 2,
            name: 'Museums & Cultural Centers',
            icon: '🏛️',
            description: 'Educational and cultural institutions',
            count: 6
        },
        {
            id: 3,
            name: 'Sikh Heritage (Gurdwaras)',
            icon: '🙏',
            description: 'Important Sikh religious sites',
            count: 4
        },
        {
            id: 4,
            name: 'Shiva Temples & Tirthas',
            icon: '🔱',
            description: 'Temples and pilgrimage sites dedicated to Lord Shiva',
            count: 7
        },
        {
            id: 5,
            name: 'Goddess/Shakti Sites',
            icon: '🌸',
            description: 'Temples dedicated to goddesses and divine feminine',
            count: 5
        },
        {
            id: 6,
            name: 'Brahma & Creation Sites',
            icon: '📿',
            description: 'Sites related to Lord Brahma and creation',
            count: 4
        },
        {
            id: 7,
            name: 'Vishnu/Avatar Sites',
            icon: '💠',
            description: 'Temples dedicated to Lord Vishnu and avatars',
            count: 3
        },
        {
            id: 8,
            name: 'Ancestral Worship Tirthas',
            icon: '🪷',
            description: 'Sacred sites for ancestral rituals (Pind Daan)',
            count: 8
        },
        {
            id: 9,
            name: 'Sun Worship Sites',
            icon: '☀️',
            description: 'Sites dedicated to Surya (Sun God)',
            count: 2
        },
        {
            id: 10,
            name: 'Sage & Puranic Sites',
            icon: '🧘',
            description: 'Sites associated with sages and ancient texts',
            count: 6
        },
        {
            id: 11,
            name: 'Merit & Purification Tirthas',
            icon: '✨',
            description: 'Sacred waters for spiritual purification',
            count: 5
        },
        {
            id: 12,
            name: 'Village Tirthas (48 Kos Circuit)',
            icon: '🏘️',
            description: 'Pilgrimage sites in surrounding villages',
            count: 8
        },
        {
            id: 13,
            name: 'Pilgrimage Routes',
            icon: '🛤️',
            description: 'Traditional pilgrimage pathways',
            count: 2
        },
        {
            id: 14,
            name: 'Dharmashalas & Lodging',
            icon: '🏨',
            description: 'Religious rest houses for pilgrims',
            count: 5
        },
        {
            id: 15,
            name: 'Historical Monuments',
            icon: '🏛️',
            description: 'Historical architectural sites',
            count: 4
        },
        {
            id: 16,
            name: 'Astronomical & Time Concepts',
            icon: '🌌',
            description: 'Sites related to astronomy and time',
            count: 3
        },
        {
            id: 17,
            name: 'Natural Sites',
            icon: '🌳',
            description: 'Natural landmarks and sacred groves',
            count: 4
        }
    ];
    
    // =========================================================================
    // SITES DATA (All 90 sites from kkrtour.com)
    // =========================================================================
    
    const SITES = [// Total unique sites: 79

        {
            id: 1,
            name: 'Jyotisar',
            category: 'Major Mahabharata Sites',
            categoryIcon: '🕉️',
            mustVisit: true,
            keywords: ['jyotisar']
        },
        {
            id: 2,
            name: 'Brahma Sarovar',
            category: 'Major Mahabharata Sites',
            categoryIcon: '🕉️',
            mustVisit: true,
            keywords: ['sarovar', 'brahma']
        },
        {
            id: 3,
            name: 'Krishna Arjun Rath',
            category: 'Major Mahabharata Sites',
            categoryIcon: '🕉️',
            mustVisit: true,
            keywords: ['krishna', 'arjun', 'rath']
        },
        {
            id: 4,
            name: 'Sri Krishna Museum',
            category: 'Major Mahabharata Sites',
            categoryIcon: '🕉️',
            mustVisit: false,
            keywords: ['krishna', 'sri', 'museum']
        },
        {
            id: 5,
            name: 'Shri Devikoop Bhadrakali Shaktipeeth',
            category: 'Major Mahabharata Sites',
            categoryIcon: '🕉️',
            mustVisit: false,
            keywords: ['shaktipeeth', 'shri', 'devikoop', 'bhadrakali']
        },
        {
            id: 6,
            name: 'Sthaneshwar Mahadev Mandir',
            category: 'Major Mahabharata Sites',
            categoryIcon: '🕉️',
            mustVisit: true,
            keywords: ['mandir', 'sthaneshwar', 'mahadev']
        },
        {
            id: 7,
            name: 'Sannihit Sarovar',
            category: 'Major Mahabharata Sites',
            categoryIcon: '🕉️',
            mustVisit: true,
            keywords: ['sannihit', 'sarovar']
        },
        {
            id: 8,
            name: 'Karn Ka Tila',
            category: 'Major Mahabharata Sites',
            categoryIcon: '🕉️',
            mustVisit: false,
            keywords: ['ka', 'karn', 'tila']
        },
        {
            id: 9,
            name: 'Harsh Ka Tila',
            category: 'Major Mahabharata Sites',
            categoryIcon: '🕉️',
            mustVisit: false,
            keywords: ['harsh', 'ka', 'tila']
        },
        {
            id: 10,
            name: 'Panorama & Science Centre',
            category: 'Major Mahabharata Sites',
            categoryIcon: '🕉️',
            mustVisit: false,
            keywords: ['centre', '&', 'panorama', 'science']
        },
        {
            id: 11,
            name: 'Sheikh Chaheli Tomb (Mughal)',
            category: 'Heritage & Archaeological Sites',
            categoryIcon: '🏰',
            mustVisit: false,
            keywords: ['sheikh', 'mughal', 'tomb', 'chaheli']
        },
        {
            id: 12,
            name: 'Lakshmi Narayan Mandir (Birla)',
            category: 'Vishnu/Avatar Sites',
            categoryIcon: '💠',
            mustVisit: false,
            keywords: ['birla', 'lakshmi', 'mandir', 'narayan']
        },
        {
            id: 13,
            name: 'Baba Shrawan Nath Haveli',
            category: 'Goddess/Shakti Sites',
            categoryIcon: '🌸',
            mustVisit: false,
            keywords: ['baba', 'nath', 'shrawan', 'haveli']
        },
        {
            id: 14,
            name: 'Tirupati Balaji Mandir',
            category: 'Vishnu/Avatar Sites',
            categoryIcon: '💠',
            mustVisit: false,
            keywords: ['tirupati', 'balaji', 'mandir']
        },
        {
            id: 15,
            name: 'Anubhav Kendra',
            category: 'Major Mahabharata Sites',
            categoryIcon: '🕉️',
            mustVisit: false,
            keywords: ['anubhav', 'kendra']
        },
        {
            id: 16,
            name: 'Baba Kali Kamli Mandir',
            category: 'Goddess/Shakti Sites',
            categoryIcon: '🌸',
            mustVisit: false,
            keywords: ['kali', 'baba', 'kamli', 'mandir']
        },
        {
            id: 17,
            name: 'Rantuk Yaksha (Guardian East)',
            category: 'Sage & Puranic Sites',
            categoryIcon: '🧘',
            mustVisit: false,
            keywords: ['yaksha', 'east', 'guardian', 'rantuk']
        },
        {
            id: 18,
            name: 'Kalashvar Mahadev Mandir',
            category: 'Shiva Temples & Tirthas',
            categoryIcon: '🔱',
            mustVisit: false,
            keywords: ['kalashvar', 'mandir', 'mahadev']
        },
        {
            id: 19,
            name: 'Sri Vyas Gaudiya Math',
            category: 'Educational Institutions',
            categoryIcon: '📚',
            mustVisit: false,
            keywords: ['gaudiya', 'math', 'sri', 'vyas']
        },
        {
            id: 20,
            name: 'Jairam Vidyapeeth',
            category: 'Educational Institutions',
            categoryIcon: '📚',
            mustVisit: false,
            keywords: ['vidyapeeth', 'jairam']
        },
        {
            id: 21,
            name: 'Gita Gyan Sansthanam',
            category: 'Educational Institutions',
            categoryIcon: '📚',
            mustVisit: false,
            keywords: ['gyan', 'gita', 'sansthanam']
        },
        {
            id: 22,
            name: 'Gyan Mandir',
            category: 'Educational Institutions',
            categoryIcon: '📚',
            mustVisit: false,
            keywords: ['gyan', 'mandir']
        },
        {
            id: 23,
            name: 'Guru Teg Bahadur Ji (9th Guru)',
            category: 'Sikh Heritage (Gurdwaras)',
            categoryIcon: '🙏',
            mustVisit: false,
            keywords: ['guru', 'bahadur', '9th', 'ji', 'teg']
        },
        {
            id: 24,
            name: 'Faridkot House (Princely State)',
            category: 'Heritage & Archaeological Sites',
            categoryIcon: '🏰',
            mustVisit: false,
            keywords: ['princely', 'state', 'faridkot', 'house']
        },
        {
            id: 25,
            name: 'Krishna Arjun Mandir',
            category: 'Major Mahabharata Sites',
            categoryIcon: '🕉️',
            mustVisit: false,
            keywords: ['krishna', 'arjun', 'mandir']
        },
        {
            id: 27,
            name: 'Nabha House (Sikh Royal)',
            category: 'Heritage & Archaeological Sites',
            categoryIcon: '🏰',
            mustVisit: false,
            keywords: ['sikh', 'royal', 'nabha', 'house']
        },
        {
            id: 28,
            name: 'Chhevin Patshahi (6th Guru Hargobind)',
            category: 'Sikh Heritage (Gurdwaras)',
            categoryIcon: '🙏',
            mustVisit: false,
            keywords: ['chhevin', 'guru', 'hargobind', 'patshahi', '6th']
        },
        {
            id: 29,
            name: 'Dharohar (Haryana State Museum)',
            category: 'Museums & Cultural Centers',
            categoryIcon: '🏛️',
            mustVisit: false,
            keywords: ['state', 'haryana', 'dharohar', 'museum']
        },
        {
            id: 30,
            name: '1857 War Memorial Museum',
            category: 'Museums & Cultural Centers',
            categoryIcon: '🏛️',
            mustVisit: false,
            keywords: ['museum', '1857', 'war', 'memorial']
        },
        {
            id: 31,
            name: 'Mini Zoo (Deer Park)',
            category: 'Recreation & Public Facilities',
            categoryIcon: '🎡',
            mustVisit: false,
            keywords: ['deer', 'zoo', 'park', 'mini']
        },
        {
            id: 32,
            name: 'Dronacharya Stadium',
            category: 'Recreation & Public Facilities',
            categoryIcon: '🎡',
            mustVisit: false,
            keywords: ['stadium', 'dronacharya']
        },
        {
            id: 33,
            name: 'Kuber Tirth (Prosperity)',
            category: 'Merit & Purification Tirthas',
            categoryIcon: '✨',
            mustVisit: false,
            keywords: ['prosperity', 'kuber', 'tirth']
        },
        {
            id: 34,
            name: 'OP Jindal Park',
            category: 'Recreation & Public Facilities',
            categoryIcon: '🎡',
            mustVisit: false,
            keywords: ['jindal', 'park', 'op']
        },
        {
            id: 35,
            name: 'Kala Kirti Bhawan',
            category: 'Museums & Cultural Centers',
            categoryIcon: '🏛️',
            mustVisit: false,
            keywords: ['kirti', 'bhawan', 'kala']
        },
        {
            id: 36,
            name: 'Hanuman Mandir (Dakshinmukhi)',
            category: 'Shiva Temples & Tirthas',
            categoryIcon: '🔱',
            mustVisit: false,
            keywords: ['dakshinmukhi', 'hanuman', 'mandir']
        },
        {
            id: 37,
            name: 'Rajghat Patshahi Dasvin (10th Guru Gobind)',
            category: 'Sikh Heritage (Gurdwaras)',
            categoryIcon: '🙏',
            mustVisit: false,
            keywords: ['dasvin', 'guru', 'rajghat', 'gobind', '10th']
        },
        {
            id: 38,
            name: 'Kurukshetra University (Est. 1956)',
            category: 'Educational Institutions',
            categoryIcon: '📚',
            mustVisit: false,
            keywords: ['university', '1956', 'kurukshetra', 'est.']
        },
        {
            id: 39,
            name: 'Gurukul',
            category: 'Educational Institutions',
            categoryIcon: '📚',
            mustVisit: false,
            keywords: ['gurukul']
        },
        {
            id: 40,
            name: 'National Institute of Technology (Est. 1963)',
            category: 'Educational Institutions',
            categoryIcon: '📚',
            mustVisit: false,
            keywords: ['technology', 'national', 'est.', 'of', '1963']
        },
        {
            id: 41,
            name: 'Shaheed Smarak (Martyrs Memorial)',
            category: 'Memorials & Monuments',
            categoryIcon: '🇮🇳',
            mustVisit: false,
            keywords: ['martyrs', 'shaheed', 'smarak', 'memorial']
        },
        {
            id: 42,
            name: 'About Kurukshetra (48 Kos Overview)',
            category: 'Information & Overview',
            categoryIcon: 'ℹ️',
            mustVisit: false,
            keywords: ['kos', 'kurukshetra', 'about', 'overview', '48']
        },
        {
            id: 43,
            name: 'Aapga Tirtha, Mirzapur',
            category: 'Ancestral Worship Tirthas',
            categoryIcon: '🪷',
            mustVisit: false,
            keywords: ['tirtha', 'mirzapur', 'aapga']
        },
        {
            id: 44,
            name: 'Guru Nanak Singh Gurdwara (1st Guru)',
            category: 'Sikh Heritage (Gurdwaras)',
            categoryIcon: '🙏',
            mustVisit: false,
            keywords: ['gurdwara', 'singh', 'guru', 'nanak', '1st']
        },
        {
            id: 45,
            name: 'Gulzari Lal Nanda Smarak (Former PM)',
            category: 'Memorials & Monuments',
            categoryIcon: '🇮🇳',
            mustVisit: false,
            keywords: ['pm', 'smarak', 'former', 'gulzari', 'lal']
        },
        {
            id: 46,
            name: 'Institute of Hotel Management',
            category: 'Educational Institutions',
            categoryIcon: '📚',
            mustVisit: false,
            keywords: ['of', 'management', 'institute', 'hotel']
        },
        {
            id: 47,
            name: 'Kalpana Chawla Memorial (Astronaut)',
            category: 'Memorials & Monuments',
            categoryIcon: '🇮🇳',
            mustVisit: false,
            keywords: ['chawla', 'astronaut', 'kalpana', 'memorial']
        },
        {
            id: 48,
            name: 'Ban Ganga',
            category: 'Major Mahabharata Sites',
            categoryIcon: '🕉️',
            mustVisit: true,
            keywords: ['ganga', 'ban']
        },
        {
            id: 49,
            name: 'Kamyak Tirtha, Kamauda',
            category: 'Ancestral Worship Tirthas',
            categoryIcon: '🪷',
            mustVisit: false,
            keywords: ['tirtha', 'kamauda', 'kamyak']
        },
        {
            id: 50,
            name: 'Kulotaran Tirtha (Family Liberation)',
            category: 'Ancestral Worship Tirthas',
            categoryIcon: '🪷',
            mustVisit: false,
            keywords: ['tirtha', 'family', 'kulotaran', 'liberation']
        },
        {
            id: 51,
            name: 'Manipurak, Murtjapur',
            category: 'Village Tirthas (48 Kos Circuit)',
            categoryIcon: '🏘️',
            mustVisit: false,
            keywords: ['murtjapur', 'manipurak']
        },
        {
            id: 52,
            name: 'Nabhi Kamal (Lotus Navel)',
            category: 'Brahma & Creation Sites',
            categoryIcon: '📿',
            mustVisit: false,
            keywords: ['kamal', 'nabhi', 'lotus', 'navel']
        },
        {
            id: 53,
            name: 'Saraswati Tirth, Pehowa (Premier Pitru Site)',
            category: 'Ancestral Worship Tirthas',
            categoryIcon: '🪷',
            mustVisit: true,
            keywords: ['saraswati', 'tirth', 'site', 'pehowa', 'premier']
        },
        {
            id: 54,
            name: 'Shalihotra Tirth, Sarasa (Veterinary Sage)',
            category: 'Sage & Puranic Sites',
            categoryIcon: '🧘',
            mustVisit: false,
            keywords: ['sage', 'tirth', 'veterinary', 'sarasa', 'shalihotra']
        },
        {
            id: 56,
            name: 'Pashupati Nath Mahadev Mandir',
            category: 'Shiva Temples & Tirthas',
            categoryIcon: '🔱',
            mustVisit: false,
            keywords: ['nath', 'pashupati', 'mandir', 'mahadev']
        },
        {
            id: 57,
            name: 'Bhurishrava Tirtha, Bhor Saidan',
            category: 'Sage & Puranic Sites',
            categoryIcon: '🧘',
            mustVisit: false,
            keywords: ['tirtha', 'bhor', 'bhurishrava', 'saidan']
        },
        {
            id: 58,
            name: 'Arunai Mandir (Dawn Temple)',
            category: 'Sun Worship Sites',
            categoryIcon: '☀️',
            mustVisit: false,
            keywords: ['dawn', 'arunai', 'temple', 'mandir']
        },
        {
            id: 64,
            name: 'Bhishma Kund Narkatari',
            category: 'Major Mahabharata Sites',
            categoryIcon: '🕉️',
            mustVisit: true,
            keywords: ['kund', 'bhishma', 'narkatari']
        },
        {
            id: 65,
            name: 'Shuddhaspada Tirtha, Peoda',
            category: 'Ancestral Worship Tirthas',
            categoryIcon: '🪷',
            mustVisit: false,
            keywords: ['tirtha', 'peoda', 'shuddhaspada']
        },
        {
            id: 66,
            name: 'Kapil Muni Tirtha (Sankhya Philosophy)',
            category: 'Sage & Puranic Sites',
            categoryIcon: '🧘',
            mustVisit: false,
            keywords: ['sankhya', 'tirtha', 'muni', 'kapil', 'philosophy']
        },
        {
            id: 67,
            name: 'Brahmayoni Prithodak Teerth',
            category: 'Brahma & Creation Sites',
            categoryIcon: '📿',
            mustVisit: false,
            keywords: ['brahmayoni', 'teerth', 'prithodak']
        },
        {
            id: 68,
            name: 'Aditi Tirtha, Amin (Mother of Gods)',
            category: 'Goddess/Shakti Sites',
            categoryIcon: '🌸',
            mustVisit: false,
            keywords: ['mother', 'tirtha', 'amin', 'of', 'aditi']
        },
        {
            id: 69,
            name: 'Yayati Tirtha',
            category: 'Sage & Puranic Sites',
            categoryIcon: '🧘',
            mustVisit: false,
            keywords: ['tirtha', 'yayati']
        },
        {
            id: 70,
            name: 'Brahma Tirtha',
            category: 'Brahma & Creation Sites',
            categoryIcon: '📿',
            mustVisit: false,
            keywords: ['tirtha', 'brahma']
        },
        {
            id: 71,
            name: 'Vimalsar Tirtha (Pure Waters)',
            category: 'Merit & Purification Tirthas',
            categoryIcon: '✨',
            mustVisit: false,
            keywords: ['tirtha', 'vimalsar', 'waters', 'pure']
        },
        {
            id: 72,
            name: 'Mishrak Tirtha',
            category: 'Village Tirthas (48 Kos Circuit)',
            categoryIcon: '🏘️',
            mustVisit: false,
            keywords: ['tirtha', 'mishrak']
        },
        {
            id: 73,
            name: 'Koti Tirtha (10 Million Blessings)',
            category: 'Merit & Purification Tirthas',
            categoryIcon: '✨',
            mustVisit: false,
            keywords: ['10', 'million', 'blessings', 'tirtha', 'koti']
        },
        {
            id: 74,
            name: 'Vamsamulam Tirtha (Lineage Roots)',
            category: 'Ancestral Worship Tirthas',
            categoryIcon: '🪷',
            mustVisit: false,
            keywords: ['tirtha', 'lineage', 'roots', 'vamsamulam']
        },
        {
            id: 75,
            name: 'Bhuteshwar Tirtha',
            category: 'Shiva Temples & Tirthas',
            categoryIcon: '🔱',
            mustVisit: false,
            keywords: ['bhuteshwar', 'tirtha']
        },
        {
            id: 76,
            name: 'Amarhrad Tirtha',
            category: 'Village Tirthas (48 Kos Circuit)',
            categoryIcon: '🏘️',
            mustVisit: false,
            keywords: ['tirtha', 'amarhrad']
        },
        {
            id: 77,
            name: 'Suryakunda Tirtha',
            category: 'Sun Worship Sites',
            categoryIcon: '☀️',
            mustVisit: false,
            keywords: ['tirtha', 'suryakunda']
        },
        {
            id: 78,
            name: 'Kotikut Tirtha',
            category: 'Merit & Purification Tirthas',
            categoryIcon: '✨',
            mustVisit: false,
            keywords: ['tirtha', 'kotikut']
        },
        {
            id: 79,
            name: 'Kulotaran Tirtha, Kaul',
            category: 'Ancestral Worship Tirthas',
            categoryIcon: '🪷',
            mustVisit: false,
            keywords: ['tirtha', 'kulotaran', 'kaul']
        },
        {
            id: 80,
            name: 'Trivishtap Tirtha (Three Worlds)',
            category: 'Village Tirthas (48 Kos Circuit)',
            categoryIcon: '🏘️',
            mustVisit: false,
            keywords: ['tirtha', 'worlds', 'trivishtap', 'three']
        },
        {
            id: 81,
            name: 'Juhomi Tirtha (Sacrificial)',
            category: 'Village Tirthas (48 Kos Circuit)',
            categoryIcon: '🏘️',
            mustVisit: false,
            keywords: ['tirtha', 'sacrificial', 'juhomi']
        },
        {
            id: 82,
            name: 'Vamana Tirtha (Dwarf Avatar)',
            category: 'Vishnu/Avatar Sites',
            categoryIcon: '💠',
            mustVisit: false,
            keywords: ['tirtha', 'avatar', 'dwarf', 'vamana']
        },
        {
            id: 83,
            name: 'Gyaraharudri Tirtha (11 Rudras)',
            category: 'Shiva Temples & Tirthas',
            categoryIcon: '🔱',
            mustVisit: false,
            keywords: ['tirtha', 'gyaraharudri', '11', 'rudras']
        },
        {
            id: 84,
            name: 'Bala Sundari Tirtha',
            category: 'Goddess/Shakti Sites',
            categoryIcon: '🌸',
            mustVisit: false,
            keywords: ['tirtha', 'sundari', 'bala']
        },
        {
            id: 85,
            name: 'Galav Tirtha, Guldehra',
            category: 'Sage & Puranic Sites',
            categoryIcon: '🧘',
            mustVisit: false,
            keywords: ['tirtha', 'galav', 'guldehra']
        },
        {
            id: 86,
            name: 'Shri Kaleshwar Tirtha (Lord of Time)',
            category: 'Shiva Temples & Tirthas',
            categoryIcon: '🔱',
            mustVisit: false,
            keywords: ['tirtha', 'of', 'lord', 'time', 'shri']
        }
    ];
    
    // =========================================================================
    // STATE
    // =========================================================================
    
    let state = {
        initialized: false,
        sitesLoaded: false
    };
    
    // =========================================================================
    // SEARCH & FILTER FUNCTIONS
    // =========================================================================
    
    /**
     * Get all sites
     * @returns {Array} - All sites
     */
    function getAllSites() {
        log(`Retrieved all ${SITES.length} sites`);
        return [...SITES];
    }
    
    /**
     * Get site by ID
     * @param {number} id - Site ID
     * @returns {Object|null} - Site object or null
     */
    function getSiteById(id) {
        const site = SITES.find(s => s.id === id);
        if (site) {
            log(`Found site: ${site.name} (ID: ${id})`);
        } else {
            log(`Site not found with ID: ${id}`, 'warn');
        }
        return site || null;
    }
    
    /**
     * Search sites by name (fuzzy search)
     * @param {string} query - Search query
     * @returns {Array} - Matching sites
     */
    function searchByName(query) {
        if (!query || query.trim() === '') {
            return [];
        }
        
        const searchTerm = query.toLowerCase().trim();
        log(`Searching for: "${searchTerm}"`);
        
        const results = SITES.filter(site => {
            const nameMatch = site.name.toLowerCase().includes(searchTerm);
            const keywordMatch = site.keywords.some(k => k.includes(searchTerm));
            return nameMatch || keywordMatch;
        });
        
        log(`Found ${results.length} matches for "${searchTerm}"`);
        return results;
    }
    
    /**
     * Get sites by category
     * @param {string} categoryName - Category name
     * @returns {Array} - Sites in category
     */
    function getSitesByCategory(categoryName) {
        const results = SITES.filter(s => s.category === categoryName);
        log(`Found ${results.length} sites in category: ${categoryName}`);
        return results;
    }
    
    /**
     * Get all must-visit sites
     * @returns {Array} - Must-visit sites
     */
    function getMustVisitSites() {
        const results = SITES.filter(s => s.mustVisit);
        log(`Found ${results.length} must-visit sites`);
        return results;
    }
    
    /**
     * Get all categories
     * @returns {Array} - All categories
     */
    function getAllCategories() {
        log(`Retrieved all ${CATEGORIES.length} categories`);
        return [...CATEGORIES];
    }
    
    /**
     * Get category by name
     * @param {string} name - Category name
     * @returns {Object|null} - Category object or null
     */
    function getCategoryByName(name) {
        const category = CATEGORIES.find(c => c.name === name);
        if (category) {
            log(`Found category: ${category.name}`);
        } else {
            log(`Category not found: ${name}`, 'warn');
        }
        return category || null;
    }
    
    /**
     * Get autocomplete suggestions
     * @param {string} query - Search query
     * @param {number} limit - Maximum results (default: 10)
     * @returns {Array} - Suggestions
     */
    function getAutocompleteSuggestions(query, limit = 10) {
        if (!query || query.trim() === '') {
            return [];
        }
        
        const searchTerm = query.toLowerCase().trim();
        const results = SITES.filter(site => {
            return site.name.toLowerCase().startsWith(searchTerm) ||
                   site.keywords.some(k => k.startsWith(searchTerm));
        });
        
        const suggestions = results.slice(0, limit).map(site => ({
            id: site.id,
            name: site.name,
            category: site.category,
            icon: site.categoryIcon
        }));
        
        log(`Autocomplete: "${searchTerm}" → ${suggestions.length} suggestions`);
        return suggestions;
    }
    
    /**
     * Get sites by icon/category icon
     * @param {string} icon - Category icon emoji
     * @returns {Array} - Matching sites
     */
    function getSitesByIcon(icon) {
        const results = SITES.filter(s => s.categoryIcon === icon);
        log(`Found ${results.length} sites with icon: ${icon}`);
        return results;
    }
    
    /**
     * Get random site
     * @returns {Object} - Random site
     */
    function getRandomSite() {
        const randomIndex = Math.floor(Math.random() * SITES.length);
        const site = SITES[randomIndex];
        log(`Random site: ${site.name}`);
        return site;
    }
    
    /**
     * Get random must-visit site
     * @returns {Object} - Random must-visit site
     */
    function getRandomMustVisit() {
        const mustVisit = SITES.filter(s => s.mustVisit);
        const randomIndex = Math.floor(Math.random() * mustVisit.length);
        const site = mustVisit[randomIndex];
        log(`Random must-visit: ${site.name}`);
        return site;
    }
    
    // =========================================================================
    // STATISTICS
    // =========================================================================
    
    /**
     * Get statistics about the data
     * @returns {Object} - Statistics
     */
    function getStats() {
        const stats = {
            totalSites: SITES.length,
            totalCategories: CATEGORIES.length,
            mustVisitCount: SITES.filter(s => s.mustVisit).length,
            sitesPerCategory: {},
            version: CONFIG.version,
            dataSource: CONFIG.dataSource,
            lastUpdated: CONFIG.lastUpdated
        };
        
        CATEGORIES.forEach(cat => {
            stats.sitesPerCategory[cat.name] = SITES.filter(s => s.category === cat.name).length;
        });
        
        log('Statistics retrieved');
        console.table(stats.sitesPerCategory);
        
        return stats;
    }
    
    // =========================================================================
    // INITIALIZATION
    // =========================================================================
    
    /**
     * Initialize the tour guide data module
     * @returns {Object} - Public API
     */
    function init() {
        if (state.initialized) {
            log('Tour Guide Data already initialized', 'warn');
            return getPublicAPI();
        }
        
        log('Tour Guide Data initializing...', 'info');
        
        try {
            state.initialized = true;
            state.sitesLoaded = true;
            
            log('Tour Guide Data initialized successfully!', 'success');
            log(`📍 Loaded ${SITES.length} sites across ${CATEGORIES.length} categories`);
            log(`⭐ ${SITES.filter(s => s.mustVisit).length} must-visit sites marked`);
            log(`📅 Data source: ${CONFIG.dataSource} (Updated: ${CONFIG.lastUpdated})`);
            
        } catch (error) {
            log(`Initialization error: ${error.message}`, 'error');
            console.error(error);
        }
        
        return getPublicAPI();
    }
    
    /**
     * Get public API
     * @returns {Object} - Public API
     */
    function getPublicAPI() {
        return {
            // Data retrieval
            getAllSites,
            getSiteById,
            getAllCategories,
            getCategoryByName,
            
            // Search & filter
            searchByName,
            getSitesByCategory,
            getMustVisitSites,
            getSitesByIcon,
            
            // Autocomplete
            getAutocompleteSuggestions,
            
            // Random
            getRandomSite,
            getRandomMustVisit,
            
            // Statistics
            getStats,
            
            // Configuration
            setLogging: (enabled) => {
                CONFIG.logging.enabled = enabled;
                log(`Logging ${enabled ? 'enabled' : 'disabled'}`);
            },
            
            // Metadata
            version: CONFIG.version,
            dataSource: CONFIG.dataSource,
            lastUpdated: CONFIG.lastUpdated
        };
    }
    
    // =========================================================================
    // EXPORT PUBLIC API
    // =========================================================================
    
    return {
        init,
        get: getPublicAPI
    };
    
})();

// =========================================================================
// EXPORT (for module systems)
// =========================================================================

// CommonJS
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TourGuideData;
}

// AMD
if (typeof define === 'function' && define.amd) {
    define([], function() {
        return TourGuideData;
    });
}

// Global export
if (typeof window !== 'undefined') {
    window.TourGuideData = TourGuideData;
}
