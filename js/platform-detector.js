/**
 * ============================================================================
 * KURUKSHETRA MITRA - PLATFORM DETECTOR
 * Device Detection & Responsive Behavior Manager
 * Version: 2.0.0
 * ============================================================================
 * 
 * This module detects the user's platform (mobile/tablet/desktop) and provides
 * utilities for responsive behavior throughout the application.
 * 
 * Features:
 * - Device type detection (mobile/tablet/desktop)
 * - Screen size tracking
 * - Orientation detection
 * - Touch capability detection
 * - Breakpoint utilities
 * - Console logging for debugging
 * 
 * Usage:
 *   const platform = PlatformDetector.init();
 *   if (platform.isMobile()) {
 *     // Mobile-specific code
 *   }
 */

const PlatformDetector = (function() {
    'use strict';
    
    // =========================================================================
    // CONFIGURATION
    // =========================================================================
    
    const CONFIG = {
        breakpoints: {
            mobile: 767,      // 0-767px
            tablet: 1023,     // 768-1023px
            desktop: 1024     // 1024px+
        },
        logging: {
            enabled: true,    // Master switch for console logs
            verbose: true,    // Detailed logs
            prefix: '🔍'      // Emoji prefix for platform logs
        },
        debounce: {
            resize: 250       // Debounce delay for resize events (ms)
        }
    };
    
    // =========================================================================
    // STATE
    // =========================================================================
    
    let state = {
        initialized: false,
        platform: null,
        width: 0,
        height: 0,
        orientation: null,
        hasTouch: false,
        userAgent: null,
        os: null,
        browser: null,
        lastUpdate: null
    };
    
    // =========================================================================
    // LOGGING UTILITIES
    // =========================================================================
    
    /**
     * Log to console if logging is enabled
     * @param {string} message - Message to log
     * @param {string} type - Log type (info/warn/error)
     */
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
    
    /**
     * Log detailed information if verbose logging is enabled
     * @param {string} message - Message to log
     */
    function logVerbose(message) {
        if (CONFIG.logging.enabled && CONFIG.logging.verbose) {
            console.log(`${CONFIG.logging.prefix} 📋 ${message}`);
        }
    }
    
    /**
     * Log platform information in a formatted table
     */
    function logPlatformInfo() {
        if (!CONFIG.logging.enabled) return;
        
        console.group(`${CONFIG.logging.prefix} Platform Information`);
        console.table({
            'Platform': state.platform,
            'Width': `${state.width}px`,
            'Height': `${state.height}px`,
            'Orientation': state.orientation,
            'Touch Enabled': state.hasTouch ? 'Yes' : 'No',
            'OS': state.os || 'Unknown',
            'Browser': state.browser || 'Unknown'
        });
        console.groupEnd();
    }
    
    // =========================================================================
    // DEVICE DETECTION
    // =========================================================================
    
    /**
     * Detect device type based on screen width
     * @returns {string} - 'mobile', 'tablet', or 'desktop'
     */
    function detectPlatform() {
        const width = window.innerWidth;
        
        if (width <= CONFIG.breakpoints.mobile) {
            return 'mobile';
        } else if (width <= CONFIG.breakpoints.tablet) {
            return 'tablet';
        } else {
            return 'desktop';
        }
    }
    
    /**
     * Detect screen orientation
     * @returns {string} - 'portrait' or 'landscape'
     */
    function detectOrientation() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        return width > height ? 'landscape' : 'portrait';
    }
    
    /**
     * Detect if device has touch capability
     * @returns {boolean} - True if touch is supported
     */
    function detectTouch() {
        return (
            'ontouchstart' in window ||
            navigator.maxTouchPoints > 0 ||
            navigator.msMaxTouchPoints > 0
        );
    }
    
    /**
     * Detect operating system
     * @returns {string} - OS name
     */
    function detectOS() {
        const ua = navigator.userAgent;
        
        if (/iPad|iPhone|iPod/.test(ua)) return 'iOS';
        if (/Android/.test(ua)) return 'Android';
        if (/Win/.test(ua)) return 'Windows';
        if (/Mac/.test(ua)) return 'macOS';
        if (/Linux/.test(ua)) return 'Linux';
        
        return 'Unknown';
    }
    
    /**
     * Detect browser
     * @returns {string} - Browser name
     */
    function detectBrowser() {
        const ua = navigator.userAgent;
        
        if (/Edg/.test(ua)) return 'Edge';
        if (/Chrome/.test(ua) && !/Edg/.test(ua)) return 'Chrome';
        if (/Safari/.test(ua) && !/Chrome/.test(ua)) return 'Safari';
        if (/Firefox/.test(ua)) return 'Firefox';
        if (/MSIE|Trident/.test(ua)) return 'Internet Explorer';
        
        return 'Unknown';
    }
    
    /**
     * Get device model (if detectable)
     * @returns {string} - Device model or generic type
     */
    function getDeviceModel() {
        const ua = navigator.userAgent;
        
        // iPhone models
        if (/iPhone/.test(ua)) {
            if (window.screen.height === 844) return 'iPhone 12/13';
            if (window.screen.height === 926) return 'iPhone 12/13 Pro Max';
            if (window.screen.height === 812) return 'iPhone X/11 Pro';
            return 'iPhone';
        }
        
        // iPad models
        if (/iPad/.test(ua)) {
            return 'iPad';
        }
        
        // Android devices
        if (/Android/.test(ua)) {
            const match = ua.match(/Android.*?;\s*([^;)]+)/);
            if (match && match[1]) {
                return match[1].trim();
            }
            return 'Android Device';
        }
        
        // Desktop/Laptop
        if (state.platform === 'desktop') {
            return 'Desktop Computer';
        }
        
        return 'Unknown Device';
    }
    
    // =========================================================================
    // STATE MANAGEMENT
    // =========================================================================
    
    /**
     * Update platform state
     */
    function updateState() {
        const oldPlatform = state.platform;
        const oldOrientation = state.orientation;
        
        state.platform = detectPlatform();
        state.width = window.innerWidth;
        state.height = window.innerHeight;
        state.orientation = detectOrientation();
        state.hasTouch = detectTouch();
        state.userAgent = navigator.userAgent;
        state.os = detectOS();
        state.browser = detectBrowser();
        state.lastUpdate = new Date();
        
        // Log if platform changed
        if (oldPlatform && oldPlatform !== state.platform) {
            log(`Platform changed: ${oldPlatform} → ${state.platform}`, 'info');
        }
        
        // Log if orientation changed
        if (oldOrientation && oldOrientation !== state.orientation) {
            logVerbose(`Orientation changed: ${oldOrientation} → ${state.orientation}`);
        }
    }
    
    /**
     * Update body classes based on platform
     */
    function updateBodyClasses() {
        const body = document.body;
        
        // Remove old platform classes
        body.classList.remove('platform-mobile', 'platform-tablet', 'platform-desktop');
        body.classList.remove('orientation-portrait', 'orientation-landscape');
        body.classList.remove('touch-enabled', 'no-touch');
        
        // Add new platform classes
        body.classList.add(`platform-${state.platform}`);
        body.classList.add(`orientation-${state.orientation}`);
        body.classList.add(state.hasTouch ? 'touch-enabled' : 'no-touch');
        
        logVerbose(`Body classes updated: platform-${state.platform}, orientation-${state.orientation}`);
    }
    
    // =========================================================================
    // EVENT HANDLERS
    // =========================================================================
    
    let resizeTimeout = null;
    
    /**
     * Handle window resize (debounced)
     */
    function handleResize() {
        clearTimeout(resizeTimeout);
        
        resizeTimeout = setTimeout(() => {
            logVerbose(`Window resized: ${window.innerWidth}x${window.innerHeight}`);
            updateState();
            updateBodyClasses();
            
            // Dispatch custom event
            window.dispatchEvent(new CustomEvent('platformChange', {
                detail: getPublicAPI()
            }));
        }, CONFIG.debounce.resize);
    }
    
    /**
     * Handle orientation change
     */
    function handleOrientationChange() {
        log(`Orientation changed to: ${detectOrientation()}`);
        updateState();
        updateBodyClasses();
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('orientationChange', {
            detail: {
                orientation: state.orientation,
                width: state.width,
                height: state.height
            }
        }));
    }
    
    // =========================================================================
    // PUBLIC API
    // =========================================================================
    
    /**
     * Get current platform state
     * @returns {Object} - Public state object
     */
    function getPublicAPI() {
        return {
            platform: state.platform,
            width: state.width,
            height: state.height,
            orientation: state.orientation,
            hasTouch: state.hasTouch,
            os: state.os,
            browser: state.browser,
            deviceModel: getDeviceModel(),
            isMobile: () => state.platform === 'mobile',
            isTablet: () => state.platform === 'tablet',
            isDesktop: () => state.platform === 'desktop',
            isPortrait: () => state.orientation === 'portrait',
            isLandscape: () => state.orientation === 'landscape',
            isTouchDevice: () => state.hasTouch,
            isIOS: () => state.os === 'iOS',
            isAndroid: () => state.os === 'Android',
            getBreakpoint: () => {
                if (state.width <= CONFIG.breakpoints.mobile) return 'mobile';
                if (state.width <= CONFIG.breakpoints.tablet) return 'tablet';
                return 'desktop';
            },
            matchesBreakpoint: (breakpoint) => {
                switch(breakpoint) {
                    case 'mobile': return state.width <= CONFIG.breakpoints.mobile;
                    case 'tablet': return state.width > CONFIG.breakpoints.mobile && state.width <= CONFIG.breakpoints.tablet;
                    case 'desktop': return state.width > CONFIG.breakpoints.tablet;
                    default: return false;
                }
            }
        };
    }
    
    // =========================================================================
    // INITIALIZATION
    // =========================================================================
    
    /**
     * Initialize the platform detector
     * @returns {Object} - Public API
     */
    function init() {
        if (state.initialized) {
            log('Platform Detector already initialized', 'warn');
            return getPublicAPI();
        }
        
        log('Platform Detector initializing...', 'info');
        
        try {
            // Update initial state
            updateState();
            updateBodyClasses();
            
            // Set up event listeners
            window.addEventListener('resize', handleResize);
            window.addEventListener('orientationchange', handleOrientationChange);
            
            // Mark as initialized
            state.initialized = true;
            
            // Log success
            log('Platform Detector initialized successfully!', 'success');
            logPlatformInfo();
            
            // Log specific platform
            const emoji = state.platform === 'mobile' ? '📱' : 
                         state.platform === 'tablet' ? '📲' : '🖥️';
            log(`${emoji} Platform: ${state.platform.toUpperCase()} (${state.width}x${state.height})`);
            log(`📐 Orientation: ${state.orientation}`);
            log(`👆 Touch: ${state.hasTouch ? 'Enabled' : 'Disabled'}`);
            log(`💻 OS: ${state.os} | Browser: ${state.browser}`);
            log(`📱 Device: ${getDeviceModel()}`);
            
        } catch (error) {
            log(`Initialization error: ${error.message}`, 'error');
            console.error(error);
        }
        
        return getPublicAPI();
    }
    
    /**
     * Destroy the platform detector (cleanup)
     */
    function destroy() {
        if (!state.initialized) return;
        
        log('Destroying Platform Detector...', 'info');
        
        // Remove event listeners
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('orientationchange', handleOrientationChange);
        
        // Clear state
        state.initialized = false;
        
        log('Platform Detector destroyed', 'success');
    }
    
    /**
     * Enable/disable logging
     * @param {boolean} enabled - Enable or disable logging
     */
    function setLogging(enabled) {
        CONFIG.logging.enabled = enabled;
        log(`Logging ${enabled ? 'enabled' : 'disabled'}`, 'info');
    }
    
    /**
     * Enable/disable verbose logging
     * @param {boolean} verbose - Enable or disable verbose logging
     */
    function setVerbose(verbose) {
        CONFIG.logging.verbose = verbose;
        log(`Verbose logging ${verbose ? 'enabled' : 'disabled'}`, 'info');
    }
    
    // =========================================================================
    // EXPORT PUBLIC API
    // =========================================================================
    
    return {
        init,
        destroy,
        setLogging,
        setVerbose,
        get: getPublicAPI,
        // Expose for testing
        _config: CONFIG,
        _state: state
    };
    
})();

// =========================================================================
// AUTO-INITIALIZATION (Optional)
// =========================================================================

// Uncomment to auto-initialize when script loads
// if (document.readyState === 'loading') {
//     document.addEventListener('DOMContentLoaded', () => PlatformDetector.init());
// } else {
//     PlatformDetector.init();
// }

// =========================================================================
// EXPORT (for module systems)
// =========================================================================

// CommonJS
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PlatformDetector;
}

// AMD
if (typeof define === 'function' && define.amd) {
    define([], function() {
        return PlatformDetector;
    });
}

// Global export
if (typeof window !== 'undefined') {
    window.PlatformDetector = PlatformDetector;
}
