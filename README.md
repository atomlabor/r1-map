# r1-map

**Rabbit R1 Creations App: Minimalistische Navigation mit Hardware-Integration für das Rabbit R1**

## Über das Projekt

r1-map ist eine schlanke Navigations-App, die speziell für das Rabbit R1-Gerät entwickelt wurde. Die App bietet eine minimalistische Benutzeroberfläche mit vollständiger Hardware-Integration und fokussiert sich auf die essentiellen Navigationsfunktionen.

## Hauptfunktionen

- 🗺️ **Offline-Kartendarstellung** basierend auf OpenStreetMap-Daten
- 🖱️ **ScrollWheel Zoom** - Karte mit dem R1 ScrollWheel zoomen
- 🎙️ **PTT-Feedback** - Push-To-Talk Taste für visuelle Rückmeldung
- 📍 **Automatische Standortbestimmung** beim App-Start
- 👆 **Touch-Interaktion** für intuitive Kartennavigation
- 💾 **Offline-Funktionalität** für unterbrechungsfreie Navigation
- 🎯 **Minimalistisches Design** optimiert für das R1-Display

## Hardware-Features

### Rabbit R1 Integration
- **ScrollWheel**: Zoome die Karte durch Scrollen (map.setZoom)
- **PTT-Taste**: Drücke die Push-To-Talk Taste für visuellen Feedback (Toast + Marker)
- **Touch-Display**: Vollständige Touch-Unterstützung für Pinch-to-Zoom und Drag
- **240x282 Display**: Optimiert für die nativen R1-Displayabmessungen

## Technische Basis

**Frontend-Technologien:**
- HTML5 für strukturierte Markup
- CSS3 für responsive Benutzeroberfläche
- Vanilla JavaScript für Hardware-Integration

**SDK und Bibliotheken:**
- [Rabbit R1 Creations SDK](https://rabbit.tech/creations) für Hardware-Integration
- [Leaflet Maps](https://leafletjs.com/) als Kartenbasis
- OpenStreetMap-Daten für Kartenmaterial

## Bedienung

### Minimalistisches Interface
- **Keine Suchfunktion** - Fokus auf reine Navigation
- **Kleiner Header** zeigt nur "r1 maps" an
- **Vollbild-Karte** nutzt den gesamten verfügbaren Bildschirm
- **Hardware-First** - Optimiert für R1-Eingabemethoden

### Hardware-Steuerung
1. **ScrollWheel**: Drehen zum Zoomen der Karte
2. **PTT-Taste**: Drücken für visuelles Feedback (Marker + Toast)
3. **Touch**: Berühren und Ziehen zum Bewegen der Karte
4. **Pinch-to-Zoom**: Zwei-Finger-Gesten für präzises Zoomen

## Entwicklungsstatus

✅ **Implementiert**
- Minimalistisches UI ohne Suchfunktion
- ScrollWheel Zoom-Integration
- PTT-Feedback mit Toast-Nachrichten
- Automatische Standortbestimmung
- Vollständige Touch-Unterstützung

### Technische Details
- **map.setZoom()** für präzise Zoom-Kontrolle via ScrollWheel
- **Toast-Benachrichtigungen** für PTT-Feedback
- **Temporäre Marker** zur visuellen Rückmeldung
- **Hardware-Detection** für R1-spezifische Features

## Inspiration

Dieses Projekt ist inspiriert von der [Flashlight-App](https://github.com/atomlabor/flashlight) und anderen erfolgreichen Rabbit R1 Creations, die zeigen, wie Hardware-Integration und minimalistisches Design zusammenwirken können.

## Beitragen

Wir begrüßen Beiträge zur Entwicklung von r1-map! Besonders interessant sind:
- Hardware-Integration Verbesserungen
- Performance-Optimierungen
- UX-Verbesserungen für kleine Displays

## Lizenz

MIT License - siehe [LICENSE](LICENSE) Datei für Details.

## Links

- [Rabbit Creations Platform](https://rabbit.tech/creations)
- [Leaflet Maps](https://leafletjs.com/)
- [OpenStreetMap](https://www.openstreetmap.org/)
- [Rabbit R1 Hardware](https://rabbit.tech/)

---

Entwickelt mit ❤️ für die Rabbit R1 Community
