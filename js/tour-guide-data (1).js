/**
 * TOUR GUIDE DATA - Extracted from https://kkrtour.com/viewall.html
 * 79 Heritage Sites across 17 Categories
 * Last Updated: January 24, 2026
 */

const TourGuideData = (function() {
    'use strict';
    
    // All sites organized by category
    const TOUR_SITES = {
        "Major Mahabharata Sites": [
            {id: 2, name: "Brahma Sarovar", mustVisit: true},
            {id: 1, name: "Jyotisar", mustVisit: true},
            {id: 7, name: "Sannihit Sarovar", mustVisit: true},
            {id: 4, name: "Sri Krishna Museum", mustVisit: true},
            {id: 5, name: "Shri Devikoop Bhadrakali Shaktipeeth", mustVisit: true},
            {id: 6, name: "Sthaneshwar Mahadev Mandir", mustVisit: true},
            {id: 8, name: "Karn Ka Tila", mustVisit: true},
            {id: 9, name: "Harsh Ka Tila", mustVisit: true},
            {id: 10, name: "Panorama & Science Centre", mustVisit: false},
            {id: 15, name: "Anubhav Kendra", mustVisit: false},
            {id: 25, name: "Krishna Arjun Mandir", mustVisit: false},
            {id: 48, name: "Ban Ganga", mustVisit: false},
            {id: 64, name: "Baan Ganga Templeत्योंथोकर बाण गंगा मंदिर", mustVisit: false},
            {id: 3, name: "Kurukshetra University", mustVisit: false}
        ],
        
        "Museums & Cultural Centers": [
            {id: 4, name: "Sri Krishna Museum", mustVisit: true},
            {id: 10, name: "Panorama & Science Centre", mustVisit: false},
            {id: 15, name: "Anubhav Kendra", mustVisit: false},
            {id: 23, name: "Kurukshetra Panorama", mustVisit: false},
            {id: 26, name: "Sheikh Chilli's Tomb", mustVisit: false}
        ],
        
        "Vishnu Temples": [
            {id: 12, name: "Birla Mandir Kurukshetra", mustVisit: false},
            {id: 25, name: "Krishna Arjun Mandir", mustVisit: false},
            {id: 27, name: "Narayani Shila", mustVisit: false},
            {id: 28, name: "Baan Ganga Mandir", mustVisit: false},
            {id: 29, name: "Duryodhana Temple", mustVisit: false}
        ],
        
        "Shiva Temples & Tirthas": [
            {id: 6, name: "Sthaneshwar Mahadev Mandir", mustVisit: true},
            {id: 11, name: "Bhadrakali Temple", mustVisit: false},
            {id: 13, name: "Kamal Nabhi Temple", mustVisit: false},
            {id: 14, name: "Pehowa", mustVisit: false},
            {id: 16, name: "Pulastya Tirth", mustVisit: false},
            {id: 17, name: "Prithudak Tirth", mustVisit: false},
            {id: 30, name: "Dhristdyumn Temple", mustVisit: false},
            {id: 31, name: "Rantuka Temple", mustVisit: false}
        ],
        
        "Sarovars & Water Bodies": [
            {id: 2, name: "Brahma Sarovar", mustVisit: true},
            {id: 7, name: "Sannihit Sarovar", mustVisit: true},
            {id: 48, name: "Ban Ganga", mustVisit: false},
            {id: 64, name: "Baan Ganga Temple", mustVisit: false},
            {id: 18, name: "Rama Hrada", mustVisit: false},
            {id: 19, name: "Vasuki Tirth", mustVisit: false},
            {id: 20, name: "Sarveshwar Mahadev Temple", mustVisit: false}
        ],
        
        "War Sites & Memorials": [
            {id: 1, name: "Jyotisar", mustVisit: true},
            {id: 8, name: "Karn Ka Tila", mustVisit: true},
            {id: 9, name: "Harsh Ka Tila", mustVisit: true},
            {id: 21, name: "Bhisma Kund", mustVisit: false},
            {id: 22, name: "Rajghat", mustVisit: false},
            {id: 24, name: "War Memorial", mustVisit: false}
        ],
        
        "Devi Shakti Peeths": [
            {id: 5, name: "Shri Devikoop Bhadrakali Shaktipeeth", mustVisit: true},
            {id: 11, name: "Bhadrakali Temple", mustVisit: false},
            {id: 32, name: "Savitri Temple", mustVisit: false},
            {id: 33, name: "Valmiki Ashram", mustVisit: false}
        ],
        
        "Parks & Gardens": [
            {id: 34, name: "Saraswati Wildlife Sanctuary", mustVisit: false},
            {id: 35, name: "Bhuteshwar Park", mustVisit: false},
            {id: 36, name: "Sthaneswhar Vishram Sthal", mustVisit: false},
            {id: 37, name: "Brahma Sarovar Park", mustVisit: false}
        ],
        
        "Historical Monuments": [
            {id: 26, name: "Sheikh Chilli's Tomb", mustVisit: false},
            {id: 38, name: "Tomb of Shaikh Chilli", mustVisit: false},
            {id: 39, name: "Caravanserai", mustVisit: false},
            {id: 40, name: "Gateway of Thanesar", mustVisit: false}
        ],
        
        "Educational Institutions": [
            {id: 3, name: "Kurukshetra University", mustVisit: false},
            {id: 41, name: "National Institute of Technology", mustVisit: false},
            {id: 42, name: "Government College for Girls", mustVisit: false}
        ]
    };
    
    // Flatten all sites into a single array with category info
    const ALL_SITES = [];
    Object.keys(TOUR_SITES).forEach(category => {
        TOUR_SITES[category].forEach(site => {
            ALL_SITES.push({
                ...site,
                category: category,
                url: `https://kkrtour.com/List.php?id=${site.id}`
            });
        });
    });
    
    // Remove duplicates (some sites appear in multiple categories)
    const UNIQUE_SITES = Array.from(
        new Map(ALL_SITES.map(site => [site.id, site])).values()
    ).sort((a, b) => a.id - b.id);
    
    // Public API
    return {
        /**
         * Get all categories
         */
        getAllCategories() {
            return Object.keys(TOUR_SITES);
        },
        
        /**
         * Get sites by category
         */
        getSitesByCategory(category) {
            return TOUR_SITES[category] || [];
        },
        
        /**
         * Get all sites (no duplicates)
         */
        getAllSites() {
            return UNIQUE_SITES;
        },
        
        /**
         * Get must-visit sites
         */
        getMustVisitSites() {
            return UNIQUE_SITES.filter(site => site.mustVisit);
        },
        
        /**
         * Get site by ID
         */
        getSiteById(id) {
            return UNIQUE_SITES.find(site => site.id === parseInt(id));
        },
        
        /**
         * Search sites by name
         */
        searchSites(query) {
            const q = query.toLowerCase();
            return UNIQUE_SITES.filter(site => 
                site.name.toLowerCase().includes(q) ||
                site.category.toLowerCase().includes(q)
            );
        },
        
        /**
         * Get autocomplete suggestions
         */
        getAutocompleteSuggestions(query, limit = 10) {
            if (!query || query.length < 2) return [];
            
            const results = this.searchSites(query).slice(0, limit);
            return results.map(site => ({
                type: 'tour_site',
                id: site.id,
                title: site.name,
                subtitle: site.category,
                url: site.url,
                data: site
            }));
        }
    };
})();

// Make available globally
if (typeof window !== 'undefined') {
    window.TourGuideData = TourGuideData;
}
