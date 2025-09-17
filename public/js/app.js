/**
 * R1 Map - Complete Application with Leaflet Integration
 * Rabbit R1 Creations App for Interactive Maps and Navigation
 * 
 * Features: Leaflet maps, POI search, Rabbit R1 hardware integration
 */
// Application state
const AppState = {
    isInitialized: false,
    isR1Device: false,
    map: null,
    currentLocation: null,
    zoom: 13,
    markers: [],
    searchActive: false,
    poiVisible: true
};
// DOM elements cache
const Elements = {
    loading: null,
    app: null,
    map: null,
    status: null,
    buttons: {}
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
    
    // Show app
    showApp();
    
    AppState.isInitialized = true;
    updateStatus('App initialisiert');
    console.log('✅ R1 Map App initialized successfully');
}
/**
 * Cache DOM elements for better performance
 */
function cacheElements() {
    Elements.loading = document.getElementById('loading');
    Elements.app = document.getElementById('app');
    Elements.map = document.getElementById('map');
    Elements.status = document.getElementById('status');
    
    // Cache button elements
    Elements.buttons.zoomIn = document.getElementById('btn-zoom-in');
    Elements.buttons.zoomOut = document.getElementById('btn-zoom-out');
    Elements.buttons.location = document.getElementById('btn-location');
    Elements.buttons.poi = document.getElementById('btn-poi');
}
/**
 * Initialize Leaflet map
 */
function initializeLeafletMap() {
    console.log('🗺️ Initializing Leaflet map...');
    
    // Clear existing map placeholder
    const mapContainer = Elements.map;
    if (mapContainer) {
        mapContainer.innerHTML = '';
        
        // Initialize Leaflet map with zoomControl: false
        AppState.map = L.map('map', {
            zoomControl: false
        }).setView([52.5200, 13.4050], AppState.zoom); // Berlin default
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18
        }).addTo(AppState.map);
        
        // Add map event listeners
        AppState.map.on('zoomend', function() {
            AppState.zoom = AppState.map.getZoom();
            updateStatus(`Zoom: ${AppState.zoom}`);
        });
        
        AppState.map.on('moveend', function() {
            const center = AppState.map.getCenter();
            updateStatus(`Position: ${center.lat.toFixed(4)}, ${center.lng.toFixed(4)}`);
        });
        
        console.log('✅ Leaflet map initialized');
        updateStatus('Karte geladen');
    }
}
/**
 * Check if running on Rabbit R1 device
 */
function checkR1Device() {
    AppState.isR1Device = typeof window.RabbitCreations !== 'undefined';
    
    if (AppState.isR1Device) {
        console.log('🐰 Running on Rabbit R1 device');
        document.body.classList.add('r1-device');
        updateStatus('R1 Gerät erkannt');
    } else {
        console.log('🖥️ Running in browser (development mode)');
        document.body.classList.add('browser-mode');
        updateStatus('Browser-Modus');
    }
}
/**
 * Setup event listeners for UI interactions
 */
function setupEventListeners() {
    // Zoom controls
    if (Elements.buttons.zoomIn) {
        Elements.buttons.zoomIn.addEventListener('click', handleZoomIn);
    }
    
    if (Elements.buttons.zoomOut) {
        Elements.buttons.zoomOut.addEventListener('click', handleZoomOut);
    }
    
    // Location button
    if (Elements.buttons.location) {
        Elements.buttons.location.addEventListener('click', handleLocationRequest);
    }
    
    // POI toggle button
    if (Elements.buttons.poi) {
        Elements.buttons.poi.addEventListener('click', handlePOIToggle);
    }
    
    console.log('🎧 Event listeners setup complete');
}
/**
 * Handle zoom in
 */
function handleZoomIn() {
    if (AppState.map) {
        AppState.map.zoomIn();
        updateStatus('Zoom vergrößert');
        console.log('🔍 Zoomed in');
    }
}
/**
 * Handle zoom out
 */
function handleZoomOut() {
    if (AppState.map) {
        AppState.map.zoomOut();
        updateStatus('Zoom verkleinert');
        console.log('🔍 Zoomed out');
    }
}
/**
 * Handle location request
 */
function handleLocationRequest() {
    console.log('📍 Location requested');
    updateStatus('Suche Position...');
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                
                AppState.currentLocation = { lat, lng };
                
                if (AppState.map) {
                    AppState.map.setView([lat, lng], 15);
                    
                    // Add or update location marker
                    if (AppState.locationMarker) {
                        AppState.map.removeLayer(AppState.locationMarker);
                    }
                    
                    AppState.locationMarker = L.marker([lat, lng])
                        .addTo(AppState.map)
                        .bindPopup('📍 Ihr Standort')
                        .openPopup();
                }
                
                updateStatus('Position gefunden');
                console.log('✅ Location acquired:', AppState.currentLocation);
            },
            (error) => {
                updateStatus('GPS Fehler');
                console.error('❌ Location error:', error);
            }
        );
    } else {
        updateStatus('GPS nicht verfügbar');
    }
}
/**
 * Handle POI toggle
 */
function handlePOIToggle() {
    AppState.poiVisible = !AppState.poiVisible;
    
    if (AppState.poiVisible) {
        showPOIs();
        updateStatus('POIs angezeigt');
    } else {
        hidePOIs();
        updateStatus('POIs ausgeblendet');
    }
    
    // Update button visual state
    if (Elements.buttons.poi) {
        Elements.buttons.poi.classList.toggle('active', AppState.poiVisible);
    }
    
    console.log(`🏢 POI visibility: ${AppState.poiVisible}`);
}
/**
 * Show Points of Interest
 */
function showPOIs() {
    if (!AppState.map) return;
    
    // Sample POIs for demonstration
    const samplePOIs = [
        { lat: 52.5200, lng: 13.4050, name: '🏛️ Brandenburger Tor', type: 'landmark' },
        { lat: 52.5186, lng: 13.4081, name: '🏛️ Reichstag', type: 'government' },
        { lat: 52.5164, lng: 13.3777, name: '🗼 Fernsehturm', type: 'landmark' },
        { lat: 52.5001, lng: 13.4200, name: '🏛️ Checkpoint Charlie', type: 'historic' },
        { lat: 52.5208, lng: 13.4094, name: '☕ Café Einstein', type: 'restaurant' }
    ];
    
    // Clear existing POI markers
    AppState.poiMarkers = AppState.poiMarkers || [];
    AppState.poiMarkers.forEach(marker => AppState.map.removeLayer(marker));
    AppState.poiMarkers = [];
    
    // Add POI markers
    samplePOIs.forEach(poi => {
        const marker = L.marker([poi.lat, poi.lng])
            .addTo(AppState.map)
            .bindPopup(`${poi.name}<br>Typ: ${poi.type}`);
        
        AppState.poiMarkers.push(marker);
    });
}
/**
 * Hide Points of Interest
 */
function hidePOIs() {
    if (!AppState.map || !AppState.poiMarkers) return;
    
    AppState.poiMarkers.forEach(marker => AppState.map.removeLayer(marker));
    AppState.poiMarkers = [];
}
/**
 * Initialize Rabbit Creations SDK
 */
function initializeRabbitSDK() {
    if (typeof window.RabbitCreations !== 'undefined') {
        console.log('🐰 Initializing Rabbit Creations SDK...');
        
        try {
            // Initialize SDK with map app configuration
            window.RabbitCreations.init({
                appId: 'r1-map',
                version: '1.0.0',
                features: ['gps', 'voice', 'hardware-buttons']
            });
            
            // Setup hardware button listeners if available
            setupHardwareButtons();
            
            updateStatus('R1 SDK aktiv');
            console.log('✅ Rabbit SDK initialized');
        } catch (error) {
            console.error('❌ Rabbit SDK initialization failed:', error);
            updateStatus('SDK Fehler');
        }
    } else {
        console.log('⚠️ Rabbit SDK not available (development mode)');
    }
}
/**
 * Setup hardware button listeners for R1
 */
function setupHardwareButtons() {
    if (AppState.isR1Device && window.RabbitCreations) {
        try {
            // Map hardware buttons to functions
            window.RabbitCreations.onHardwareButton('action', handleLocationRequest);
            window.RabbitCreations.onHardwareButton('scroll-up', handleZoomIn);
            window.RabbitCreations.onHardwareButton('scroll-down', handleZoomOut);
            
            console.log('🔘 Hardware button listeners configured');
        } catch (error) {
            console.error('❌ Hardware button setup failed:', error);
        }
    }
}
/**
 * Show main app, hide loading screen
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
 * Update status display
 */
function updateStatus(message) {
    if (Elements.status) {
        Elements.status.textContent = message;
        console.log(`📊 Status: ${message}`);
    }
}
/**
 * Search for places near current location
 */
function searchNearbyPlaces(query) {
    if (!AppState.currentLocation) {
        updateStatus('Position benötigt für Suche');
        return;
    }
    
    console.log(`🔍 Searching for: ${query}`);
    updateStatus(`Suche nach: ${query}`);
    
    // This would typically call a geocoding API
    // For now, we'll simulate search results
    setTimeout(() => {
        updateStatus(`Suchergebnisse für: ${query}`);
        console.log('✅ Search completed (simulated)');
    }, 1000);
}
/**
 * Get current app state (for debugging)
 */
function getAppState() {
    return { ...AppState };
}
/**
 * Initialize app when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', initializeApp);
// Export for testing and R1 integration
if (typeof window !== 'undefined') {
    window.R1MapApp = {
        AppState,
        Elements,
        initializeApp,
        handleLocationRequest,
        handleZoomIn,
        handleZoomOut,
        handlePOIToggle,
        searchNearbyPlaces,
        getAppState,
        updateStatus
    };
    
    console.log('🗺️ R1 Map App ready for integration');
}
