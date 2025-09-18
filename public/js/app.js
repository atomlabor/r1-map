/**
 * R1 Map - Clean Leaflet 1.9.4 Application
 * Basic map initialization with Germany as starting point
 */

// Global variables
let map;

// Hide loading screen
function hideLoadingScreen() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = 'none';
    }
}

// Initialize map
function initMap() {
    // Create map centered on Germany with OSM.DE tiles
    map = L.map('map').setView([51.1657, 10.4515], 6);
    
    // Add OpenStreetMap Germany tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    console.log('Map initialized successfully');
    hideLoadingScreen();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing R1 Map...');
    initMap();
});
