/**
 * R1 Map - Minimalist Navigation App for Rabbit R1
 * Rabbit R1 Creations App for Interactive Maps with Hardware Integration
 * 
 * Features: Leaflet maps, R1 hardware scroll zoom, PTT feedback, minimal UI
 */

// Clear tile cache immediately on script load (before DOM)
function clearTileCache() {
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        if (name.includes('tile') || name.includes('map') || name.includes('openstreetmap')) {
          caches.delete(name);
        }
      });
    });
  }
  if ('indexedDB' in window) {
    indexedDB.deleteDatabase('leaflet-tiles');
  }
  Object.keys(localStorage).forEach(key => {
    if (key.includes('tile') || key.includes('leaflet') || key.includes('map')) {
      localStorage.removeItem(key);
    }
  });
}

// Clear cache immediately
clearTileCache();

// Add orange background CSS
const style = document.createElement('style');
style.textContent = `
  .leaflet-container {
    background: #ee530e !important;
  }
`;
document.head.appendChild(style);

// Application state
const AppState = {
    isInitialized: false,
    isR1Device: false,
    map: null,
    currentLocation: null,
    zoom: 6, // Changed from 2 to 6 for Germany view
    markers: [],
    locationMarker: null,
    watchId: null
};

// DOM elements cache
const Elements = {
    loading: null,
    app: null,
    map: null,
    toast: null
};

/**
 * Cache DOM elements safely
 */
function cacheElements() {
    Elements.loading = document.getElementById('loading');
    Elements.app = document.getElementById('app');
    Elements.map = document.getElementById('map');
    Elements.toast = document.getElementById('toast');
    console.log('📋 DOM elements cached');
}

/**
 * Check if running on Rabbit R1 device
 */
function checkR1Device() {
    AppState.isR1Device = navigator.userAgent.includes('Rabbit') || 
                         window.location.hostname.includes('rabbit');
    console.log('🐰 R1 Device detected:', AppState.isR1Device);
}

/**
 * Initialize Leaflet Map with proper DOM checks
 */
function initializeLeafletMap() {
    const mapElement = document.getElementById('map');
    
    if (!mapElement) {
        console.error('❌ Map container element not found!');
        return false;
    }
    
    // Ensure Leaflet is loaded
    if (typeof L === 'undefined') {
        console.error('❌ Leaflet library not loaded!');
        return false;
    }
    
    try {
        // Initialize map centered on Germany
        AppState.map = L.map('map', {
            center: [51.1657, 10.4515],
            zoom: 6,
            zoomControl: false,
            attributionControl: true,
            preferCanvas: true
        });
        
        // Add German OpenStreetMap tiles with optimized settings
        L.tileLayer('https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png', {
            subdomains: ['a','b','c'],
            maxZoom: 19,
            minZoom: 1,
            crossOrigin: true,
            updateWhenIdle: false,
            keepBuffer: 6,
            unloadInvisibleTiles: false,
            reuseTiles: true
        }).addTo(AppState.map);
        
        // Force map container resize after a short delay
        setTimeout(() => {
            if (AppState.map) {
                AppState.map.invalidateSize();
                console.log('🗺️ Map size invalidated for proper display');
            }
        }, 100);
        
        console.log('🗺️ Leaflet map initialized with German tiles');
        return true;
    } catch (error) {
        console.error('❌ Failed to initialize map:', error);
        return false;
    }
}

/**
 * Initialize the R1 Map Application
 */
function initializeApp() {
    console.log('🗺️ R1 Map App starting...');
    
    // Cache DOM elements
    cacheElements();
    
    // Verify map container exists
    if (!Elements.map) {
        console.error('❌ Map container not found! Retrying in 500ms...');
        setTimeout(initializeApp, 500);
        return;
    }
    
    // Check if running on Rabbit R1
    checkR1Device();
    
    // Initialize map with Leaflet
    const mapInitialized = initializeLeafletMap();
    
    if (!mapInitialized) {
        console.error('❌ Map initialization failed!');
        return;
    }
    
    // Add Rabbit R1 Scrollwheel Integration (after map initialization)
    if (typeof setupRabbitR1ScrollWheel === 'function') {
        setupRabbitR1ScrollWheel();
    }
    
    // Setup event listeners
    if (typeof setupEventListeners === 'function') {
        setupEventListeners();
    }
    
    // Initialize Rabbit SDK if available
    if (typeof initializeRabbitSDK === 'function') {
        initializeRabbitSDK();
    }
    
    // Auto-request location on startup
    if (typeof autoRequestLocation === 'function') {
        autoRequestLocation();
    }
    
    // Create toast element for PTT feedback
    if (typeof createToastElement === 'function') {
        createToastElement();
    }
    
    // Show app
    if (typeof showApp === 'function') {
        showApp();
    }
    
    AppState.isInitialized = true;
    console.log('✅ R1 Map App initialized successfully');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    // DOM is already loaded
    initializeApp();
}
