<img width="350" src="https://raw.githubusercontent.com/atomlabor/r1-map/main/r1%20map.png" alt="r1-map">

# r1-map (Update V 1.6)

## ENG

### Minimal Rabbit R1 Map App with Weather Radar

A minimalist map app designed for the Rabbit R1 device. Based on OpenStreetMap and Leaflet, with touch and pinch-to-zoom support and integrated weather radar overlay. UI is intentionally minimal — no search or overlays except weather radar, no offline mode, hardware controls are in preparation.

**Current Status:** Updated to version 1.6 with integrated weather radar functionality via leaflet-radar plugin.

**Implemented Features:**
- 🗺️ Clean Leaflet map (OpenStreetMap.de tiles)
- 👆 Touch navigation (pan and pinch-to-zoom)
- 🎯 Centered header overlay
- ⚡ Loading screen while map initializes
- ✅ Functional map controls (zoom, drag)
- 🌦️ **NEW**: Weather radar overlay with leaflet-radar plugin
- 🎨 **NEW**: Popup redesign in Rabbit R1 style
- 🎛️ **NEW**: Centered radar control button
- ✨ **NEW**: Enhanced UI styling adapted for Rabbit R1

**Weather Radar Integration:**
- US radar data via Iowa State University (NEXRAD tiles)
- Flexible weather overlay using adapted leaflet-radar plugin
- Seamless integration with Leaflet map framework
- UI controls optimized for Rabbit R1 interface

**Hardware integration (planned, when supported by rabbit.tech):**
- ScrollWheel: zoom in/out the map (planned)
- PTT Button: visual feedback on map (planned)
- Touch: drag/pinch to pan & zoom (implemented)

**Tech stack:**
- HTML5 (clean structure)
- Leaflet 1.9.4
- leaflet-radar (forked/adapted)
- Vanilla JS
- OpenStreetMap.de
- NEXRAD weather data

---

## DEU

### Minimalistische Karten-App für das Rabbit R1 mit Wetter-Radar (Update V 1.6)

Eine ultraleichte Karten-App für das Rabbit R1. OpenStreetMap & Leaflet, Touch- und Pinch-Zoom-Bedienung mit integriertem Wetter-Radar-Overlay. UI und Steuerung sind minimal – keine Suche, keine Overlays außer Wetter-Radar, kein Offline-Modus, Hardware-Steuerung in Vorbereitung.

**Aktueller Status:** Update auf Version 1.6 mit integrierter Wetter-Radar-Funktionalität über leaflet-radar Plugin.

**Implementierte Funktionen:**
- 🗺️ Saubere Leaflet-Karte (OpenStreetMap.de Tiles)
- 👆 Kartenbedienung mit Touch (Pan & Zoom)
- 🎯 Zentrierter Header-Overlay
- ⚡ Ladebildschirm während Karteninitialisierung
- ✅ Funktionale Kartensteuerung (Zoom, Verschieben)
- 🌦️ **NEU**: Wetter-Radar-Overlay mit leaflet-radar Plugin
- 🎨 **NEU**: Popup-Redesign im Rabbit R1-Stil
- 🎛️ **NEU**: Zentrierter Radar-Kontroll-Button
- ✨ **NEU**: Erweiterte UI-Gestaltung für Rabbit R1 angepasst

**Wetter-Radar-Integration:**
- US-Radardaten über Iowa State University (NEXRAD-Kacheln)
- Flexibles Wetter-Overlay mit angepasstem leaflet-radar Plugin
- Nahtlose Integration in Leaflet-Karten-Framework
- UI-Steuerung für Rabbit R1-Interface optimiert

**Hardware-Integration (in Vorbereitung, wenn rabbit tech es unterstützt):**
- ScrollWheel: Zoom der Karte (geplant)
- PTT-Button: Visuelle Rückmeldung auf der Map (geplant)
- Touch: Bewegen & Zoomen der Karte (implementiert)

**Technischer Stack:**
- HTML5 (saubere Struktur)
- Leaflet 1.9.4
- leaflet-radar (forked/angepasst)
- Vanilla JS
- OpenStreetMap.de
- NEXRAD-Wetterdaten

---

## Sources / Quellen

**Data Sources:**
- US Radar Data © Iowa State University/IEM (https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913/{z}/{x}/{y}.png)
- Map tiles © OpenStreetMap contributors
- Leaflet mapping library
- leaflet-radar plugin (forked/adapted for this project)
- All icons and UI adaptations © atomlabor.de

**Special Thanks:**
We extend our gratitude to the Iowa State University and their Iowa Environmental Mesonet for providing comprehensive weather radar data that makes this enhanced mapping experience possible.

---

*Developed with ❤️ for the Rabbit R1 community*
