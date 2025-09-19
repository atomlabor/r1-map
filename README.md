![r1-map](https://raw.githubusercontent.com/atomlabor/r1-map/main/r1%20map.png)
# r1-map (Update V 1.7)
Schneller Zugriff, optimierte Usability, Radar-Tool für rabbit r1!

## NEU in Version 1.7
- Deutlich schnellere Ladezeit und konsequent reduzierte Overlays
- Verbesserte Ladezeit-Anzeige 
- Wetter-Radar-Plugin als Kontrollbox 
- Vollständige Touch-Unterstützung: Ziehen, Zoomen, Bedienung auf Rabbit r1 und Mobile
- Leaflet-Bibliotheken werden wieder per CDN geladen – maximale Kompatibilität und Stabilität
- Sauberes, modernes Rabbit-Orange Theme (Map-Hintergrund)
- Neue, kompakte HTML- und CSS-Struktur – alles für pures Speed-Feeling auf Geräten

## Features
- 🗺️ Minimalistische OSM-Karte (Tile-Layer OpenStreetMap.de)
- 👆 Touch & Pinch Zoom
- ☁️ Wetter-Radar Layer (NEXRAD/IEM)
- 🎨 Rabbit-Stil UI/Overlay & Popup-Dialog
- ⚡️ Ultrakurze Ladezeit, optimiert für mobile Geräte & r1
- 💡 Open Source & laufend weiterentwickelt

## Schnellstart
1. Klonen/downloaden
2. [index.html](public/index.html) enthält alle Pfade für lokalen und CDN-Betrieb
3. Starten im Browser – alles direkt lauffähig!

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

## Sources / Quellen
**Data Sources:**
- US Radar Data © Iowa State University/IEM (https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913/{z}/{x}/{y}.png)
- Map tiles © OpenStreetMap contributors
- Leaflet mapping library
- leaflet-radar plugin (forked/adapted for this project)
- All icons and UI adaptations © atomlabor.de

---
**Special Thanks:** We extend our gratitude to the Iowa State University and their Iowa Environmental Mesonet for providing comprehensive weather radar data that makes this enhanced mapping experience possible.

Developed with ❤️ for the Rabbit R1 community

---

> **DE:** Hinweis: Es wird bewusst Leaflet Version 1.9.4 verwendet und nicht 2.x, da viele Plugins (z.B. Radar, Toolbar, GeometryUtil) noch keine stabile Kompatibilität mit Version 2.0 bieten. Leaflet 2.x liegt aktuell nur als Alpha-Version vor und ist nicht für produktive Projekte geeignet.

> **EN:** Note: This project intentionally uses Leaflet version 1.9.4 instead of 2.x. Many plugins (e.g., radar, toolbar, geometryUtil) are not yet fully compatible with Leaflet 2.x, which is currently only available as an alpha version and not recommended for production use.

---

## English
![r1-map](https://raw.githubusercontent.com/atomlabor/r1-map/main/r1%20map.png)
# r1-map (Update V 1.7)
Fast access, optimized usability, radar tool for rabbit r1!

## NEW in Version 1.7
- Significantly faster loading time and consistently reduced overlays
- Improved loading time indicator
- Weather radar plugin as control box
- Full touch support: dragging, zooming, operation on Rabbit r1 and mobile
- Leaflet libraries are loaded via CDN again – maximum compatibility and stability
- Clean, modern Rabbit-Orange theme (map background)
- New, compact HTML and CSS structure – everything for pure speed feeling on devices

## Features
- 🗺️ Minimalist OSM map (Tile layer OpenStreetMap.de)
- 👆 Touch & Pinch Zoom
- ☁️ Weather radar layer (NEXRAD/IEM)
- 🎨 Rabbit-style UI/Overlay & Popup dialog
- ⚡️ Ultra-fast loading time, optimized for mobile devices & r1
- 💡 Open source & continuously developed

## Quick Start
1. Clone/download
2. [index.html](public/index.html) contains all paths for local and CDN operation
3. Start in browser – everything ready to run!

**Weather Radar Integration:**
- US radar data via Iowa State University (NEXRAD tiles)
- Flexible weather overlay with adapted leaflet-radar plugin
- Seamless integration into Leaflet map framework
- UI controls optimized for Rabbit R1 interface

**Hardware Integration (in preparation, if rabbit tech supports it):**
- ScrollWheel: Map zoom (planned)
- PTT button: Visual feedback on the map (planned)
- Touch: Moving & zooming the map (implemented)

**Technical Stack:**
- HTML5 (clean structure)
- Leaflet 1.9.4
- leaflet-radar (forked/adapted)
- Vanilla JS
- OpenStreetMap.de
- NEXRAD weather data

## Sources
**Data Sources:**
- US Radar Data © Iowa State University/IEM (https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913/{z}/{x}/{y}.png)
- Map tiles © OpenStreetMap contributors
- Leaflet mapping library
- leaflet-radar plugin (forked/adapted for this project)
- All icons and UI adaptations © atomlabor.de

---
**Special Thanks:** We extend our gratitude to the Iowa State University and their Iowa Environmental Mesonet for providing comprehensive weather radar data that makes this enhanced mapping experience possible.

Developed with ❤️ for the Rabbit R1 community
