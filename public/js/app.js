/**
 * R1 Map - Complete Application with Leaflet Integration
 * Rabbit R1 Creations App for Interactive Maps and Navigation
 * 
 * Features: Leaflet maps, POI search, Rabbit R1 hardware integration, pinch-to-zoom
 */

// Application state
const AppState = {
    isInitialized: false,
    isR1Device: false,
    map: null,
    currentLocation: null,
    zoom: 15,
    markers: [],
    searchActive: false,
    poiVisible: true,
    locationMarker: null,
    watchId: null
};

// DOM elements cache (removed status indicators)
const Elements = {
    loading: null,
    app: null,
    map: null,
    searchInput: null,
    searchButton: null,
    searchResults: null
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
    Elements.searchInput = document.getElementById('search-input');
    Elements.searchButton = document.getElementById('search-btn');
    Elements.searchResults = document.getElementById('search-results');
    
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
 * Initialize Leaflet map with fullview and pinch-to-zoom
 */
function initializeLeafletMap() {
    if (!Elements.map) {
        console.error('❌ Map container not found');
        return;
    }
    
    try {
        // Create map with touch and gesture support enabled
        AppState.map = L.map(Elements.map, {
            center: [52.5200, 13.4050], // Berlin default
            zoom: AppState.zoom,
            zoomControl: true,
            touchZoom: true,
            doubleClickZoom: true,
            scrollWheelZoom: true,
            boxZoom: true,
            keyboard: true,
            dragging: true,
            tap: true,
            pinchZoom: true // Ensure pinch-to-zoom is enabled
        });
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(AppState.map);
        
        // Enable gesture handling for mobile
        if (AppState.map.gestureHandling) {
            AppState.map.gestureHandling.enable();
        }
        
        console.log('🗺️ Leaflet map initialized with pinch-to-zoom');
    } catch (error) {
        console.error('❌ Failed to initialize map:', error);
    }
}

/**
 * Setup event listeners including R1 hardware events
 */
function setupEventListeners() {
    // Search functionality
    if (Elements.searchButton) {
        Elements.searchButton.addEventListener('click', handleSearch);
    }
    
    if (Elements.searchInput) {
        Elements.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
        
        Elements.searchInput.addEventListener('input', (e) => {
            if (e.target.value.trim() === '') {
                hideSearchResults();
            }
        });
    }
    
    // R1 Hardware Events
    // ScrollWheel support
    document.addEventListener('wheel', (e) => {
        if (AppState.map) {
            // Let Leaflet handle scroll wheel zoom naturally
            console.log('🖱️ ScrollWheel event detected');
        }
    });
    
    // PTT (Push-to-Talk) Button for search
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' || e.code === 'KeyS') { // PTT or S key
            e.preventDefault();
            if (!AppState.searchActive) {
                console.log('🎙️ PTT Button pressed - activating search');
                if (Elements.searchInput) {
                    Elements.searchInput.focus();
                    Elements.searchInput.select();
                }
            }
        }
        
        // ESC to clear search
        if (e.code === 'Escape') {
            hideSearchResults();
            if (Elements.searchInput) {
                Elements.searchInput.blur();
            }
        }
    });
    
    // Touch and gesture events
    if (Elements.map) {
        Elements.map.addEventListener('touchstart', (e) => {
            console.log('👆 Touch interaction detected');
        }, { passive: true });
    }
    
    console.log('👂 Event listeners set up (including R1 hardware events)');
}

/**
 * Initialize Rabbit SDK if available
 */
function initializeRabbitSDK() {
    if (typeof window.RabbitSDK !== 'undefined') {
        console.log('🐰 Rabbit SDK detected, initializing...');
        
        try {
            // Initialize SDK integration
            window.RabbitSDK.onReady(() => {
                console.log('✅ Rabbit SDK ready');
                
                // Register for hardware events
                if (window.RabbitSDK.hardware) {
                    // ScrollWheel events
                    window.RabbitSDK.hardware.on('scroll', (data) => {
                        console.log('🖱️ R1 ScrollWheel:', data);
                        if (AppState.map && data.delta) {
                            const currentZoom = AppState.map.getZoom();
                            const newZoom = data.delta > 0 ? currentZoom + 1 : currentZoom - 1;
                            AppState.map.setZoom(newZoom);
                        }
                    });
                    
                    // PTT Button events
                    window.RabbitSDK.hardware.on('ptt', (data) => {
                        console.log('🎙️ R1 PTT Button:', data);
                        if (data.pressed && !AppState.searchActive) {
                            handleSearch();
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
 * Handle search functionality
 */
function handleSearch() {
    const query = Elements.searchInput?.value.trim();
    
    if (!query) {
        console.log('⚠️ Empty search query');
        return;
    }
    
    console.log(`🔍 Searching for: ${query}`);
    AppState.searchActive = true;
    
    // Simulate search (in real implementation, use Nominatim or other geocoding API)
    setTimeout(() => {
        displaySearchResults([
            {
                name: `Result for "${query}"`,
                address: 'Sample address, City',
                lat: 52.5200 + (Math.random() - 0.5) * 0.1,
                lon: 13.4050 + (Math.random() - 0.5) * 0.1
            }
        ]);
        AppState.searchActive = false;
    }, 1000);
}

/**
 * Display search results
 */
function displaySearchResults(results) {
    if (!Elements.searchResults || !results.length) {
        hideSearchResults();
        return;
    }
    
    const resultsHtml = results.map((result, index) => `
        <div class="search-result-item" onclick="selectSearchResult(${result.lat}, ${result.lon}, '${result.name}')">
            <div class="search-result-title">${result.name}</div>
            <div class="search-result-address">${result.address}</div>
        </div>
    `).join('');
    
    Elements.searchResults.innerHTML = resultsHtml;
    Elements.searchResults.style.display = 'block';
    Elements.searchResults.classList.add('slide-up');
    
    console.log(`📍 Displayed ${results.length} search results`);
}

/**
 * Hide search results
 */
function hideSearchResults() {
    if (Elements.searchResults) {
        Elements.searchResults.style.display = 'none';
        Elements.searchResults.classList.remove('slide-up');
    }
}

/**
 * Select a search result and show on map
 */
function selectSearchResult(lat, lon, name) {
    hideSearchResults();
    
    if (!AppState.map) {
        console.error('❌ Map not available');
        return;
    }
    
    // Clear existing markers
    AppState.markers.forEach(marker => {
        AppState.map.removeLayer(marker);
    });
    AppState.markers = [];
    
    // Add new marker
    const marker = L.marker([lat, lon]).addTo(AppState.map)
        .bindPopup(name)
        .openPopup();
    
    AppState.markers.push(marker);
    
    // Center map on result
    AppState.map.setView([lat, lon], 16);
    
    console.log(`📍 Selected result: ${name} at ${lat}, ${lon}`);
}

/**
 * Auto-request user location on startup
 */
function autoRequestLocation() {
    if (!navigator.geolocation) {
        console.log('❌ Geolocation not supported');
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
            console.warn('⚠️ Location request failed:', error.message);
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
        handleSearch,
        selectSearchResult,
        autoRequestLocation,
        getAppState,
        cleanup
    };
    
    // Make selectSearchResult globally available for onclick handlers
    window.selectSearchResult = selectSearchResult;
    
    console.log('🗺️ R1 Map App ready for integration');
}
