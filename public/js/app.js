/**
 * R1 Map - Minimalist Navigation App for Rabbit R1
 * Rabbit R1 Creations App for Interactive Maps with Hardware Integration
 * 
 * Features: Leaflet maps, R1 hardware scroll zoom, PTT feedback, minimal UI
 */
// Application state
const AppState = {
    isInitialized: false,
    isR1Device: false,
    map: null,
    currentLocation: null,
    zoom: 2, // Changed from 13 to 2 for global overview
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
 * Initialize the R1 Map Application
 */
function initializeApp() {
    console.log('🗺️ R1 Map App starting...');
    
    // Cache DOM elements
    cacheElements();
    
    // Check if running on Rabbit R1
    checkR1Device();
    
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
 * Cache DOM elements for performance
 */
function cacheElements() {
    Elements.loading = document.getElementById('loading');
    Elements.app = document.getElementById('app');
    Elements.map = document.getElementById('map');
    console.log('📦 DOM elements cached');
}
/**
 * Check if running on Rabbit R1 device
 */
function checkR1Device() {
    // Check for Rabbit R1 specific APIs or user agent
    const userAgent = navigator.userAgent.toLowerCase();
    AppState.isR1Device = userAgent.includes('rabbit') || userAgent.includes('r1');
    
    if (AppState.isR1Device) {
        console.log('🐰 Rabbit R1 device detected');
        document.body.classList.add('r1-device');
    } else {
        console.log('💻 Running on standard device');
    }
}
/**
 * Initialize Leaflet map with optimized settings
 */
function initializeLeafletMap() {
    console.log('🗺️ Initializing Leaflet map...');
    
    if (!Elements.map) {
        console.error('❌ Map container not found');
        return;
    }
    
    // Initialize map with performance optimizations
    AppState.map = L.map('map', {
        center: [20, 0],
        zoom: AppState.zoom,
        zoomControl: false,
        attributionControl: true,
        preferCanvas: true,
        // Performance optimizations for R1
        fadeAnimation: false,
        zoomAnimation: true,
        markerZoomAnimation: false
    });
    
L.tileLayer('https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png', {
    subdomains: ['a','b','c'],
    maxZoom: 19,
    minZoom: 1,
    crossOrigin: true,
    updateWhenIdle: false,
    keepBuffer: 6,              // NEU: Nachbar-Tiles im RAM halten für schnelles Panning
    unloadInvisibleTiles: false,// NEU: Tiles in der Nähe im Cache lassen statt sofort entladen
    reuseTiles: true            // NEU: Tiles werden für sofortige Neubefüllung wiederverwendet
}).addTo(AppState.map);

    
    console.log('✅ Leaflet map initialized');
}
/**
 * Setup Rabbit R1 scroll wheel integration for map zoom
 */
function setupRabbitR1ScrollWheel() {
    if (!AppState.map) return;
    
    console.log('🎛️ Setting up R1 scroll wheel integration...');
    
    // Listen for wheel events on the map container
    const mapContainer = AppState.map.getContainer();
    
    mapContainer.addEventListener('wheel', (event) => {
        event.preventDefault();
        
        const currentZoom = AppState.map.getZoom();
        const delta = event.deltaY;
        
        // Smooth zoom with R1 scroll wheel
        if (delta < 0) {
            // Scroll up = zoom in
            AppState.map.setZoom(Math.min(currentZoom + 0.5, 18), {
                animate: true,
                duration: 0.3
            });
            showPTTFeedback('Zoom In', 'info');
        } else {
            // Scroll down = zoom out
            AppState.map.setZoom(Math.max(currentZoom - 0.5, 1), {
                animate: true,
                duration: 0.3
            });
            showPTTFeedback('Zoom Out', 'info');
        }
    }, { passive: false });
    
    console.log('✅ R1 scroll wheel integration ready');
}
/**
 * Setup event listeners
 */
function setupEventListeners() {
    console.log('🎛️ Setting up event listeners...');
    
    // Map click events
    if (AppState.map) {
        AppState.map.on('click', (e) => {
            const { lat, lng } = e.latlng;
            showPTTFeedback(`Clicked: ${lat.toFixed(4)}, ${lng.toFixed(4)}`, 'info');
        });
        
        AppState.map.on('zoomend', () => {
            AppState.zoom = AppState.map.getZoom();
        });
    }
    
    // Keyboard shortcuts for R1
    document.addEventListener('keydown', (event) => {
        if (!AppState.map) return;
        
        switch(event.code) {
            case 'Space':
                event.preventDefault();
                requestLocation();
                break;
            case 'KeyR':
                event.preventDefault();
                AppState.map.setView([20, 0], 2);
                showPTTFeedback('Reset to global view', 'info');
                break;
        }
    });
    
    console.log('✅ Event listeners configured');
}
/**
 * Initialize Rabbit SDK if available
 */
function initializeRabbitSDK() {
    console.log('🐰 Checking for Rabbit SDK...');
    
    if (window.RabbitSDK) {
        console.log('✅ Rabbit SDK detected, initializing...');
        
        // Initialize PTT if available
        if (window.RabbitSDK.ptt) {
            window.RabbitSDK.ptt.onPress(() => {
                showPTTFeedback('PTT Pressed', 'success');
                requestLocation();
            });
            
            window.RabbitSDK.ptt.onRelease(() => {
                showPTTFeedback('PTT Released', 'info');
            });
        }
        
        // Initialize other R1 specific features
        if (window.RabbitSDK.device) {
            console.log('🔋 Device APIs available');
        }
        
    } else {
        console.log('ℹ️ Rabbit SDK not available, running in standard mode');
    }
}
/**
 * Auto-request location on startup
 */
function autoRequestLocation() {
    console.log('📍 Auto-requesting location...');
    setTimeout(() => {
        requestLocation();
    }, 1000);
}
/**
 * Create toast element for PTT feedback
 */
function createToastElement() {
    if (document.getElementById('toast')) return;
    
    const toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
    
    Elements.toast = toast;
    console.log('🍞 Toast element created');
}
/**
 * Show app (hide loading)
 */
function showApp() {
    if (Elements.loading) {
        Elements.loading.style.display = 'none';
    }
    if (Elements.app) {
        Elements.app.style.display = 'block';
    }
    console.log('👁️ App visible');
}
/**
 * Request user location
 */
function requestLocation() {
    if (!AppState.map) {
        showPTTFeedback('Map not ready', 'error');
        return;
    }
    
    showPTTFeedback('Getting location...', 'info');
    
    // Location found event handler
    AppState.map.on('locationfound', (e) => {
        const { latlng, accuracy } = e;
        console.log('📍 Location found:', latlng);
        
        AppState.currentLocation = { lat: latlng.lat, lng: latlng.lng };
        
        // Immer explizit springen, auch wenn setView genutzt wird
        AppState.map.setView(latlng, 13, { animate: true, duration: 1.0 });
        
        // Marker auf Userposition setzen
        if (AppState.locationMarker) {
            AppState.locationMarker.setLatLng(latlng);
        } else {
            AppState.locationMarker = L.marker(latlng)
                .addTo(AppState.map)
                .bindPopup(`Your location (±${Math.round(accuracy)}m)`);
        }
        
        showPTTFeedback(`Location found (±${Math.round(accuracy)}m)`, 'success');
    });
    
    // Location error + Rabbit R1 Sensorfallback!
    AppState.map.on('locationerror', (e) => {
        console.warn('⚠️ Location request failed, fallback:', e.message);
        
        if (window.RabbitSDK && window.RabbitSDK.sensors && typeof window.RabbitSDK.sensors.getLocation === 'function') {
            window.RabbitSDK.sensors.getLocation().then(pos => {
                if (pos && pos.latitude && pos.longitude) {
                    const latlng = [pos.latitude, pos.longitude];
                    AppState.map.setView(latlng, 13, { animate: true, duration: 1.0 });
                    
                    if (AppState.locationMarker) {
                        AppState.locationMarker.setLatLng(latlng);
                    } else {
                        AppState.locationMarker = L.marker(latlng)
                            .addTo(AppState.map)
                            .bindPopup('Rabbit R1 Sensor-Position');
                    }
                    
                    showPTTFeedback('RabbitSDK Location', 'success');
                    return;
                }
            }).catch(() => {
                showPTTFeedback('Kein Standort über RabbitSDK', 'warning');
                // Marker bleibt dann einfach in der Map-Mitte oder global.
            });
        } else {
            // Wenn kein Sensor, Marker ins Karten-Zentrum
            const center = AppState.map.getCenter();
            
            if (AppState.locationMarker) {
                AppState.locationMarker.setLatLng(center);
            } else {
                AppState.locationMarker = L.marker(center).addTo(AppState.map).bindPopup('Center marker');
            }
            
            showPTTFeedback('Location unavailable', 'warning');
        }
    });
    
    // Leaflet-API für Standort holen
    AppState.map.locate({
        setView: true,
        maxZoom: 13,
        watch: false,
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
    });
}
/**
 * Show PTT feedback toast
 */
function showPTTFeedback(message, type = 'info') {
    if (!Elements.toast) return;
    
    Elements.toast.textContent = message;
    Elements.toast.className = `toast toast-${type} toast-show`;
    
    setTimeout(() => {
        Elements.toast.classList.remove('toast-show');
    }, 2000);
}
// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
