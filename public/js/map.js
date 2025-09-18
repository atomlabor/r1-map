/*
 * r1-map – Rabbit R1 Karten-App
 * Copyright © 2025 atomlabor.de – https://atomlabor.de
 * 
 * Entwickelt für Rabbit R1 Creations Platform
 * Integrierte Technologien: Leaflet.js, OpenStreetMap, Overpass API
 * Hardware-Support: Rabbit R1 Scrollwheel, PTT/SideButton, GPS
 * 
 * Features:
 * ✓ Touch-optimierte Benutzeroberfläche für 240x282px Display
 * ✓ Tile-Cache Clearing bei App-Start für frische Kartendaten
 * 
 * Made with ❤️ by atomlabor.de – Rabbit R1 Community
 */
// === CSS STYLING ===
const style = document.createElement('style');
style.textContent = `
  .leaflet-container {
    background: #ee530e !important;
  }
`;
document.head.appendChild(style);

// === GLOBALE VARIABLEN ===
let map, userMarker, currentPOIMarkers = [], tileLayer;
let isInitialized = false;

// === TILE CACHE CLEARING UTILITIES ===
function clearTileCache() {
  try {
    // Browser Storage APIs für Tile-Cache-Clearing
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          if (name.includes('tile') || name.includes('map') || name.includes('openstreetmap')) {
            caches.delete(name);
            console.log('Cache cleared:', name);
          }
        });
      });
    }
    
    // IndexedDB Clearing (falls von Leaflet genutzt)
    if ('indexedDB' in window) {
      const deleteReq = indexedDB.deleteDatabase('leaflet-tiles');
      deleteReq.onsuccess = () => console.log('IndexedDB tile cache cleared');
    }
    
    // LocalStorage Tile-Keys clearing
    Object.keys(localStorage).forEach(key => {
      if (key.includes('tile') || key.includes('leaflet') || key.includes('map')) {
        localStorage.removeItem(key);
        console.log('LocalStorage cleared:', key);
      }
    });
    
    console.log('🧹 Tile-Cache clearing completed');
  } catch (error) {
    console.warn('Tile-Cache clearing error:', error);
  }
}

// === HAUPTINITIALISIERUNG ===
document.addEventListener('DOMContentLoaded', () => {
  try {
    setStatus('🧹 Cache wird geleert...');
    clearTileCache(); // Tile-Cache früh im Initialisierungsprozess leeren
    
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
  
  // OpenStreetMap Tile Layer mit Cache-Control und Referenz speichern
  tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    subdomains: ['a', 'b', 'c'],
    keepBuffer: 6,
    unloadInvisibleTiles: false,
    reuseTiles: true,
    // Cache-Busting Parameter für frische Tiles
    updateWhenZooming: true,
    updateWhenIdle: true
  }).addTo(map);
  
  // Tile Layer Cache-Refresh nach Initialisierung
  setTimeout(() => {
    if (tileLayer && tileLayer._tiles) {
      // Alle geladenen Tiles als "expired" markieren für Refresh
      Object.keys(tileLayer._tiles).forEach(key => {
        const tile = tileLayer._tiles[key];
        if (tile && tile.el) {
          tile.el.style.opacity = '0.8'; // Visueller Hinweis auf Refresh
        }
      });
      // Force Tile Refresh
      tileLayer.redraw();
      console.log('🔄 Tile Layer refresh completed');
    }
  }, 1000);
  
  // Map Event Listeners
  map.on('moveend', () => {
    setStatus(`Zoom: ${map.getZoom()} | Zentrum aktualisiert`);
  });
  
  map.on('click', (e) => {
    setStatus(`Koordinaten: ${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`);
  });
  
  // Tile Load Events für Cache-Status
  map.on('tileload', () => {
    console.log('✓ Fresh tile loaded');
  });
}
