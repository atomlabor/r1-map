/**
 * R1 Map - Clean Leaflet 1.9.4 Application
 * Basic map initialization with Germany as starting point
 * Version 1.5 | Atomlabor.de Design
 */
// Global variables
let map;
let popup;
// Create and position header button
function createHeaderButton() {
    // Remove any existing header buttons to prevent duplicates
    const existingButtons = document.querySelectorAll('.header-button');
    existingButtons.forEach(button => button.remove());
    
    // Create new header button
    const headerButton = document.createElement('button');
    headerButton.className = 'header-button';
    headerButton.textContent = 'r1 map';
    
    // Set positioning styles (right top corner, text-width only)
    headerButton.style.position = 'fixed';
    headerButton.style.right = '12px';
    headerButton.style.top = '0';
    headerButton.style.zIndex = '1000';
    headerButton.style.padding = '0 6px';
    headerButton.style.border = 'none';
    headerButton.style.background = 'transparent';
    headerButton.style.cursor = 'pointer';
    
    // Add click event for popup
    headerButton.addEventListener('click', showInfoPopup);
    
    // Add button to body
    document.body.appendChild(headerButton);
    
    console.log('Header button created and positioned');
}
// Show elegant info popup
function showInfoPopup() {
    // Remove existing popup if any
    hideInfoPopup();
    
    // Create popup container
    popup = document.createElement('div');
    popup.className = 'info-popup';
    popup.style.position = 'fixed';
    popup.style.top = '30px';
    popup.style.right = '12px';
    popup.style.width = '220px';
    popup.style.backgroundColor = 'white';
    popup.style.border = '1px solid #ddd';
    popup.style.borderRadius = '8px';
    popup.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    popup.style.padding = '15px';
    popup.style.zIndex = '1001';
    popup.style.fontSize = '14px';
    popup.style.fontFamily = 'Arial, sans-serif';
    popup.style.lineHeight = '1.4';
    popup.style.color = '#222';
    
    // Create close button
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '×';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '5px';
    closeButton.style.right = '8px';
    closeButton.style.border = 'none';
    closeButton.style.background = 'transparent';
    closeButton.style.fontSize = '18px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.color = '#666';
    closeButton.addEventListener('click', hideInfoPopup);
    
    // Create text content
    const textContent = document.createElement('div');
    textContent.innerHTML = 'made with ❤️ for the r1 community by atomlabor.de | if you like it, buy me a coffee: <a href="https://ko-fi.com/atomlabor" style="color: #222;" target="_blank">https://ko-fi.com/atomlabor</a>';
    textContent.style.marginBottom = '15px';
    textContent.style.color = '#222';
    
    // Create logo container
    const logoContainer = document.createElement('div');
    logoContainer.style.textAlign = 'center';
    
    // Create logo image
    const logo = document.createElement('img');
    logo.src = 'public/r1-map.png';
    logo.style.maxWidth = '70px';
    logo.style.height = 'auto';
    logo.style.display = 'block';
    logo.style.margin = '0 auto';
    
    logoContainer.appendChild(logo);
    
    // Assemble popup
    popup.appendChild(closeButton);
    popup.appendChild(textContent);
    popup.appendChild(logoContainer);
    
    // Add to body
    document.body.appendChild(popup);
}
// Hide info popup
function hideInfoPopup() {
    if (popup) {
        popup.remove();
        popup = null;
    }
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
// Close popup when clicking outside
document.addEventListener('click', function(event) {
    if (popup && !popup.contains(event.target) && !event.target.classList.contains('header-button')) {
        hideInfoPopup();
    }
});
