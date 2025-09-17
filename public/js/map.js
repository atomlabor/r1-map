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
    center: [51.256211, 7.150764], // Wuppertal, Deutschland
    zoom: 13,
    minZoom: 8,
    maxZoom: 18,
    zoomControl: false,
    attributionControl: false,
    preferCanvas: true // Performance-Optimierung
  });

  // OpenStreetMap Tile Layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    subdomains: ['a', 'b', 'c']
  }).addTo(map);

  // Map Event Listeners
  map.on('moveend', () => {
    setStatus(`Zoom: ${map.getZoom()} | Zentrum aktualisiert`);
  });

  map.on('click', (e) => {
    setStatus(`Koordinaten: ${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`);
  });
}

// === UI EVENT LISTENERS ===
function setupEventListeners() {
  // Zoom Controls
  document.getElementById('btn-zoom-in')?.addEventListener('click', () => {
    map.zoomIn();
    setStatus('🔍 Herangezoomt (+1)');
  });

  document.getElementById('btn-zoom-out')?.addEventListener('click', () => {
    map.zoomOut();
    setStatus('🔍 Herausgezoomt (-1)');
  });

  // Standort-Button
  document.getElementById('btn-location')?.addEventListener('click', locateUser);

  // POI-Suche Button
  document.getElementById('btn-poi')?.addEventListener('click', () => {
    showPOISearchDialog();
  });

  // Karte zurücksetzen
  document.getElementById('btn-reset')?.addEventListener('click', () => {
    map.setView([51.256211, 7.150764], 13);
    clearAllPOIs();
    setStatus('🏠 Karte zurückgesetzt');
  });
}

// === RABBIT R1 HARDWARE EVENTS ===
function setupRabbitHardwareEvents() {
  // Scrollwheel für Zoom (Rabbit R1 spezifisch)
  window.addEventListener('scrollUp', () => {
    if (isInitialized) {
      map.zoomIn();
      setStatus('🎡 Scrollrad: Zoom + ');
    }
  });

  window.addEventListener('scrollDown', () => {
    if (isInitialized) {
      map.zoomOut();
      setStatus('🎡 Scrollrad: Zoom - ');
    }
  });

  // PTT/SideButton für schnelle POI-Suche
  window.addEventListener('sideClick', () => {
    if (isInitialized) {
      setStatus('🎤 PTT: POI-Suche aktiviert');
      showPOISearchDialog();
    }
  });

  // Long Press PTT für Standort-Suche
  window.addEventListener('sideLongPress', () => {
    if (isInitialized) {
      setStatus('📍 PTT Lang: GPS-Suche');
      locateUser();
    }
  });
}

// === STATUS-ANZEIGE ===
function setStatus(message) {
  const statusElement = document.getElementById('status');
  if (statusElement) {
    statusElement.textContent = message;
    // Status nach 5 Sekunden zurücksetzen
    setTimeout(() => {
      if (statusElement.textContent === message) {
        statusElement.textContent = 'r1-map | atomlabor.de';
      }
    }, 5000);
  }
  console.log('[r1-map]', message);
}

// === GPS-POSITIONSBESTIMMUNG ===
function locateUser() {
  setStatus('📡 GPS-Position wird ermittelt...');
  
  if (!navigator.geolocation) {
    setStatus('❌ GPS nicht verfügbar');
    return;
  }

  const options = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 60000
  };

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude, accuracy } = position.coords;
      
      // Bestehenden User-Marker entfernen
      if (userMarker) {
        map.removeLayer(userMarker);
      }

      // Neuen User-Marker setzen
      userMarker = L.marker([latitude, longitude], {
        title: 'Deine Position'
      }).addTo(map);

      userMarker.bindPopup(`
        <strong>📍 Deine Position</strong><br>
        Genauigkeit: ${Math.round(accuracy)}m<br>
        <small>Powered by atomlabor.de</small>
      `).openPopup();

      map.setView([latitude, longitude], 16);
      setStatus(`✅ GPS gefunden | ±${Math.round(accuracy)}m`);
    },
    (error) => {
      let errorMsg = '❌ GPS-Fehler: ';
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMsg += 'Berechtigung verweigert';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMsg += 'Position nicht verfügbar';
          break;
        case error.TIMEOUT:
          errorMsg += 'Timeout erreicht';
          break;
        default:
          errorMsg += 'Unbekannter Fehler';
      }
      setStatus(errorMsg);
    },
    options
  );
}

// === POI-SUCHE DIALOG ===
function showPOISearchDialog() {
  const commonPOIs = ['cafe', 'restaurant', 'bakery', 'pharmacy', 'bank', 'fuel', 'hospital', 'police'];
  const selection = prompt(
    'POI-Suche in der Umgebung:\n\n' +
    'Häufige Suchen:\n' +
    '• cafe (Café)\n' +
    '• restaurant (Restaurant)\n' +
    '• bakery (Bäckerei)\n' +
    '• pharmacy (Apotheke)\n' +
    '• bank (Bank)\n' +
    '• fuel (Tankstelle)\n\n' +
    'Oder eigenen Begriff eingeben:'
  );

  if (selection && selection.trim()) {
    searchPOIs(selection.trim().toLowerCase());
  }
}

// === POI-SUCHE MIT OVERPASS API ===
function searchPOIs(amenityType) {
  setStatus(`🔍 Suche ${amenityType}...`);
  
  const bounds = map.getBounds();
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="${amenityType}"](${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()});
      way["amenity"="${amenityType}"](${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()});
    );
    out body center;
  `;

  const overpassUrl = 'https://overpass-api.de/api/interpreter';
  
  fetch(overpassUrl, {
    method: 'POST',
    body: query,
    headers: {
      'Content-Type': 'text/plain'
    }
  })
  .then(response => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  })
  .then(data => {
    displayPOIResults(data, amenityType);
  })
  .catch(error => {
    console.error('POI Search Error:', error);
    setStatus('❌ POI-Suche fehlgeschlagen');
  });
}

// === POI-ERGEBNISSE ANZEIGEN ===
function displayPOIResults(data, searchTerm) {
  // Vorherige POI-Marker entfernen
  clearAllPOIs();

  if (!data.elements || data.elements.length === 0) {
    setStatus(`❌ Keine ${searchTerm} in der Umgebung gefunden`);
    return;
  }

  const poiIcon = L.divIcon({
    html: '📍',
    iconSize: [20, 20],
    className: 'poi-marker'
  });

  data.elements.forEach((element, index) => {
    let lat, lng;
    
    if (element.lat && element.lon) {
      lat = element.lat;
      lng = element.lon;
    } else if (element.center) {
      lat = element.center.lat;
      lng = element.center.lon;
    } else {
      return; // Skip if no coordinates
    }

    const name = element.tags?.name || `${searchTerm} #${index + 1}`;
    const address = element.tags?.['addr:street'] ? 
      `${element.tags['addr:street']} ${element.tags['addr:housenumber'] || ''}` : 
      'Adresse unbekannt';

    const marker = L.marker([lat, lng], { icon: poiIcon })
      .addTo(map)
      .bindPopup(`
        <strong>${name}</strong><br>
        <small>${address}</small><br>
        <em>Typ: ${searchTerm}</em>
      `);

    currentPOIMarkers.push(marker);
  });

  setStatus(`✅ ${data.elements.length} ${searchTerm} gefunden`);
  
  // Karte auf POIs zentrieren, falls vorhanden
  if (currentPOIMarkers.length > 0) {
    const group = new L.featureGroup(currentPOIMarkers);
    map.fitBounds(group.getBounds().pad(0.1));
  }
}

// === POI-MARKER LÖSCHEN ===
function clearAllPOIs() {
  currentPOIMarkers.forEach(marker => {
    map.removeLayer(marker);
  });
  currentPOIMarkers = [];
}

// === UTILITY FUNKTIONEN ===
function getMapCenter() {
  return map.getCenter();
}

function getCurrentZoom() {
  return map.getZoom();
}

// === RABBIT R1 OPTIMIERTE TOUCH EVENTS ===
document.addEventListener('touchstart', (e) => {
  // Verhindere Zoom bei Doppeltap für bessere R1 Erfahrung
  if (e.touches.length > 1) {
    e.preventDefault();
  }
}, { passive: false });

/*
 * === ENDE r1-map CORE ===
 * 
 * Entwickelt von atomlabor.de für die Rabbit R1 Community
 * GitHub: https://github.com/atomlabor/r1-map
 * Web: https://atomlabor.de
 * 
 * Für Fragen, Bugs oder Feature-Requests:
 * Besuche atomlabor.de oder erstelle ein GitHub Issue
 */
