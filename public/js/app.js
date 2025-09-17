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
    zoom: 15,
    markers: [],
    searchActive: false,
    poiVisible: true,
    locationMarker: null,
    watchId: null
};

// DOM elements cache
const Elements = {
    loading: null,
    app: null,
    map: null,
    status: null,
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
    updateStatus('App initialized');
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
    Elements.searchInput = document.getElementById('search-input');
    Elements.searchButton = document.getElementById('search-btn');
    Elements.searchResults = document.getElementById('search-results');
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
        updateStatus('Map loaded');
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
        updateStatus('R1 device detected');
    } else {
        console.log('🖥️ Running in browser (development mode)');
        document.body.classList.add('browser-mode');
        updateStatus('Browser mode');
    }
}

/**
 * Setup event listeners for UI interactions
 */
function setupEventListeners() {
    // Search functionality
    if (Elements.searchButton) {
        Elements.searchButton.addEventListener('click', handleSearch);
    }
    
    if (Elements.searchInput) {
        Elements.searchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                handleSearch();
            }
        });
        
        Elements.searchInput.addEventListener('input', function() {
            if (this.value.trim() === '') {
                hideSearchResults();
            }
        });
    }
    
    console.log('🎧 Event listeners setup complete');
}

/**
 * Handle search functionality
 */
function handleSearch() {
    if (!Elements.searchInput) return;
    
    const query = Elements.searchInput.value.trim();
    if (!query) {
        updateStatus('Please enter a search term');
        return;
    }
    
    console.log(`🔍 Searching for: ${query}`);
    updateStatus(`Searching for: ${query}`);
    
    // Show loading state
    showSearchResults();
    Elements.searchResults.innerHTML = '<div style="padding: 10px; color: #ccc;">Searching...</div>';
    
    // Use Nominatim API for geocoding
    searchPlaces(query);
}

/**
 * Search for places using Nominatim API
 */
function searchPlaces(query) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displaySearchResults(data);
            updateStatus(`Found ${data.length} results`);
        })
        .catch(error => {
            console.error('Search error:', error);
            updateStatus('Search failed - please try again');
            Elements.searchResults.innerHTML = '<div style="padding: 10px; color: #ff6b35;">Search failed. Please try again.</div>';
        });
}

/**
 * Display search results
 */
function displaySearchResults(results) {
    if (!Elements.searchResults || !results.length) {
        Elements.searchResults.innerHTML = '<div style="padding: 10px; color: #ccc;">No results found</div>';
        return;
    }
    
    let html = '';
    results.forEach((result, index) => {
        html += `
            <div onclick="selectSearchResult(${result.lat}, ${result.lon}, '${result.display_name.replace(/'/g, "\\'")}')"
                 style="padding: 10px; border-bottom: 1px solid #333; cursor: pointer; color: #fff;"
                 onmouseover="this.style.backgroundColor='rgba(255,107,53,0.1)'"
                 onmouseout="this.style.backgroundColor='transparent'">
                📍 ${result.display_name}
            </div>
        `;
    });
    
    Elements.searchResults.innerHTML = html;
    showSearchResults();
}

/**
 * Select a search result
 */
function selectSearchResult(lat, lng, name) {
    console.log(`📍 Selected: ${name}`);
    updateStatus('Location selected');
    
    // Center map on selected location
    if (AppState.map) {
        AppState.map.setView([lat, lng], 16);
        
        // Add marker for selected location
        const marker = L.marker([lat, lng])
            .addTo(AppState.map)
            .bindPopup(`📍 ${name}`)
            .openPopup();
        
        // Store marker for cleanup
        if (AppState.searchMarker) {
            AppState.map.removeLayer(AppState.searchMarker);
        }
        AppState.searchMarker = marker;
    }
    
    // Hide search results
    hideSearchResults();
    Elements.searchInput.value = '';
}

/**
 * Show search results panel
 */
function showSearchResults() {
    if (Elements.searchResults) {
        Elements.searchResults.style.display = 'block';
    }
}

/**
 * Hide search results panel
 */
function hideSearchResults() {
    if (Elements.searchResults) {
        Elements.searchResults.style.display = 'none';
    }
}

/**
 * Auto-request location on startup
 */
function autoRequestLocation() {
    console.log('📍 Auto-requesting location...');
    updateStatus('Finding your location...');
    
    if (navigator.geolocation) {
        // Get current position
        navigator.geolocation.getCurrentPosition(
            (position) => {
                handleLocationSuccess(position);
                
                // Start watching position for continuous updates
                AppState.watchId = navigator.geolocation.watchPosition(
                    handleLocationSuccess,
                    handleLocationError,
                    { enableHighAccuracy: true, maximumAge: 30000, timeout: 15000 }
                );
            },
            handleLocationError,
            { enableHighAccuracy: true, timeout: 10000 }
        );
    } else {
        updateStatus('Geolocation not available');
        console.warn('⚠️ Geolocation not supported');
    }
}

/**
 * Handle successful location acquisition
 */
function handleLocationSuccess(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const accuracy = position.coords.accuracy;
    
    AppState.currentLocation = { lat, lng, accuracy };
    
    if (AppState.map) {
        // Center map on user location
        AppState.map.setView([lat, lng], AppState.zoom);
        
        // Add or update location marker
        if (AppState.locationMarker) {
            AppState.map.removeLayer(AppState.locationMarker);
        }
        
        AppState.locationMarker = L.marker([lat, lng])
            .addTo(AppState.map)
            .bindPopup('📍 Your location')
            .openPopup();
    }
    
    updateStatus('Your location found');
    console.log(`✅ Location acquired: ${lat.toFixed(4)}, ${lng.toFixed(4)} (±${Math.round(accuracy)}m)`);
}

/**
 * Handle location error
 */
function handleLocationError(error) {
    let message = 'Location unavailable';
    
    switch(error.code) {
        case error.PERMISSION_DENIED:
            message = 'Location access denied';
            break;
        case error.POSITION_UNAVAILABLE:
            message = 'Location unavailable';
            break;
        case error.TIMEOUT:
            message = 'Location timeout';
            break;
    }
    
    updateStatus(message);
    console.error('❌ Location error:', message);
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
            
            updateStatus('R1 SDK active');
            console.log('✅ Rabbit SDK initialized');
        } catch (error) {
            console.error('❌ Rabbit SDK initialization failed:', error);
            updateStatus('SDK error');
        }
    } else {
        console.log('⚠️ Rabbit SDK not available (development mode)');
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
        updateStatus,
        cleanup
    };
    
    // Make selectSearchResult globally available for onclick handlers
    window.selectSearchResult = selectSearchResult;
    
    console.log('🗺️ R1 Map App ready for integration');
}
