/**
 * ============================================================================
 * KURUKSHETRA MITRA - MODAL CONTROLLER
 * Beautiful Popups, Overlays & Dialogs
 * Version: 1.0.0
 * ============================================================================
 * 
 * This module manages all modal dialogs, popups, and overlays including:
 * - Site detail modals
 * - Q&A display modals
 * - Image galleries
 * - Confirmation dialogs
 * - Alert messages
 * - Info panels
 * 
 * Features:
 * - Multiple modal types
 * - Smooth animations
 * - Keyboard support (ESC to close)
 * - Click outside to close
 * - Stacking support
 * - Mobile responsive
 * - Console logging
 * 
 * Dependencies: None (vanilla JavaScript)
 * Last Updated: January 23, 2026
 */

const ModalController = (function() {
    'use strict';
    
    // =========================================================================
    // CONFIGURATION
    // =========================================================================
    
    const CONFIG = {
        logging: {
            enabled: true,
            prefix: '🪟'
        },
        version: '1.0.0',
        
        // Modal types
        types: {
            SITE_DETAIL: 'site_detail',
            QUESTION: 'question',
            IMAGE_GALLERY: 'image_gallery',
            WEATHER: 'weather',
            DIRECTIONS: 'directions',
            EVENTS: 'events',
            CONFIRM: 'confirm',
            ALERT: 'alert',
            INFO: 'info',
            CUSTOM: 'custom'
        },
        
        // Animation settings
        animation: {
            duration: 300,  // milliseconds
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        },
        
        // Z-index management
        baseZIndex: 10000,
        
        // Classes
        classes: {
            overlay: 'modal-overlay',
            container: 'modal-container',
            content: 'modal-content',
            header: 'modal-header',
            body: 'modal-body',
            footer: 'modal-footer',
            closeBtn: 'modal-close',
            active: 'modal-active'
        }
    };
    
    // =========================================================================
    // STATE
    // =========================================================================
    
    let state = {
        initialized: false,
        activeModals: [],
        modalCounter: 0,
        defaultOptions: {
            closeOnEscape: true,
            closeOnOverlayClick: true,
            showCloseButton: true,
            backdrop: true,
            centered: true,
            size: 'medium'  // small, medium, large, fullscreen
        }
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
    // MODAL STRUCTURE CREATION
    // =========================================================================
    
    /**
     * Create modal HTML structure
     * @param {Object} options - Modal options
     * @returns {Object} - Modal elements
     */
    function createModalStructure(options) {
        const modalId = `modal-${++state.modalCounter}`;
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = CONFIG.classes.overlay;
        overlay.id = `${modalId}-overlay`;
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(4px);
            z-index: ${CONFIG.baseZIndex + (state.modalCounter * 10)};
            opacity: 0;
            transition: opacity ${CONFIG.animation.duration}ms ${CONFIG.animation.easing};
            display: flex;
            align-items: ${options.centered ? 'center' : 'flex-start'};
            justify-content: center;
            padding: 2rem;
            overflow-y: auto;
        `;
        
        // Create container
        const container = document.createElement('div');
        container.className = CONFIG.classes.container;
        container.id = modalId;
        container.setAttribute('role', 'dialog');
        container.setAttribute('aria-modal', 'true');
        
        // Size classes
        const sizeMap = {
            small: '400px',
            medium: '600px',
            large: '900px',
            fullscreen: '95vw'
        };
        
        container.style.cssText = `
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: ${sizeMap[options.size] || sizeMap.medium};
            width: 100%;
            max-height: 90vh;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            transform: scale(0.9) translateY(20px);
            opacity: 0;
            transition: all ${CONFIG.animation.duration}ms ${CONFIG.animation.easing};
        `;
        
        // Create header
        const header = document.createElement('div');
        header.className = CONFIG.classes.header;
        header.style.cssText = `
            padding: 1.5rem 2rem;
            border-bottom: 2px solid #e6d5c3;
            display: flex;
            align-items: center;
            justify-content: space-between;
        `;
        
        const title = document.createElement('h2');
        title.style.cssText = `
            margin: 0;
            font-size: 1.5rem;
            color: #8B4513;
            font-weight: 600;
        `;
        title.textContent = options.title || '';
        header.appendChild(title);
        
        // Close button
        if (options.showCloseButton) {
            const closeBtn = document.createElement('button');
            closeBtn.className = CONFIG.classes.closeBtn;
            closeBtn.innerHTML = '&times;';
            closeBtn.setAttribute('aria-label', 'Close modal');
            closeBtn.style.cssText = `
                background: none;
                border: none;
                font-size: 2rem;
                color: #999;
                cursor: pointer;
                padding: 0;
                width: 2rem;
                height: 2rem;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.2s;
            `;
            closeBtn.addEventListener('mouseenter', () => {
                closeBtn.style.background = '#f0f0f0';
                closeBtn.style.color = '#333';
            });
            closeBtn.addEventListener('mouseleave', () => {
                closeBtn.style.background = 'none';
                closeBtn.style.color = '#999';
            });
            header.appendChild(closeBtn);
        }
        
        // Create body
        const body = document.createElement('div');
        body.className = CONFIG.classes.body;
        body.style.cssText = `
            padding: 2rem;
            overflow-y: auto;
            flex: 1;
        `;
        
        // Create footer (optional)
        const footer = document.createElement('div');
        footer.className = CONFIG.classes.footer;
        footer.style.cssText = `
            padding: 1.5rem 2rem;
            border-top: 2px solid #e6d5c3;
            display: flex;
            gap: 1rem;
            justify-content: flex-end;
        `;
        
        // Assemble
        container.appendChild(header);
        container.appendChild(body);
        if (options.footer) {
            container.appendChild(footer);
        }
        
        overlay.appendChild(container);
        
        return {
            id: modalId,
            overlay,
            container,
            header,
            title,
            closeBtn: header.querySelector(`.${CONFIG.classes.closeBtn}`),
            body,
            footer: options.footer ? footer : null
        };
    }
    
    // =========================================================================
    // MODAL OPEN/CLOSE
    // =========================================================================
    
    /**
     * Open modal
     * @param {Object} options - Modal options
     * @returns {Object} - Modal instance
     */
    function open(options = {}) {
        // Merge with defaults
        const config = { ...state.defaultOptions, ...options };
        
        log(`Opening modal: ${config.type || 'custom'}`);
        
        // Create modal structure
        const elements = createModalStructure(config);
        
        // Populate content based on type
        if (config.type) {
            populateModalContent(elements, config);
        } else if (config.content) {
            if (typeof config.content === 'string') {
                elements.body.innerHTML = config.content;
            } else {
                elements.body.appendChild(config.content);
            }
        }
        
        // Add footer buttons if provided
        if (config.buttons && elements.footer) {
            config.buttons.forEach(btn => {
                const button = document.createElement('button');
                button.textContent = btn.text;
                button.className = btn.className || '';
                button.style.cssText = `
                    padding: 0.8rem 2rem;
                    border: none;
                    border-radius: 10px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    ${btn.primary ? 
                        'background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%); color: white;' :
                        'background: #f0f0f0; color: #333;'}
                `;
                button.addEventListener('click', () => {
                    if (btn.onClick) btn.onClick();
                    if (btn.closeOnClick !== false) close(modal);
                });
                elements.footer.appendChild(button);
            });
        }
        
        // Append to body
        document.body.appendChild(elements.overlay);
        
        // Create modal instance
        const modal = {
            id: elements.id,
            elements,
            options: config,
            close: () => close(modal)
        };
        
        // Add to active modals
        state.activeModals.push(modal);
        
        // Event listeners
        setupEventListeners(modal);
        
        // Animate in
        requestAnimationFrame(() => {
            elements.overlay.style.opacity = '1';
            elements.container.style.transform = 'scale(1) translateY(0)';
            elements.container.style.opacity = '1';
        });
        
        // Prevent body scroll
        if (state.activeModals.length === 1) {
            document.body.style.overflow = 'hidden';
        }
        
        log(`Modal opened: ${elements.id}`, 'success');
        return modal;
    }
    
    /**
     * Close modal
     * @param {Object} modal - Modal instance
     */
    function close(modal) {
        if (!modal || !modal.elements) return;
        
        log(`Closing modal: ${modal.id}`);
        
        // Animate out
        modal.elements.overlay.style.opacity = '0';
        modal.elements.container.style.transform = 'scale(0.9) translateY(20px)';
        modal.elements.container.style.opacity = '0';
        
        setTimeout(() => {
            // Remove from DOM
            if (modal.elements.overlay.parentNode) {
                modal.elements.overlay.remove();
            }
            
            // Remove from active modals
            state.activeModals = state.activeModals.filter(m => m.id !== modal.id);
            
            // Restore body scroll if no modals
            if (state.activeModals.length === 0) {
                document.body.style.overflow = '';
            }
            
            // Callback
            if (modal.options.onClose) {
                modal.options.onClose();
            }
            
            log(`Modal closed: ${modal.id}`, 'success');
        }, CONFIG.animation.duration);
    }
    
    /**
     * Close all modals
     */
    function closeAll() {
        log('Closing all modals');
        [...state.activeModals].forEach(modal => close(modal));
    }
    
    /**
     * Close top modal
     */
    function closeTop() {
        if (state.activeModals.length > 0) {
            close(state.activeModals[state.activeModals.length - 1]);
        }
    }
    
    // =========================================================================
    // EVENT LISTENERS
    // =========================================================================
    
    /**
     * Setup event listeners for modal
     * @param {Object} modal - Modal instance
     */
    function setupEventListeners(modal) {
        const { elements, options } = modal;
        
        // Close button
        if (elements.closeBtn) {
            elements.closeBtn.addEventListener('click', () => close(modal));
        }
        
        // Overlay click
        if (options.closeOnOverlayClick) {
            elements.overlay.addEventListener('click', (e) => {
                if (e.target === elements.overlay) {
                    close(modal);
                }
            });
        }
        
        // ESC key
        if (options.closeOnEscape) {
            const handleEscape = (e) => {
                if (e.key === 'Escape' && state.activeModals[state.activeModals.length - 1] === modal) {
                    close(modal);
                    document.removeEventListener('keydown', handleEscape);
                }
            };
            document.addEventListener('keydown', handleEscape);
        }
    }
    
    // =========================================================================
    // MODAL CONTENT POPULATORS
    // =========================================================================
    
    /**
     * Populate modal content based on type
     * @param {Object} elements - Modal elements
     * @param {Object} config - Modal config
     */
    function populateModalContent(elements, config) {
        switch(config.type) {
            case CONFIG.types.SITE_DETAIL:
                populateSiteDetail(elements, config.data);
                break;
            case CONFIG.types.QUESTION:
                populateQuestion(elements, config.data);
                break;
            case CONFIG.types.WEATHER:
                populateWeather(elements, config.data);
                break;
            case CONFIG.types.EVENTS:
                populateEvents(elements, config.data);
                break;
            case CONFIG.types.DIRECTIONS:
                populateDirections(elements, config.data);
                break;
            case CONFIG.types.ALERT:
                populateAlert(elements, config);
                break;
            case CONFIG.types.CONFIRM:
                populateConfirm(elements, config);
                break;
        }
    }
    
    /**
     * Populate site detail modal
     */
    function populateSiteDetail(elements, site) {
        if (!site) return;
        
        elements.title.textContent = site.name;
        
        elements.body.innerHTML = `
            <div style="line-height: 1.8; color: #333;">
                <p style="font-size: 1.1rem; margin-bottom: 1.5rem;">${site.description || ''}</p>
                
                ${site.location ? `
                    <div style="margin-bottom: 1rem;">
                        <strong style="color: #8B4513;">📍 Location:</strong><br>
                        ${site.location.address || ''}
                    </div>
                ` : ''}
                
                ${site.timings ? `
                    <div style="margin-bottom: 1rem;">
                        <strong style="color: #8B4513;">🕐 Timings:</strong> ${site.timings}
                    </div>
                ` : ''}
                
                ${site.entryFee ? `
                    <div style="margin-bottom: 1rem;">
                        <strong style="color: #8B4513;">💰 Entry Fee:</strong> ${site.entryFee}
                    </div>
                ` : ''}
                
                ${site.duration ? `
                    <div style="margin-bottom: 1rem;">
                        <strong style="color: #8B4513;">⏱️ Duration:</strong> ${site.duration}
                    </div>
                ` : ''}
                
                ${site.bestTimeToVisit ? `
                    <div style="margin-bottom: 1rem;">
                        <strong style="color: #8B4513;">🌟 Best Time:</strong> ${site.bestTimeToVisit}
                    </div>
                ` : ''}
                
                ${site.facilities && site.facilities.length ? `
                    <div style="margin-top: 1.5rem;">
                        <strong style="color: #8B4513;">🏢 Facilities:</strong><br>
                        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem;">
                            ${site.facilities.map(f => `
                                <span style="background: #e6d5c3; padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem;">${f}</span>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    /**
     * Populate question modal
     */
    function populateQuestion(elements, question) {
        if (!question) return;
        
        elements.title.textContent = question.question;
        
        elements.body.innerHTML = `
            <div style="line-height: 1.8; color: #333;">
                <div style="background: #fffaf0; padding: 1.5rem; border-left: 4px solid #d4af37; border-radius: 8px;">
                    ${question.answer}
                </div>
                ${question.category ? `
                    <div style="margin-top: 1.5rem; text-align: right;">
                        <span style="background: #8B4513; color: white; padding: 0.3rem 1rem; border-radius: 15px; font-size: 0.85rem;">
                            ${question.category}
                        </span>
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    /**
     * Populate weather modal
     */
    function populateWeather(elements, weather) {
        if (!weather) return;
        
        elements.title.textContent = `Weather - ${weather.location}`;
        
        elements.body.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">☀️</div>
                <div style="font-size: 3rem; font-weight: bold; color: #8B4513; margin-bottom: 1rem;">${weather.temp}°C</div>
                <div style="font-size: 1.2rem; color: #666; margin-bottom: 2rem; text-transform: capitalize;">${weather.description}</div>
                
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; text-align: left;">
                    <div style="background: #f8f9fa; padding: 1rem; border-radius: 10px;">
                        <strong>Feels Like:</strong><br>${weather.feels_like}°C
                    </div>
                    <div style="background: #f8f9fa; padding: 1rem; border-radius: 10px;">
                        <strong>Humidity:</strong><br>${weather.humidity}%
                    </div>
                    <div style="background: #f8f9fa; padding: 1rem; border-radius: 10px;">
                        <strong>Wind:</strong><br>${weather.wind_speed} m/s
                    </div>
                    <div style="background: #f8f9fa; padding: 1rem; border-radius: 10px;">
                        <strong>Sunrise:</strong><br>${weather.sunrise}
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Populate events modal
     */
    function populateEvents(elements, events) {
        if (!events || events.length === 0) return;
        
        elements.title.textContent = 'Upcoming Events';
        
        elements.body.innerHTML = events.map(event => `
            <div style="background: #fffaf0; padding: 1.5rem; border-left: 4px solid #d4af37; border-radius: 8px; margin-bottom: 1rem;">
                <h3 style="color: #8B4513; margin-bottom: 0.5rem;">${event.title}</h3>
                <div style="color: #d4af37; font-size: 0.9rem; margin-bottom: 0.5rem;">📅 ${event.date}</div>
                <p style="color: #666; margin-bottom: 0.5rem;">${event.description}</p>
                ${event.location ? `<div style="color: #888; font-size: 0.85rem;">📍 ${event.location}</div>` : ''}
            </div>
        `).join('');
    }
    
    /**
     * Populate directions modal
     */
    function populateDirections(elements, directions) {
        if (!directions) return;
        
        elements.title.textContent = 'Directions to Kurukshetra';
        
        elements.body.innerHTML = `
            <div style="margin-bottom: 1.5rem; text-align: center;">
                <div style="font-size: 1.5rem; color: #8B4513; font-weight: bold;">${directions.distance}</div>
                <div style="color: #666;">Approximately ${directions.duration}</div>
            </div>
            
            ${directions.routes ? directions.routes.map(route => `
                <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 10px; margin-bottom: 1rem;">
                    <h3 style="color: #8B4513; margin-bottom: 1rem;">${route.name}</h3>
                    <div style="margin-bottom: 0.5rem;">📏 Distance: ${route.distance}</div>
                    <div style="margin-bottom: 1rem;">⏱️ Duration: ${route.duration}</div>
                    <ol style="padding-left: 1.5rem;">
                        ${route.steps.map(step => `<li style="margin-bottom: 0.5rem;">${step}</li>`).join('')}
                    </ol>
                </div>
            `).join('') : ''}
        `;
    }
    
    /**
     * Populate alert modal
     */
    function populateAlert(elements, config) {
        elements.title.textContent = config.title || 'Alert';
        elements.body.innerHTML = `
            <div style="text-align: center; padding: 2rem 0;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">${config.icon || '⚠️'}</div>
                <p style="font-size: 1.1rem; color: #333;">${config.message || ''}</p>
            </div>
        `;
    }
    
    /**
     * Populate confirm modal
     */
    function populateConfirm(elements, config) {
        elements.title.textContent = config.title || 'Confirm';
        elements.body.innerHTML = `
            <div style="text-align: center; padding: 1rem 0;">
                <p style="font-size: 1.1rem; color: #333;">${config.message || ''}</p>
            </div>
        `;
    }
    
    // =========================================================================
    // HELPER FUNCTIONS
    // =========================================================================
    
    /**
     * Show alert modal
     * @param {string} message - Alert message
     * @param {Object} options - Additional options
     */
    function alert(message, options = {}) {
        return open({
            type: CONFIG.types.ALERT,
            title: options.title || 'Alert',
            message: message,
            icon: options.icon || '⚠️',
            size: 'small',
            buttons: [
                { text: 'OK', primary: true, closeOnClick: true }
            ],
            ...options
        });
    }
    
    /**
     * Show confirm modal
     * @param {string} message - Confirm message
     * @param {Object} options - Additional options
     */
    function confirm(message, options = {}) {
        return new Promise((resolve) => {
            open({
                type: CONFIG.types.CONFIRM,
                title: options.title || 'Confirm',
                message: message,
                size: 'small',
                buttons: [
                    { 
                        text: options.cancelText || 'Cancel', 
                        onClick: () => resolve(false),
                        closeOnClick: true
                    },
                    { 
                        text: options.confirmText || 'Confirm', 
                        primary: true,
                        onClick: () => resolve(true),
                        closeOnClick: true
                    }
                ],
                ...options
            });
        });
    }
    
    // =========================================================================
    // INITIALIZATION
    // =========================================================================
    
    /**
     * Initialize Modal Controller
     * @param {Object} options - Configuration options
     * @returns {Object} - Public API
     */
    function init(options = {}) {
        if (state.initialized) {
            log('Modal Controller already initialized', 'warn');
            return getPublicAPI();
        }
        
        log('Modal Controller initializing...', 'info');
        
        try {
            // Merge options
            if (options.defaultOptions) {
                Object.assign(state.defaultOptions, options.defaultOptions);
            }
            
            state.initialized = true;
            
            log('Modal Controller initialized successfully!', 'success');
            
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
            // Core functions
            open,
            close,
            closeAll,
            closeTop,
            
            // Helper functions
            alert,
            confirm,
            
            // Specific modals
            showSiteDetail: (site) => open({ type: CONFIG.types.SITE_DETAIL, data: site, title: site.name, size: 'large' }),
            showQuestion: (question) => open({ type: CONFIG.types.QUESTION, data: question, size: 'medium' }),
            showWeather: (weather) => open({ type: CONFIG.types.WEATHER, data: weather, size: 'medium' }),
            showEvents: (events) => open({ type: CONFIG.types.EVENTS, data: events, size: 'large' }),
            showDirections: (directions) => open({ type: CONFIG.types.DIRECTIONS, data: directions, size: 'large' }),
            
            // State queries
            getActiveModals: () => [...state.activeModals],
            hasActiveModals: () => state.activeModals.length > 0,
            getModalCount: () => state.activeModals.length,
            
            // Configuration
            setLogging: (enabled) => { CONFIG.logging.enabled = enabled; },
            
            // Metadata
            version: CONFIG.version,
            types: CONFIG.types
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
    module.exports = ModalController;
}

// AMD
if (typeof define === 'function' && define.amd) {
    define([], function() {
        return ModalController;
    });
}

// Global export
if (typeof window !== 'undefined') {
    window.ModalController = ModalController;
}
