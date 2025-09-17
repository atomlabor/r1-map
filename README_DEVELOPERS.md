# R1 Map - Developer Guide

Kurze Entwicklerhinweise für die r1-map Rabbit R1 Creations App.

## 🚀 Schnellstart

```bash
# Repository klonen
git clone https://github.com/atomlabor/r1-map.git
cd r1-map

# Entwicklungsserver starten (optional)
python3 -m http.server 8000
# oder
npx serve public
```

## 📁 Projektstruktur

```
r1-map/
├── public/
│   ├── index.html          # Hauptinterface mit R1-Controls
│   ├── css/
│   │   └── style.css       # R1-optimierte Styles
│   └── js/
│       ├── app.js          # Haupt-Controller mit SDK Integration
│       └── map.js          # Map-Library Placeholder
├── README.md               # Projekt-Readme
├── README_DEVELOPERS.md    # Diese Datei
└── LICENSE                 # MIT-Lizenz
```

## 🛠 Technischer Aufbau

### Frontend-Stack
- **HTML5**: Semantische Struktur
- **CSS3**: Responsive Design für R1-Display
- **Vanilla JS**: Keine Dependencies für bessere R1-Performance

### R1-Integration
- **Rabbit Creations SDK**: Hardware-Integration (in Vorbereitung)
- **Touch-Optimierung**: Große Buttons, einfache Navigation
- **Display-Anpassung**: Optimiert für R1-Bildschirmgröße

### Map-Engine
- **Organic Maps**: Geplante Integration für Offline-Karten
- **OpenStreetMap**: Datenbasis für Kartenmaterial
- **Placeholder-System**: Entwicklungsframework bis zur vollständigen Integration

## 🧩 Komponenten

### `app.js` - Hauptcontroller
```javascript
// R1-Device Detection
AppState.isR1Device = typeof window.RabbitCreations !== 'undefined';

// Hardware Integration
initializeRabbitSDK();

// UI Event Handling
setupEventListeners();
```

### `map.js` - Kartenlogik
```javascript
// Map Initialization
initializeMap();

// Position Handling
setCurrentPosition(lat, lng);

// Route Calculation
calculateRoute(from, to, options);
```

## 🔧 Entwicklung

### Lokale Tests
1. `public/index.html` in Browser öffnen
2. Browser-Entwicklertools verwenden
3. Konsole für Debug-Ausgaben beachten

### R1-Spezifische Features
- **Voice Controls**: Sprachsteuerung über R1 SDK
- **Hardware Buttons**: Integration mit R1-Hardwaresteuerung
- **Battery Status**: R1-Akkustand-Monitoring
- **GPS Integration**: R1-interne GPS-Funktionen

## 📋 TODOs

### Kurzfristig
- [ ] Rabbit Creations SDK vollständig integrieren
- [ ] Organic Maps API einbinden
- [ ] Touch-Gesten für Kartensteuerung
- [ ] Offline-Kartendaten vorbereiten

### Mittelfristig
- [ ] Sprachsteuerung implementieren
- [ ] Routenplanung mit Turn-by-Turn Navigation
- [ ] POI-Suche und -Anzeige
- [ ] Favoriten und Verlauf

### Langfristig
- [ ] Multi-Modal Transport (ÖPNV, Fahrrad, Auto)
- [ ] Community-Features (geteilte Routen)
- [ ] Erweiterte R1-Hardware-Integration
- [ ] Performanz-Optimierungen

## 🚦 Code-Konventionen

- **ES6+**: Moderne JavaScript-Features
- **Modularer Aufbau**: Getrennte Verantwortlichkeiten
- **Kommentierung**: Besonders für R1-spezifische Funktionen
- **TODO-Markierungen**: Für geplante Integrationen

## 🐛 Debugging

```javascript
// Debug-Modus aktivieren
window.R1MapApp.AppState.debugMode = true;

// Map-Status prüfen
console.log(window.R1MapController.getMapState());

// R1-Device-Status
console.log('R1 Device:', window.R1MapApp.AppState.isR1Device);
```

## 🔗 Wichtige Links

- [Rabbit Creations Platform](https://rabbit.tech/creations)
- [Organic Maps](https://organicmaps.app/)
- [OpenStreetMap](https://www.openstreetmap.org/)
- [r1-flashlight Reference](https://github.com/atomlabor/flashlight)

## 📞 Support

Bei Fragen oder Problemen:
- GitHub Issues verwenden
- Code-Reviews willkommen
- Rabbit R1 Community Discord

---

*Entwickelt mit ❤️ für die Rabbit R1 Community*
