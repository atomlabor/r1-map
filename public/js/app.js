/**
 * R1 Map - Minimalist Navigation App for Rabbit R1
 * Rabbit R1 Creations App for Interactive Maps with Hardware Integration
 * 
 * Features: Leaflet maps, R1 hardware scroll zoom, PTT feedback, minimal UI
 */

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
 * Clear tile cache
 */
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

/**
 * Initialize the R1 Map Application
 */
function initializeApp() {
    console.log('🗺️ R1 Map App starting...');
    
    // Cache DOM elements
    cacheElements();
    
    // Check if running on Rabbit R1
    checkR1Device();
    
    // Clear tile cache before map initialization
    clearTileCache();
    
    // Initialize map with Leaflet
    initializeLeafletMap();
    
    // Add Rabbit R1 Scrollwheel Integration (after map initialization)
    setupRabbitR1ScrollWheel();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize Rabbit SDK if available
    initializeRabbitSDK();
    
    // Auto-request location on startup
    autoRequestLocation();
    
    // Create toast element for PTT feedback
    createToastElement();
    
    // Show app
    showApp();
    
    AppState.isInitialized = true;
    console.log('✅ R1 Map App initialized successfully');
}

/**
 * Initialize Leaflet Map
 */
function initializeLeafletMap() {
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
    
    console.log('🗺️ Leaflet map initialized with German tiles');
}

/**
