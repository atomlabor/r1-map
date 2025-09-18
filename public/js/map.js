/*
 * r1-map – Rabbit R1 Karten- und Navigations-App
 * Copyright © 2025 atomlabor.de – https://atomlabor.de
 * 
 * Entwickelt für Rabbit R1 Creations Platform
 * Integrierte Technologien: Leaflet.js, OpenStreetMap, Overpass API
 * Hardware-Support: Rabbit R1 Scrollwheel, PTT/SideButton, GPS
 * 
 * Features:
 * ✓ Interaktive Kartendarstellung mit OpenStreetMap
 * ✓ Live POI-Suche über Overpass API
 * ✓ GPS-Positionsbestimmung und Nutzer-Marker
 * ✓ Rabbit R1 Hardware-Events (Scrollrad für Zoom, PTT für Suche)
 * ✓ Touch-optimierte Benutzeroberfläche für 240x282px Display
 * 
 * Made with ❤️ by atomlabor.de – Rabbit R1 Community
 */
// === GLOBALE VARIABLEN ===
let map, userMarker, currentPOIMarkers = [];
let isInitialized = false;
// === HAUPTINITIALISIERUNG ===
document.addEventListener('DOMContentLoaded', () => {
  try {
    setStatus('🗺️ Karte wird initialisiert...');
    initializeMap();
    setupEventListeners();
    setupRabbitHardwareEvents();
    isInitialized = true;
    setStatus('✅ r1-map bereit – atomlabor.de');
  } catch (error) {
    setStatus('❌ Initialisierungsfehler');
    console.error('r1-map Init Error:', error);
  }
});
// === KARTEN-INITIALISIERUNG ===
function initializeMap() {
  // Leaflet Map erstellen (optimiert für Rabbit R1 Display)
  map = L.map('map', {
    center: [51.1657, 10.4515], // Deutschland (Ländermitte)
    zoom: 6,
    minZoom: 8,
    maxZoom: 18,
    zoomControl: false,
    attributionControl: false,
    preferCanvas: true // Performance-Optimierung
  });
  // OpenStreetMap Tile Layer mit Buffer-Optimierung
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    subdomains: ['a', 'b', 'c'],
    keepBuffer: 6,
    unloadInvisibleTiles: false,
    reuseTiles: true
  }).addTo(map);
  // Map Event Listeners
  map.on('moveend', () => {
    setStatus(`Zoom: ${map.getZoom()} | Zentrum aktualisiert`);
  });
  map.on('click', (e) => {
    setStatus(`Koordinaten: ${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`);
  });
}
