/**
 * ============================================================================
 * KURUKSHETRA MITRA - VOICE RECOGNITION MODULE
 * Speech-to-Text & Voice Commands
 * Version: 1.0.0
 * ============================================================================
 * 
 * This module provides voice recognition capabilities including:
 * - Speech-to-text conversion
 * - Voice commands
 * - Hands-free search
 * - Continuous listening mode
 * - Language support
 * - Visual feedback
 * 
 * Features:
 * - Web Speech API integration
 * - Voice command parsing
 * - Real-time transcription
 * - Language selection
 * - Noise cancellation hints
 * - Visual indicators
 * - Console logging
 * 
 * Browser Support:
 * - Chrome/Edge: Full support
 * - Safari: Partial support
 * - Firefox: Limited support
 * 
 * Dependencies: None (uses native Web Speech API)
 * Last Updated: January 23, 2026
 */

const VoiceRecognition = (function() {
    'use strict';
    
    // =========================================================================
    // CONFIGURATION
    // =========================================================================
    
    const CONFIG = {
        logging: {
            enabled: true,
            prefix: '🎤'
        },
        version: '1.0.0',
        
        // Speech recognition settings
        recognition: {
            lang: 'en-US',              // Default language
            continuous: false,           // Continuous listening
            interimResults: true,        // Show interim results
            maxAlternatives: 1          // Number of alternatives
        },
        
        // Voice commands
        commands: {
            'search': ['search for', 'find', 'look for', 'show me'],
            'navigate': ['go to', 'open', 'navigate to', 'take me to'],
            'weather': ['weather', 'temperature', 'forecast'],
            'directions': ['directions', 'how to reach', 'how to get to'],
            'events': ['events', 'festivals', 'celebrations'],
            'help': ['help', 'what can you do', 'commands'],
            'stop': ['stop', 'cancel', 'nevermind']
        },
        
        // Supported languages
        languages: [
            { code: 'en-US', name: 'English (US)' },
            { code: 'en-GB', name: 'English (UK)' },
            { code: 'hi-IN', name: 'Hindi (India)' },
            { code: 'pa-IN', name: 'Punjabi (India)' }
        ],
        
        // Timeout settings
        timeout: {
            silenceTimeout: 3000,       // Stop after 3s of silence
            maxDuration: 30000          // Maximum 30s recording
        }
    };
    
    // =========================================================================
    // STATE
    // =========================================================================
    
    let state = {
        initialized: false,
        supported: false,
        recognition: null,
        isListening: false,
        isPaused: false,
        
        // Results
        transcript: '',
        interimTranscript: '',
        confidence: 0,
        
        // Language
        currentLanguage: CONFIG.recognition.lang,
        
        // Callbacks
        callbacks: {
            onResult: null,
            onCommand: null,
            onStart: null,
            onEnd: null,
            onError: null
        },
        
        // Timers
        silenceTimer: null,
        maxDurationTimer: null
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
    // BROWSER SUPPORT CHECK
    // =========================================================================
    
    /**
     * Check if speech recognition is supported
     * @returns {boolean} - Support status
     */
    function checkSupport() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            log('Speech Recognition not supported in this browser', 'warn');
            return false;
        }
        
        log('Speech Recognition supported', 'success');
        return true;
    }
    
    // =========================================================================
    // SPEECH RECOGNITION SETUP
    // =========================================================================
    
    /**
     * Initialize speech recognition
     */
    function setupRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            throw new Error('Speech Recognition not supported');
        }
        
        state.recognition = new SpeechRecognition();
        
        // Configure recognition
        state.recognition.lang = state.currentLanguage;
        state.recognition.continuous = CONFIG.recognition.continuous;
        state.recognition.interimResults = CONFIG.recognition.interimResults;
        state.recognition.maxAlternatives = CONFIG.recognition.maxAlternatives;
        
        // Event handlers
        state.recognition.onstart = handleStart;
        state.recognition.onresult = handleResult;
        state.recognition.onerror = handleError;
        state.recognition.onend = handleEnd;
        state.recognition.onspeechstart = handleSpeechStart;
        state.recognition.onspeechend = handleSpeechEnd;
        state.recognition.onaudiostart = handleAudioStart;
        state.recognition.onaudioend = handleAudioEnd;
        
        log('Recognition configured');
    }
    
    // =========================================================================
    // EVENT HANDLERS
    // =========================================================================
    
    /**
     * Handle recognition start
     */
    function handleStart() {
        state.isListening = true;
        log('Recognition started', 'success');
        
        // Start max duration timer
        state.maxDurationTimer = setTimeout(() => {
            log('Max duration reached, stopping...', 'warn');
            stop();
        }, CONFIG.timeout.maxDuration);
        
        // Callback
        if (state.callbacks.onStart) {
            state.callbacks.onStart();
        }
    }
    
    /**
     * Handle recognition result
     * @param {Event} event - Result event
     */
    function handleResult(event) {
        let interimTranscript = '';
        let finalTranscript = '';
        
        // Process results
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            const transcript = result[0].transcript;
            
            if (result.isFinal) {
                finalTranscript += transcript + ' ';
                state.confidence = result[0].confidence;
            } else {
                interimTranscript += transcript;
            }
        }
        
        // Update state
        if (finalTranscript) {
            state.transcript = finalTranscript.trim();
            log(`Final: "${state.transcript}" (confidence: ${(state.confidence * 100).toFixed(0)}%)`);
            
            // Check for commands
            const command = parseCommand(state.transcript);
            if (command) {
                handleCommand(command);
            }
            
            // Callback
            if (state.callbacks.onResult) {
                state.callbacks.onResult({
                    transcript: state.transcript,
                    confidence: state.confidence,
                    isFinal: true
                });
            }
        }
        
        if (interimTranscript) {
            state.interimTranscript = interimTranscript;
            log(`Interim: "${interimTranscript}"`);
            
            // Callback
            if (state.callbacks.onResult) {
                state.callbacks.onResult({
                    transcript: interimTranscript,
                    confidence: 0,
                    isFinal: false
                });
            }
        }
        
        // Reset silence timer
        resetSilenceTimer();
    }
    
    /**
     * Handle recognition error
     * @param {Event} event - Error event
     */
    function handleError(event) {
        log(`Recognition error: ${event.error}`, 'error');
        
        const errorMessages = {
            'no-speech': 'No speech detected',
            'audio-capture': 'No microphone found',
            'not-allowed': 'Microphone permission denied',
            'network': 'Network error',
            'aborted': 'Recognition aborted'
        };
        
        const message = errorMessages[event.error] || event.error;
        
        // Callback
        if (state.callbacks.onError) {
            state.callbacks.onError({
                error: event.error,
                message: message
            });
        }
    }
    
    /**
     * Handle recognition end
     */
    function handleEnd() {
        state.isListening = false;
        clearTimers();
        
        log('Recognition ended');
        
        // Callback
        if (state.callbacks.onEnd) {
            state.callbacks.onEnd({
                transcript: state.transcript,
                confidence: state.confidence
            });
        }
    }
    
    /**
     * Handle speech start
     */
    function handleSpeechStart() {
        log('Speech detected');
    }
    
    /**
     * Handle speech end
     */
    function handleSpeechEnd() {
        log('Speech ended');
        startSilenceTimer();
    }
    
    /**
     * Handle audio start
     */
    function handleAudioStart() {
        log('Audio input started');
    }
    
    /**
     * Handle audio end
     */
    function handleAudioEnd() {
        log('Audio input ended');
    }
    
    // =========================================================================
    // COMMAND PARSING
    // =========================================================================
    
    /**
     * Parse voice command
     * @param {string} text - Transcript text
     * @returns {Object|null} - Parsed command
     */
    function parseCommand(text) {
        const lowerText = text.toLowerCase();
        
        // Check each command type
        for (const [commandType, triggers] of Object.entries(CONFIG.commands)) {
            for (const trigger of triggers) {
                if (lowerText.includes(trigger)) {
                    // Extract the query (text after trigger)
                    const index = lowerText.indexOf(trigger);
                    const query = text.substring(index + trigger.length).trim();
                    
                    return {
                        type: commandType,
                        trigger: trigger,
                        query: query,
                        fullText: text
                    };
                }
            }
        }
        
        // No command found, treat as general search
        return {
            type: 'search',
            trigger: '',
            query: text,
            fullText: text
        };
    }
    
    /**
     * Handle parsed command
     * @param {Object} command - Parsed command
     */
    function handleCommand(command) {
        log(`Command detected: ${command.type} - "${command.query}"`);
        
        // Callback
        if (state.callbacks.onCommand) {
            state.callbacks.onCommand(command);
        }
    }
    
    // =========================================================================
    // TIMER MANAGEMENT
    // =========================================================================
    
    /**
     * Start silence timer
     */
    function startSilenceTimer() {
        clearTimeout(state.silenceTimer);
        state.silenceTimer = setTimeout(() => {
            if (state.isListening) {
                log('Silence timeout, stopping...', 'warn');
                stop();
            }
        }, CONFIG.timeout.silenceTimeout);
    }
    
    /**
     * Reset silence timer
     */
    function resetSilenceTimer() {
        clearTimeout(state.silenceTimer);
    }
    
    /**
     * Clear all timers
     */
    function clearTimers() {
        clearTimeout(state.silenceTimer);
        clearTimeout(state.maxDurationTimer);
    }
    
    // =========================================================================
    // CONTROL FUNCTIONS
    // =========================================================================
    
    /**
     * Start voice recognition
     */
    function start() {
        if (!state.supported) {
            log('Cannot start - not supported', 'error');
            return false;
        }
        
        if (state.isListening) {
            log('Already listening', 'warn');
            return false;
        }
        
        try {
            // Reset state
            state.transcript = '';
            state.interimTranscript = '';
            state.confidence = 0;
            
            // Start recognition
            state.recognition.start();
            log('Starting recognition...', 'info');
            return true;
            
        } catch (error) {
            log(`Start error: ${error.message}`, 'error');
            return false;
        }
    }
    
    /**
     * Stop voice recognition
     */
    function stop() {
        if (!state.isListening) {
            log('Not listening', 'warn');
            return false;
        }
        
        try {
            state.recognition.stop();
            log('Stopping recognition...', 'info');
            return true;
            
        } catch (error) {
            log(`Stop error: ${error.message}`, 'error');
            return false;
        }
    }
    
    /**
     * Abort voice recognition
     */
    function abort() {
        if (!state.isListening) {
            return false;
        }
        
        try {
            state.recognition.abort();
            log('Aborting recognition...', 'info');
            return true;
            
        } catch (error) {
            log(`Abort error: ${error.message}`, 'error');
            return false;
        }
    }
    
    /**
     * Toggle listening
     */
    function toggle() {
        if (state.isListening) {
            return stop();
        } else {
            return start();
        }
    }
    
    // =========================================================================
    // LANGUAGE MANAGEMENT
    // =========================================================================
    
    /**
     * Set recognition language
     * @param {string} langCode - Language code (e.g., 'en-US')
     */
    function setLanguage(langCode) {
        const language = CONFIG.languages.find(l => l.code === langCode);
        
        if (!language) {
            log(`Language not supported: ${langCode}`, 'warn');
            return false;
        }
        
        state.currentLanguage = langCode;
        
        if (state.recognition) {
            state.recognition.lang = langCode;
        }
        
        log(`Language set to: ${language.name}`, 'success');
        return true;
    }
    
    /**
     * Get available languages
     * @returns {Array} - Supported languages
     */
    function getLanguages() {
        return [...CONFIG.languages];
    }
    
    /**
     * Get current language
     * @returns {Object} - Current language
     */
    function getCurrentLanguage() {
        return CONFIG.languages.find(l => l.code === state.currentLanguage);
    }
    
    // =========================================================================
    // CALLBACK MANAGEMENT
    // =========================================================================
    
    /**
     * Set result callback
     * @param {Function} callback - Callback function
     */
    function onResult(callback) {
        state.callbacks.onResult = callback;
    }
    
    /**
     * Set command callback
     * @param {Function} callback - Callback function
     */
    function onCommand(callback) {
        state.callbacks.onCommand = callback;
    }
    
    /**
     * Set start callback
     * @param {Function} callback - Callback function
     */
    function onStart(callback) {
        state.callbacks.onStart = callback;
    }
    
    /**
     * Set end callback
     * @param {Function} callback - Callback function
     */
    function onEnd(callback) {
        state.callbacks.onEnd = callback;
    }
    
    /**
     * Set error callback
     * @param {Function} callback - Callback function
     */
    function onError(callback) {
        state.callbacks.onError = callback;
    }
    
    // =========================================================================
    // HELPER FUNCTIONS
    // =========================================================================
    
    /**
     * Request microphone permission
     * @returns {Promise} - Permission result
     */
    async function requestPermission() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(track => track.stop());
            log('Microphone permission granted', 'success');
            return true;
        } catch (error) {
            log('Microphone permission denied', 'error');
            return false;
        }
    }
    
    /**
     * Get current state
     * @returns {Object} - Current state
     */
    function getState() {
        return {
            supported: state.supported,
            isListening: state.isListening,
            transcript: state.transcript,
            confidence: state.confidence,
            language: state.currentLanguage
        };
    }
    
    // =========================================================================
    // INITIALIZATION
    // =========================================================================
    
    /**
     * Initialize Voice Recognition
     * @param {Object} options - Configuration options
     * @returns {Object} - Public API
     */
    function init(options = {}) {
        if (state.initialized) {
            log('Voice Recognition already initialized', 'warn');
            return getPublicAPI();
        }
        
        log('Voice Recognition initializing...', 'info');
        
        try {
            // Check browser support
            state.supported = checkSupport();
            
            if (!state.supported) {
                log('Voice Recognition not available', 'warn');
                state.initialized = true;
                return getPublicAPI();
            }
            
            // Setup recognition
            setupRecognition();
            
            // Apply options
            if (options.language) {
                setLanguage(options.language);
            }
            
            if (options.continuous !== undefined) {
                CONFIG.recognition.continuous = options.continuous;
            }
            
            // Set callbacks
            if (options.onResult) onResult(options.onResult);
            if (options.onCommand) onCommand(options.onCommand);
            if (options.onStart) onStart(options.onStart);
            if (options.onEnd) onEnd(options.onEnd);
            if (options.onError) onError(options.onError);
            
            state.initialized = true;
            
            log('Voice Recognition initialized successfully!', 'success');
            log(`Language: ${getCurrentLanguage().name}`);
            log(`Continuous: ${CONFIG.recognition.continuous}`);
            
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
            // Control functions
            start,
            stop,
            abort,
            toggle,
            
            // Language functions
            setLanguage,
            getLanguages,
            getCurrentLanguage,
            
            // Callback setters
            onResult,
            onCommand,
            onStart,
            onEnd,
            onError,
            
            // Helper functions
            requestPermission,
            getState,
            parseCommand,
            
            // State queries
            isSupported: () => state.supported,
            isListening: () => state.isListening,
            getTranscript: () => state.transcript,
            getConfidence: () => state.confidence,
            
            // Configuration
            setLogging: (enabled) => { CONFIG.logging.enabled = enabled; },
            setContinuous: (continuous) => {
                CONFIG.recognition.continuous = continuous;
                if (state.recognition) {
                    state.recognition.continuous = continuous;
                }
            },
            
            // Metadata
            version: CONFIG.version,
            commands: CONFIG.commands
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
    module.exports = VoiceRecognition;
}

// AMD
if (typeof define === 'function' && define.amd) {
    define([], function() {
        return VoiceRecognition;
    });
}

// Global export
if (typeof window !== 'undefined') {
    window.VoiceRecognition = VoiceRecognition;
}
