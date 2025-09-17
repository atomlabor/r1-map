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
    Elements.toast = document.getElementById('toast');
}
/**
 * Check if we're running on a Rabbit R1 device
 */
function checkR1Device() {
    // Check user agent for R1 indicators
    const userAgent = navigator.userAgent.toLowerCase();
    AppState.isR1Device = userAgent.includes('rabbit') || userAgent.includes('r1');
    
    if (AppState.isR1Device) {
        console.log('🐰 Rabbit R1 device detected! Hardware integration enabled.');
        document.body.classList.add('r1-device');
    } else {
        console.log('🌐 Standard web browser detected. Using web-only features.');
    }
}
/**
 * Initialize Leaflet map with R1-optimized settings
 */
function initializeLeafletMap() {
    try {
        // Initialize map centered on global overview
        AppState.map = L.map('map', {
            center: [20, 0], // Centered on equator for global view
            zoom: AppState.zoom,
            zoomControl: true,
            attributionControl: true,
            // R1-optimized settings
            doubleClickZoom: false, // Disabled for R1 hardware control
            boxZoom: false,
            keyboard: AppState.isR1Device, // Enable keyboard nav on R1
            scrollWheelZoom: false // Will be handled by custom R1 scroll
        });
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
            minZoom: 1
        }).addTo(AppState.map);
        
        console.log('🗺️ Leaflet map initialized with global overview');
        
    } catch (error) {
        console.error('❌ Failed to initialize map:', error);
        showPTTFeedback('Map initialization failed', 'error');
    }
}
/**
 * Setup Rabbit R1 scroll wheel integration
 */
function setupRabbitR1ScrollWheel() {
    if (!AppState.isR1Device || !AppState.map) return;
    
    try {
        // Custom scroll wheel handling for R1 hardware
        const mapContainer = AppState.map.getContainer();
        
        mapContainer.addEventListener('wheel', (e) => {
            e.preventDefault();
            
            const currentZoom = AppState.map.getZoom();
            const zoomDelta = e.deltaY > 0 ? -0.5 : 0.5;
            const newZoom = Math.max(1, Math.min(19, currentZoom + zoomDelta));
            
            AppState.map.setZoom(newZoom, {
                animate: true,
                duration: 0.2
            });
            
            // Haptic feedback for R1
            showPTTFeedback(`Zoom: ${Math.round(newZoom)}`, 'info');
        }, { passive: false });
        
        console.log('🐰 R1 scroll wheel integration active');
        
    } catch (error) {
        console.warn('⚠️ R1 scroll wheel setup failed:', error);
    }
}
/**
 * Setup general event listeners
 */
function setupEventListeners() {
    // Handle window resize
    window.addEventListener('resize', () => {
        if (AppState.map) {
            AppState.map.invalidateSize();
        }
    });
    
    // Handle map events
    if (AppState.map) {
        AppState.map.on('zoomend', () => {
            AppState.zoom = AppState.map.getZoom();
        });
        
        AppState.map.on('moveend', () => {
            const center = AppState.map.getCenter();
            console.log(`📍 Map moved to: ${center.lat.toFixed(4)}, ${center.lng.toFixed(4)}`);
        });
    }
}
/**
 * Initialize Rabbit SDK if available
 */
function initializeRabbitSDK() {
    if (typeof RabbitSDK !== 'undefined' && AppState.isR1Device) {
        try {
            // Initialize Rabbit SDK
            RabbitSDK.init({
                appName: 'R1 Map',
                version: '1.0.0'
            });
            
            console.log('🐰 Rabbit SDK initialized');
            showPTTFeedback('R1 Integration Active', 'success');
            
        } catch (error) {
            console.warn('⚠️ Rabbit SDK initialization failed:', error);
        }
    }
}
/**
 * Create toast element for PTT feedback
 */
function createToastElement() {
    if (document.getElementById('toast')) return;
    
    const toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        font-size: 14px;
        z-index: 10000;
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.3s ease;
        pointer-events: none;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    document.body.appendChild(toast);
    Elements.toast = toast;
}
/**
 * Show PTT (Push-To-Talk) style feedback for R1 users
 */
function showPTTFeedback(message, type = 'info') {
    if (!Elements.toast) createToastElement();
    
    // Set color based on type
    const colors = {
        success: '#4CAF50',
        error: '#f44336',
        warning: '#ff9800',
        info: '#2196F3'
    };
    
    Elements.toast.style.backgroundColor = colors[type] || colors.info;
    Elements.toast.textContent = message;
    
    // Show toast
    Elements.toast.style.opacity = '1';
    Elements.toast.style.transform = 'translateY(0)';
    
    // Hide after 3 seconds
    setTimeout(() => {
        if (Elements.toast) {
            Elements.toast.style.opacity = '0';
            Elements.toast.style.transform = 'translateY(-20px)';
        }
    }, 3000);
    
    console.log(`🔔 PTT Feedback: ${message} (${type})`);
}
/**
 * Auto-request user location and center map
 */
function autoRequestLocation() {
    if (!navigator.geolocation) {
        console.warn('⚠️ Geolocation not supported, staying on global overview');
        return;
    }
    
    console.log('📍 Requesting user location...');
    showPTTFeedback('Getting your location...', 'info');
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            AppState.currentLocation = { lat: latitude, lng: longitude };
            
            if (AppState.map) {
                // Zoom to user location
                AppState.map.setView([latitude, longitude], 13, {
                    animate: true,
                    duration: 1.0
                });
                
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
            console.warn('⚠️ Location request failed, staying on global overview:', error.message);
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
