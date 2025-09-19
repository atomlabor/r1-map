/**
 * R1 Map - Clean Leaflet 1.9.4 Application
 * Basic map initialization with Germany as starting point
 * Version 1.8 | Atomlabor.de Design
 */

// Global variables
let map;
let popup;

// Hide loading screen function
function hideLoadingScreen() {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
}

// Show elegant info popup
function showInfoPopup() {
    // Remove existing popup if any
    hideInfoPopup();
    
    // Create popup container
    popup = document.createElement('div');
    popup.className = 'info-popup';
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.maxWidth = '132px';
    popup.style.backgroundColor = 'white';
    popup.style.border = '1px solid #ddd';
    popup.style.borderRadius = '5px';
    popup.style.boxShadow = '0 2px 7px rgba(0, 0, 0, 0.15)';
    popup.style.padding = '8px';
    popup.style.zIndex = '1001';
    popup.style.fontSize = '9px';
    popup.style.fontFamily = 'Arial, sans-serif';
    popup.style.lineHeight = '1.3';
    popup.style.color = '#222';
    
    // Create close button
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '×';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '2px';
    closeButton.style.right = '5px';
    closeButton.style.border = 'none';
    closeButton.style.background = 'transparent';
    closeButton.style.fontSize = '12px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.color = '#666';
    closeButton.addEventListener('click', hideInfoPopup);
    
    // Create text content
    const textContent = document.createElement('div');
    textContent.innerHTML = 'made with ❤️ for the r1 community by atomlabor.de | if you like it, buy me a coffee: <a href="https://ko-fi.com/atomlabor" style="color: #222;" target="_blank">https://ko-fi.com/atomlabor</a>';
    textContent.style.marginBottom = '8px';
    textContent.style.color = '#222';
    
    const logoContainer = document.createElement('div');
    logoContainer.style.textAlign = 'center';
    
    const logo = document.createElement('img');
    logo.src = 'https://github.com/atomlabor/r1-map/blob/main/public/r1-map.png?raw=true';
    logo.style.maxWidth = '32px';
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

// Initialize the map
function initMap() {
    // Create map centered on Germany
    map = L.map('map').setView([51.1657, 10.4515], 6);
    
    // Set background color
    map.getContainer().style.background = '#ee530e';
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Add radar control after map and tile layer initialization
    // This is the critical part for radar functionality
    setTimeout(function() {
        L.control.radar({position: 'bottomright'}).addTo(map);
        console.log('Radar control added successfully');
        
        // Hide loading screen after everything is loaded
        hideLoadingScreen();
    }, 100);
    
    console.log('Map initialized successfully');
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing R1 Map...');
    
    initMap();
});

// Hide popup when clicking outside
document.addEventListener('click', function(event) {
    if (popup && !popup.contains(event.target)) {
        hideInfoPopup();
    }
});
