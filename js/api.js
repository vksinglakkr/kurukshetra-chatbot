/**
 * ============================================================================
 * KURUKSHETRA MITRA - API INTEGRATION MODULE
 * External Data & Services Integration
 * Version: 1.0.0
 * ============================================================================
 * 
 * This module handles all external API integrations including:
 * - Site details fetching
 * - Weather information
 * - Maps and directions
 * - Events and updates
 * - Image galleries
 * 
 * Features:
 * - Async data fetching
 * - Caching for performance
 * - Error handling
 * - Retry logic
 * - Mock data for testing
 * - Console logging
 * 
 * Dependencies: None (vanilla JavaScript)
 * Last Updated: January 23, 2026
 */

const APIModule = (function() {
    'use strict';
    
    // =========================================================================
    // CONFIGURATION
    // =========================================================================
    
    const CONFIG = {
        logging: {
            enabled: true,
            prefix: '🌐'
        },
        version: '1.0.0',
        
        // API endpoints (can be configured)
        endpoints: {
            weather: 'https://api.openweathermap.org/data/2.5/weather',
            geocode: 'https://nominatim.openstreetmap.org/search',
            siteDetails: '/api/sites/',  // Your backend API
            events: '/api/events/',
            images: '/api/images/'
        },
        
        // API keys (to be set by user)
        apiKeys: {
            weather: null,  // Set via setWeatherApiKey()
            maps: null
        },
        
        // Cache settings
        cache: {
            enabled: true,
            ttl: 300000  // 5 minutes in milliseconds
        },
        
        // Retry settings
        retry: {
            enabled: true,
            maxAttempts: 3,
            delay: 1000  // milliseconds
        },
        
        // Mock data mode (for testing)
        useMockData: true  // Set to false when APIs are available
    };
    
    // =========================================================================
    // STATE
    // =========================================================================
    
    let state = {
        initialized: false,
        cache: new Map(),
        pendingRequests: new Map()
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
    // CACHE MANAGEMENT
    // =========================================================================
    
    /**
     * Generate cache key
     * @param {string} type - Cache type
     * @param {Object} params - Parameters
     * @returns {string} - Cache key
     */
    function getCacheKey(type, params) {
        return `${type}_${JSON.stringify(params)}`;
    }
    
    /**
     * Get cached data
     * @param {string} key - Cache key
     * @returns {any|null} - Cached data or null
     */
    function getCache(key) {
        if (!CONFIG.cache.enabled) return null;
        
        const cached = state.cache.get(key);
        if (!cached) return null;
        
        // Check if expired
        if (Date.now() - cached.timestamp > CONFIG.cache.ttl) {
            state.cache.delete(key);
            return null;
        }
        
        log(`Cache HIT: ${key}`);
        return cached.data;
    }
    
    /**
     * Set cache data
     * @param {string} key - Cache key
     * @param {any} data - Data to cache
     */
    function setCache(key, data) {
        if (!CONFIG.cache.enabled) return;
        
        state.cache.set(key, {
            data: data,
            timestamp: Date.now()
        });
        
        log(`Cache SET: ${key}`);
    }
    
    /**
     * Clear cache
     * @param {string} pattern - Optional pattern to match
     */
    function clearCache(pattern = null) {
        if (pattern) {
            for (const key of state.cache.keys()) {
                if (key.includes(pattern)) {
                    state.cache.delete(key);
                }
            }
            log(`Cache cleared: ${pattern}`);
        } else {
            state.cache.clear();
            log('Cache cleared completely');
        }
    }
    
    // =========================================================================
    // MOCK DATA (for testing without real APIs)
    // =========================================================================
    
    const MOCK_DATA = {
        weather: {
            location: 'Kurukshetra, Haryana',
            temp: 22,
            feels_like: 20,
            temp_min: 18,
            temp_max: 25,
            humidity: 65,
            description: 'Clear sky',
            icon: '01d',
            wind_speed: 3.5,
            sunrise: '06:45',
            sunset: '17:30'
        },
        
        siteDetails: {
            1: {
                id: 1,
                name: 'Jyotisar',
                description: 'Sacred site where Lord Krishna delivered the Bhagavad Gita to Arjuna. Features a historic banyan tree and marble chariot.',
                location: {
                    lat: 29.8543,
                    lng: 76.8370,
                    address: 'Pehowa Road, Kurukshetra'
                },
                timings: 'Open 24 hours',
                entryFee: 'Free',
                facilities: ['Parking', 'Restrooms', 'Drinking Water', 'Light & Sound Show'],
                images: [
                    'jyotisar-1.jpg',
                    'jyotisar-2.jpg',
                    'jyotisar-3.jpg'
                ],
                bestTimeToVisit: 'Early morning or evening',
                duration: '1-2 hours'
            },
            2: {
                id: 2,
                name: 'Brahma Sarovar',
                description: 'Ancient sacred water tank believed to be created by Lord Brahma. One of Asia\'s largest water tanks.',
                location: {
                    lat: 29.9687,
                    lng: 76.8286,
                    address: 'Brahma Sarovar Road, Kurukshetra'
                },
                timings: 'Open 24 hours',
                entryFee: 'Free',
                facilities: ['Changing Rooms', 'Parking', 'Temples', 'Gardens', 'Museum'],
                images: [
                    'brahma-sarovar-1.jpg',
                    'brahma-sarovar-2.jpg'
                ],
                bestTimeToVisit: 'Early morning for holy bath',
                duration: '2-3 hours'
            }
        },
        
        events: [
            {
                id: 1,
                title: 'Gita Jayanti Celebration',
                date: '2026-12-21',
                location: 'Brahma Sarovar',
                description: 'Annual celebration of the day Bhagavad Gita was spoken',
                type: 'Festival'
            },
            {
                id: 2,
                title: 'International Gita Mahotsav',
                date: '2026-12-15',
                duration: '7 days',
                location: 'Various venues',
                description: 'Week-long cultural festival with performances, exhibitions, and spiritual discourses',
                type: 'Festival'
            },
            {
                id: 3,
                title: 'Solar Eclipse Holy Bath',
                date: '2027-08-02',
                location: 'Brahma Sarovar & Sannihit Sarovar',
                description: 'Auspicious holy bath during solar eclipse',
                type: 'Religious'
            }
        ],
        
        directions: {
            fromDelhi: {
                distance: '170 km',
                duration: '3-4 hours',
                routes: [
                    {
                        name: 'Via NH-44 (Fastest)',
                        distance: '170 km',
                        duration: '3 hours',
                        steps: [
                            'Take NH-44 from Delhi',
                            'Continue through Panipat',
                            'Exit at Kurukshetra'
                        ]
                    },
                    {
                        name: 'Via GT Road',
                        distance: '175 km',
                        duration: '3.5 hours',
                        steps: [
                            'Take GT Road from Delhi',
                            'Pass through Sonipat',
                            'Continue to Kurukshetra'
                        ]
                    }
                ]
            }
        }
    };
    
    // =========================================================================
    // WEATHER API
    // =========================================================================
    
    /**
     * Get weather information
     * @param {string} location - Location name (default: Kurukshetra)
     * @returns {Promise} - Weather data
     */
    async function getWeather(location = 'Kurukshetra') {
        log(`Fetching weather for: ${location}`);
        
        // Check cache
        const cacheKey = getCacheKey('weather', { location });
        const cached = getCache(cacheKey);
        if (cached) return cached;
        
        try {
            // Use mock data if enabled
            if (CONFIG.useMockData) {
                log('Using mock weather data');
                const data = MOCK_DATA.weather;
                setCache(cacheKey, data);
                return data;
            }
            
            // Real API call (requires API key)
            if (!CONFIG.apiKeys.weather) {
                log('Weather API key not set, using mock data', 'warn');
                return MOCK_DATA.weather;
            }
            
            const response = await fetch(
                `${CONFIG.endpoints.weather}?q=${location}&appid=${CONFIG.apiKeys.weather}&units=metric`
            );
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            
            const weatherData = {
                location: data.name,
                temp: Math.round(data.main.temp),
                feels_like: Math.round(data.main.feels_like),
                temp_min: Math.round(data.main.temp_min),
                temp_max: Math.round(data.main.temp_max),
                humidity: data.main.humidity,
                description: data.weather[0].description,
                icon: data.weather[0].icon,
                wind_speed: data.wind.speed,
                sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            };
            
            setCache(cacheKey, weatherData);
            log('Weather data fetched successfully', 'success');
            return weatherData;
            
        } catch (error) {
            log(`Weather fetch error: ${error.message}`, 'error');
            return MOCK_DATA.weather;
        }
    }
    
    // =========================================================================
    // SITE DETAILS API
    // =========================================================================
    
    /**
     * Get site details by ID
     * @param {number} siteId - Site ID
     * @returns {Promise} - Site details
     */
    async function getSiteDetails(siteId) {
        log(`Fetching details for site ID: ${siteId}`);
        
        const cacheKey = getCacheKey('site', { siteId });
        const cached = getCache(cacheKey);
        if (cached) return cached;
        
        try {
            // Use mock data if enabled
            if (CONFIG.useMockData) {
                log('Using mock site data');
                const data = MOCK_DATA.siteDetails[siteId];
                if (!data) {
                    throw new Error(`Site ${siteId} not found in mock data`);
                }
                setCache(cacheKey, data);
                return data;
            }
            
            // Real API call
            const response = await fetch(`${CONFIG.endpoints.siteDetails}${siteId}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            setCache(cacheKey, data);
            log(`Site details fetched: ${data.name}`, 'success');
            return data;
            
        } catch (error) {
            log(`Site fetch error: ${error.message}`, 'error');
            throw error;
        }
    }
    
    // =========================================================================
    // EVENTS API
    // =========================================================================
    
    /**
     * Get upcoming events
     * @param {number} limit - Number of events to fetch
     * @returns {Promise} - Events array
     */
    async function getEvents(limit = 10) {
        log(`Fetching events (limit: ${limit})`);
        
        const cacheKey = getCacheKey('events', { limit });
        const cached = getCache(cacheKey);
        if (cached) return cached;
        
        try {
            // Use mock data if enabled
            if (CONFIG.useMockData) {
                log('Using mock events data');
                const data = MOCK_DATA.events.slice(0, limit);
                setCache(cacheKey, data);
                return data;
            }
            
            // Real API call
            const response = await fetch(`${CONFIG.endpoints.events}?limit=${limit}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            setCache(cacheKey, data);
            log(`Events fetched: ${data.length}`, 'success');
            return data;
            
        } catch (error) {
            log(`Events fetch error: ${error.message}`, 'error');
            return MOCK_DATA.events.slice(0, limit);
        }
    }
    
    // =========================================================================
    // DIRECTIONS API
    // =========================================================================
    
    /**
     * Get directions to Kurukshetra
     * @param {string} from - Origin location
     * @returns {Promise} - Directions data
     */
    async function getDirections(from = 'Delhi') {
        log(`Getting directions from: ${from}`);
        
        const cacheKey = getCacheKey('directions', { from });
        const cached = getCache(cacheKey);
        if (cached) return cached;
        
        try {
            // Use mock data if enabled
            if (CONFIG.useMockData) {
                log('Using mock directions data');
                const data = MOCK_DATA.directions.fromDelhi;
                setCache(cacheKey, data);
                return data;
            }
            
            // Real API would go here (Google Maps, Mapbox, etc.)
            log('Real directions API not implemented yet', 'warn');
            return MOCK_DATA.directions.fromDelhi;
            
        } catch (error) {
            log(`Directions fetch error: ${error.message}`, 'error');
            return MOCK_DATA.directions.fromDelhi;
        }
    }
    
    // =========================================================================
    // GEOCODING
    // =========================================================================
    
    /**
     * Get coordinates for a location
     * @param {string} location - Location name
     * @returns {Promise} - Coordinates {lat, lng}
     */
    async function getCoordinates(location) {
        log(`Geocoding: ${location}`);
        
        const cacheKey = getCacheKey('geocode', { location });
        const cached = getCache(cacheKey);
        if (cached) return cached;
        
        try {
            // Use OpenStreetMap Nominatim (free, no API key needed)
            const response = await fetch(
                `${CONFIG.endpoints.geocode}?q=${encodeURIComponent(location)}&format=json&limit=1`
            );
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            if (data.length === 0) throw new Error('Location not found');
            
            const coords = {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon),
                display_name: data[0].display_name
            };
            
            setCache(cacheKey, coords);
            log(`Coordinates found: ${coords.lat}, ${coords.lng}`, 'success');
            return coords;
            
        } catch (error) {
            log(`Geocoding error: ${error.message}`, 'error');
            throw error;
        }
    }
    
    // =========================================================================
    // HELPER FUNCTIONS
    // =========================================================================
    
    /**
     * Generic fetch with retry logic
     * @param {string} url - URL to fetch
     * @param {Object} options - Fetch options
     * @returns {Promise} - Response data
     */
    async function fetchWithRetry(url, options = {}, attempt = 1) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
            
        } catch (error) {
            if (CONFIG.retry.enabled && attempt < CONFIG.retry.maxAttempts) {
                log(`Retry attempt ${attempt + 1}/${CONFIG.retry.maxAttempts}`, 'warn');
                await sleep(CONFIG.retry.delay * attempt);
                return fetchWithRetry(url, options, attempt + 1);
            }
            throw error;
        }
    }
    
    /**
     * Sleep utility
     * @param {number} ms - Milliseconds to sleep
     */
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // =========================================================================
    // INITIALIZATION
    // =========================================================================
    
    /**
     * Initialize API module
     * @param {Object} options - Configuration options
     * @returns {Object} - Public API
     */
    function init(options = {}) {
        if (state.initialized) {
            log('API Module already initialized', 'warn');
            return getPublicAPI();
        }
        
        log('API Module initializing...', 'info');
        
        try {
            // Merge options
            if (options.apiKeys) {
                Object.assign(CONFIG.apiKeys, options.apiKeys);
            }
            
            if (options.useMockData !== undefined) {
                CONFIG.useMockData = options.useMockData;
            }
            
            if (options.cacheEnabled !== undefined) {
                CONFIG.cache.enabled = options.cacheEnabled;
            }
            
            state.initialized = true;
            
            log('API Module initialized successfully!', 'success');
            log(`Mode: ${CONFIG.useMockData ? '🎭 MOCK DATA' : '🌐 LIVE APIs'}`);
            log(`Cache: ${CONFIG.cache.enabled ? '✅ Enabled' : '❌ Disabled'}`);
            log(`Retry: ${CONFIG.retry.enabled ? '✅ Enabled' : '❌ Disabled'}`);
            
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
            // Data fetching
            getWeather,
            getSiteDetails,
            getEvents,
            getDirections,
            getCoordinates,
            
            // Cache management
            clearCache,
            getCacheStats: () => ({
                size: state.cache.size,
                enabled: CONFIG.cache.enabled,
                ttl: CONFIG.cache.ttl
            }),
            
            // Configuration
            setWeatherApiKey: (key) => { CONFIG.apiKeys.weather = key; },
            setMapsApiKey: (key) => { CONFIG.apiKeys.maps = key; },
            setMockMode: (enabled) => { CONFIG.useMockData = enabled; },
            setCacheEnabled: (enabled) => { CONFIG.cache.enabled = enabled; },
            setLogging: (enabled) => { CONFIG.logging.enabled = enabled; },
            
            // Mock data access (for testing)
            getMockData: () => ({ ...MOCK_DATA }),
            
            // Metadata
            version: CONFIG.version,
            isInitialized: () => state.initialized,
            isMockMode: () => CONFIG.useMockData
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
    module.exports = APIModule;
}

// AMD
if (typeof define === 'function' && define.amd) {
    define([], function() {
        return APIModule;
    });
}

// Global export
if (typeof window !== 'undefined') {
    window.APIModule = APIModule;
}
