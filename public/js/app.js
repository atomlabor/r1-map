/**
 * R1 Map - Main Application Controller
 * Rabbit R1 Creations App for Interactive Maps and Navigation
 * 
 * Based on the r1-flashlight app structure for Rabbit R1 hardware integration
 */

// Application state
const AppState = {
    isInitialized: false,
    isR1Device: false,
    currentLocation: null,
    mapLoaded: false,
    searchActive: false,
    routeActive: false,
    voiceActive: false
};

// DOM elements
const elements = {
    loading: null,
    app: null,
    map: null,
    searchPanel: null,
    routePanel: null,
    voiceIndicator: null,
    statusElements: {}
};

/**
 * Initialize the R1 Map Application
 */
function initializeApp() {
    console.log('🗺️ R1 Map App starting...');
    
    // Cache DOM elements
    elements.loading = document.getElementById('loading');
    elements.app = document.getElementById('app');
    elements.map = document.getElementById('map');
    elements.searchPanel = document.getElementById('search-panel');
    elements.routePanel = document.getElementById('route-panel');
    elements.voiceIndicator = document.getElementById('voice-indicator');
    
    // Status elements
    elements.statusElements.gps = document.getElementById('gps-status');
    elements.statusElements.battery = document.getElementById('battery-status');
    
    // Check if running on Rabbit R1
    checkR1Device();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize Rabbit Creations SDK (if available)
    initializeRabbitSDK();
    
    // Initialize map placeholder
    initializeMapPlaceholder();
    
    // Show app, hide loading
    showApp();
    
    AppState.isInitialized = true;
    console.log('✅ R1 Map App initialized successfully');
}

/**
 * Check if running on Rabbit R1 device
 */
function checkR1Device() {
    // TODO: Implement proper R1 device detection
    // This will be replaced with actual SDK detection
    AppState.isR1Device = typeof window.RabbitCreations !== 'undefined';
    
    if (AppState.isR1Device) {
        console.log('🐰 Running on Rabbit R1 device');
        document.body.classList.add('r1-device');
    } else {
        console.log('🖥️ Running in browser (development mode)');
        document.body.classList.add('browser-mode');
    }
}

/**
 * Setup event listeners for UI interactions
 */
function setupEventListeners() {
    // Control buttons
    document.getElementById('btn-location')?.addEventListener('click', handleLocationRequest);
    document.getElementById('btn-search')?.addEventListener('click', toggleSearch);
    document.getElementById('btn-route')?.addEventListener('click', toggleRoute);
    document.getElementById('btn-settings')?.addEventListener('click', handleSettings);
    
    // Search functionality
    document.getElementById('search-input')?.addEventListener('input', handleSearch);
    
    // Route functionality
    document.getElementById('btn-calculate-route')?.addEventListener('click', calculateRoute);
    
    // Voice control (R1 specific)
    if (AppState.isR1Device) {
        setupVoiceControls();
    }
    
    console.log('🎧 Event listeners setup complete');
}

/**
 * Initialize Rabbit Creations SDK
 */
function initializeRabbitSDK() {
    if (typeof window.RabbitCreations !== 'undefined') {
        console.log('🐰 Initializing Rabbit Creations SDK...');
        
        // TODO: Initialize SDK with proper configuration
        // window.RabbitCreations.init({
        //     appId: 'r1-map',
        //     version: '1.0.0'
        // });
        
        console.log('✅ Rabbit SDK initialized');
    } else {
        console.log('⚠️ Rabbit SDK not available (development mode)');
    }
}

/**
 * Initialize map placeholder
 */
function initializeMapPlaceholder() {
    const mapElement = elements.map;
    if (mapElement) {
        // TODO: Replace with actual map library integration
        // This is a placeholder for development
        const placeholder = mapElement.querySelector('.map-placeholder');
        if (placeholder) {
            placeholder.innerHTML = `
                <div class="map-status">
                    🗺️ Kartenintegration in Entwicklung<br>
                    📍 Organic Maps wird integriert<br>
                    🔄 Platzhalter aktiv
                </div>
            `;
        }
        
        AppState.mapLoaded = true;
        console.log('🗺️ Map placeholder initialized');
    }
}

/**
 * Show main app, hide loading screen
 */
function showApp() {
    if (elements.loading) {
        elements.loading.style.display = 'none';
    }
    if (elements.app) {
        elements.app.style.display = 'block';
    }
}

/**
 * Handle location request
 */
function handleLocationRequest() {
    console.log('📍 Location requested');
    updateStatus('gps', 'Suche Position...');
    
    // TODO: Implement geolocation with Rabbit R1 integration
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                AppState.currentLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                updateStatus('gps', 'Position gefunden');
                console.log('✅ Location acquired:', AppState.currentLocation);
            },
            (error) => {
                updateStatus('gps', 'GPS Fehler');
                console.error('❌ Location error:', error);
            }
        );
    } else {
        updateStatus('gps', 'GPS nicht verfügbar');
    }
}

/**
 * Toggle search panel
 */
function toggleSearch() {
    AppState.searchActive = !AppState.searchActive;
    
    if (elements.searchPanel) {
        elements.searchPanel.style.display = AppState.searchActive ? 'block' : 'none';
    }
    
    // Hide route panel if search is activated
    if (AppState.searchActive && AppState.routeActive) {
        toggleRoute();
    }
    
    console.log(`🔍 Search panel ${AppState.searchActive ? 'opened' : 'closed'}`);
}

/**
 * Toggle route panel
 */
function toggleRoute() {
    AppState.routeActive = !AppState.routeActive;
    
    if (elements.routePanel) {
        elements.routePanel.style.display = AppState.routeActive ? 'block' : 'none';
    }
    
    // Hide search panel if route is activated
    if (AppState.routeActive && AppState.searchActive) {
        toggleSearch();
    }
    
    console.log(`🧭 Route panel ${AppState.routeActive ? 'opened' : 'closed'}`);
}

/**
 * Handle search input
 */
function handleSearch(event) {
    const query = event.target.value;
    console.log('🔍 Search query:', query);
    
    // TODO: Implement search with map integration
    // Placeholder for search functionality
}

/**
 * Calculate route
 */
function calculateRoute() {
    const fromInput = document.getElementById('route-from');
    const toInput = document.getElementById('route-to');
    const modeSelect = document.getElementById('route-mode');
    
    const routeData = {
        from: fromInput?.value,
        to: toInput?.value,
        mode: modeSelect?.value
    };
    
    console.log('🧭 Calculate route:', routeData);
    
    // TODO: Implement actual route calculation
    // Placeholder for route calculation
}

/**
 * Handle settings
 */
function handleSettings() {
    console.log('⚙️ Settings requested');
    
    // TODO: Implement settings panel
    alert('Settings panel - coming soon!');
}

/**
 * Setup voice controls for R1
 */
function setupVoiceControls() {
    console.log('🎙️ Setting up voice controls for R1');
    
    // TODO: Implement R1 voice integration
    // This will use the Rabbit Creations SDK voice features
    
    if (elements.voiceIndicator) {
        elements.voiceIndicator.addEventListener('click', () => {
            AppState.voiceActive = !AppState.voiceActive;
            elements.voiceIndicator.classList.toggle('active', AppState.voiceActive);
            console.log(`🎙️ Voice control ${AppState.voiceActive ? 'activated' : 'deactivated'}`);
        });
    }
}

/**
 * Update status indicators
 */
function updateStatus(type, message) {
    const statusElement = elements.statusElements[type];
    if (statusElement) {
        statusElement.textContent = message;
        console.log(`📊 Status update [${type}]: ${message}`);
    }
}

/**
 * Initialize app when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', initializeApp);

// Export for testing and debugging
if (typeof window !== 'undefined') {
    window.R1MapApp = {
        AppState,
        elements,
        initializeApp,
        handleLocationRequest,
        toggleSearch,
        toggleRoute
    };
}
