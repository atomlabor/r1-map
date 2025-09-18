/**
 * R1 Map - Clean Leaflet 1.9.4 Application
 * Basic map initialization with Germany as starting point
 * Version 1.5 | Atomlabor.de Design
 */
// Global variables
let map;

// Create and position header button
function createHeaderButton() {
    // Remove any existing header buttons to prevent duplicates
    const existingButtons = document.querySelectorAll('.header-button');
    existingButtons.forEach(button => button.remove());
    
    // Create new header button
    const headerButton = document.createElement('button');
    headerButton.className = 'header-button';
    headerButton.textContent = 'Menu';
    
    // Set positioning styles (right top corner, narrow)
    headerButton.style.position = 'fixed';
    headerButton.style.right = '12px';
    headerButton.style.top = '0';
    headerButton.style.zIndex = '1000';
    
    // Add button to body
    document.body.appendChild(headerButton);
    
    console.log('Header button created and positioned');
}

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
    createHeaderButton(); // Create header button first
    initMap();
});
