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
    zoom: 13, // Set default zoom to 13 for Wuppertal
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
    
    console.log('📝 DOM elements cached');
}
/**
 * Check if running on Rabbit R1 device
 */
function checkR1Device() {
    AppState.isR1Device = (
        navigator.userAgent.includes('RabbitR1') ||
        navigator.userAgent.includes('Rabbit') ||
        window.innerWidth === 240 && window.innerHeight === 282
    );
    
    if (AppState.isR1Device) {
        console.log('🐰 Running on Rabbit R1 device');
        document.body.classList.add('r1-device');
    } else {
        console.log('💻 Running on non-R1 device');
    }
}
/**
 * Initialize Leaflet map with minimal config for maximum speed
 */
function initializeLeafletMap() {
    if (!Elements.map) {
        console.error('❌ Map container not found');
        return;
    }
    
    try {
        // Create map with minimal settings for max performance
        AppState.map = L.map(Elements.map, {
            center: [51.2577, 7.1485], // Wuppertal coordinates
            zoom: AppState.zoom, // Zoom level 13
            zoomControl: false, // Remove zoom control for speed
            touchZoom: true, // Keep touch zoom for touch devices
            doubleClickZoom: false, // Disable double-click zoom
            scrollWheelZoom: false, // Disable scroll wheel zoom
            boxZoom: false, // Disable box zoom
            keyboard: false, // Disable keyboard navigation
            dragging: true, // Keep drag for touch devices
            tap: true, // Keep tap for touch devices
            pinchZoom: true // Keep pinch zoom for touch devices
        });
        
        // Add faster OSM-DE tiles with subdomains and crossOrigin
        L.tileLayer('https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png', {
            subdomains: ['a','b','c'],
            maxZoom: 19,
            crossOrigin: true
        }).addTo(AppState.map);
        
        console.log('🗺️ Leaflet map initialized with Wuppertal center and max speed settings');
    } catch (error) {
        console.error('❌ Failed to initialize map:', error);
    }
}
/**
 * Setup event listeners including R1 hardware events
 */
function setupEventListeners() {
    // R1 Hardware Events - ScrollWheel zoom support (only for R1 device)
    document.addEventListener('wheel', (e) => {
        if (AppState.map && AppState.isR1Device) {
            e.preventDefault();
            const currentZoom = AppState.map.getZoom();
            const delta = e.deltaY > 0 ? -1 : 1; // Invert for natural scrolling
            const newZoom = Math.max(1, Math.min(19, currentZoom + delta));
            AppState.map.setZoom(newZoom);
            console.log(`🖱️ R1 ScrollWheel zoom: ${currentZoom} → ${newZoom}`);
        }
    }, { passive: false });
    
    // PTT (Push-to-Talk) Button for feedback
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && AppState.isR1Device) {
            e.preventDefault();
            showPTTFeedback();
            console.log('🎙️ R1 PTT Button pressed');
        }
    });
    
    // Touch events for visual feedback
    if (Elements.map) {
        Elements.map.addEventListener('touchstart', (e) => {
            console.log('👆 Touch interaction detected');
        }, { passive: true });
    }
    
    console.log('👂 Event listeners set up (R1 hardware focus)');
}
/**
 * Initialize Rabbit SDK if available
 */
function initializeRabbitSDK() {
    if (typeof window.RabbitSDK !== 'undefined') {
        console.log('🐰 Rabbit SDK detected, initializing...');
        
        try {
            window.RabbitSDK.onReady(() => {
                console.log('✅ Rabbit SDK ready');
                
                // Register for hardware events
                if (window.RabbitSDK.hardware) {
                    // ScrollWheel events
                    window.RabbitSDK.hardware.on('scroll', (data) => {
                        console.log('🖱️ R1 ScrollWheel SDK:', data);
                        if (AppState.map && data.delta) {
                            const currentZoom = AppState.map.getZoom();
                            const newZoom = data.delta > 0 ? currentZoom + 1 : currentZoom - 1;
                            AppState.map.setZoom(Math.max(1, Math.min(19, newZoom)));
                        }
                    });
                    
                    // PTT Button events
                    window.RabbitSDK.hardware.on('ptt', (data) => {
                        console.log('🎙️ R1 PTT Button SDK:', data);
                        if (data.pressed) {
                            showPTTFeedback();
                        }
                    });
                }
            });
        } catch (error) {
            console.warn('⚠️ Rabbit SDK initialization failed:', error);
        }
    } else {
        console.log('ℹ️ Rabbit SDK not available (running outside R1)');
    }
}
/**
 * Create toast element for PTT feedback
 */
function createToastElement() {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.id = 'ptt-toast';
    Elements.app.appendChild(toast);
    Elements.toast = toast;
    console.log('🍞 Toast element created for PTT feedback');
}
/**
 * Show PTT feedback with toast and instantly centered marker
 */
function showPTTFeedback() {
    if (!Elements.toast) return;
    
    // Show toast message
    Elements.toast.textContent = '🎙️ PTT Activated';
    Elements.toast.classList.add('show');
    
    // Add a persistent marker at map center - ensure it's always centered and visible
    if (AppState.map) {
        // Get current map center to ensure marker is always visible
        const center = AppState.map.getCenter();
        
        // Create marker with custom styling to make it more visible
        const marker = L.marker(center, {
            // Add custom icon to make it more prominent
            icon: L.divIcon({
                className: 'ptt-marker-icon',
                html: '📍',
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            })
        }).addTo(AppState.map);
        
        // Add popup and open it immediately for better visibility
        marker.bindPopup('🎙️ PTT Marker', { 
            closeButton: false,
            autoClose: false,
            closeOnClick: false
        }).openPopup();
        
        // Ensure the marker is centered in view by panning to it
        AppState.map.panTo(center);
        
        // Add marker to AppState.markers array
        AppState.markers.push(marker);
        
        console.log(`📍 PTT marker added and centered at: ${center.lat.toFixed(6)}, ${center.lng.toFixed(6)}`);
    }
    
    // Hide toast after 2 seconds
    setTimeout(() => {
        Elements.toast.classList.remove('show');
    }, 2000);
    
    console.log('🎙️ PTT feedback shown with instantly centered and visible marker');
}
/**
 * Auto-request user location on startup (fallback to Wuppertal)
 */
function autoRequestLocation() {
    if (!navigator.geolocation) {
        console.log('❌ Geolocation not supported, staying on Wuppertal');
        return;
    }
    
    console.log('🌍 Requesting user location...');
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            AppState.currentLocation = { lat: latitude, lon: longitude };
            
            if (AppState.map) {
                // Center map on user location
                AppState.map.setView([latitude, longitude], AppState.zoom);
                
                // Add location marker
                if (AppState.locationMarker) {
                    AppState.map.removeLayer(AppState.locationMarker);
                }
                
                AppState.locationMarker = L.marker([latitude, longitude])
                    .addTo(AppState.map)
                    .bindPopup('Your location')
                    .openPopup();
                
                console.log(`📍 Location acquired: ${latitude}, ${longitude}`);
            }
        },
        (error) => {
            console.warn('⚠️ Location request failed, staying on Wuppertal:', error.message);
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
        }
    );
}
/**
 * Show the app and hide loading screen
 */
function showApp() {
    if (Elements.loading) {
        Elements.loading.style.display = 'none';
    }
    if (Elements.app) {
        Elements.app.style.display = 'block';
    }
}
/**
 * Get current app state (for debugging)
 */
function getAppState() {
    return { ...AppState };
}
/**
 * Cleanup function
 */
function cleanup() {
    if (AppState.watchId) {
        navigator.geolocation.clearWatch(AppState.watchId);
        AppState.watchId = null;
    }
}
/**
 * Initialize app when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', initializeApp);
// Native Rabbit R1 ScrollWheel Zoom
if (window.r1app && window.r1app.events) {
  window.r1app.events.on('scroll', (delta) => {
    if (AppState.map) {
      const z = AppState.map.getZoom();
      const next = Math.max(1, Math.min(19, z + (delta > 0 ? 1 : -1)));
      AppState.map.setZoom(next);
    }
  });
}
// Fallback Browser/SDK
// (bereits vorhanden lassen)
// Cleanup on page unload
window.addEventListener('beforeunload', cleanup);
// Export for testing and R1 integration
if (typeof window !== 'undefined') {
    window.R1MapApp = {
        AppState,
        Elements,
        initializeApp,
        showPTTFeedback,
        autoRequestLocation,
        getAppState,
        cleanup
    };
    
    console.log('🗺️ R1 Map App ready for integration');
}
