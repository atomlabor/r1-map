L.Control.Radar = L.Control.extend({
    // Updated radar source - using direct tile layer instead of WMS
    NEXRAD_URL: 'https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913/{z}/{x}/{y}.png',
    isPaused: false,
    timeLayerIndex: 0,
    timeLayers: [],
    radarLayer: null, 
    options: {
        position: `topright`,
        opacity: 0.8,
        zIndex: 200,
        transitionMs: 750,
        playHTML: `►`,
        pauseHTML: `▐`,
    },
    onRemove: function () {
        L.DomUtil.remove(this.container);
    },
    onAdd: function (map) {
        this.map = map;
 
        this.container = L.DomUtil.create(`div`, "leaflet-radar");
        L.DomEvent.disableClickPropagation(this.container);
        L.DomEvent.on(this.container, `control_container`, function (e) {
            L.DomEvent.stopPropagation(e);
        });
        L.DomEvent.disableScrollPropagation(this.container);

        checkbox_div = L.DomUtil.create(
            `div`,
            `leaflet-radar-toggle`,
            this.container
        );
        this.checkbox = document.createElement(`input`);
        this.checkbox.id = `leaflet-radar-toggle`;
        this.checkbox.type = `checkbox`;
        this.checkbox.checked = false;
        this.checkbox.onclick = () => this.toggle();
        checkbox_div.appendChild(this.checkbox);
        let checkbox_label = document.createElement(`span`);
        checkbox_label.innerText = `us rain radar`;
        checkbox_div.appendChild(checkbox_label);
        
        
        this.timestamp_div = L.DomUtil.create(
            `div`,
            `leaflet-radar-timestamp`,
            this.container
        );
        this.setDisabled(true);
        this.isPaused = true;
        return this.container;
    },
    hideLayerByIndex: function (index) {
        this.timeLayers[index].tileLayer.setOpacity(0);
        this.timestamp_div.innerHTML = ``;
    },
    showLayerByIndex: function (index) {
        this.timeLayers[index].tileLayer.setOpacity(
            this.options.opacity
        );
        this.timestamp_div.innerHTML = this.timeLayers[index].timestamp;
    },
    setDisabled: function (disabled) {

        this.timestamp_div.innerText = ``;
    },
    toggle: function () {
        if (!this.checkbox.checked) {
            this.setDisabled(true);
            this.removeLayers();
            return;
        }
        this.setDisabled(false);
 
        this.createRadarLayer();
        

        
        this.timeLayerIndex = 0;
        this.isPaused = false;
        this.setTransitionTimer();
    },
    createRadarLayer: function() {
  
        this.removeLayers();
        
  
        this.radarLayer = L.tileLayer(this.NEXRAD_URL, {
            opacity: this.options.opacity,
            attribution: 'Weather radar © IEM, Iowa State University'
        });
        
      
        this.radarLayer.addTo(this.map);
        
  
        this.timeLayers = [{
            timestamp: 'live radar on',
            tileLayer: this.radarLayer
        }];
        
        console.log('Radar layer created with new tile source');
    },
    setTransitionTimer: function () {
        setTimeout(() => {
            if (this.isPaused) {
                return;
            }
            if (this.checkbox.checked && this.timeLayers.length > 0) {
                this.hideLayerByIndex(this.timeLayerIndex);
                this.incrementLayerIndex();
                this.showLayerByIndex(this.timeLayerIndex);
                
                // Removed slider value update
                
                this.setTransitionTimer();
            } else {
                this.setDisabled(true);
                this.removeLayers();
            }
        }, this.options.transitionMs);
    },
    incrementLayerIndex: function () {
        this.timeLayerIndex++;
        if (this.timeLayerIndex > this.timeLayers.length - 1) {
            this.timeLayerIndex = 0;
        }
    },
    addLayers: function () {
 
        if (this.radarLayer && !this.map.hasLayer(this.radarLayer)) {
            this.radarLayer.addTo(this.map);
        }
    },
    removeLayers: function () {
        if (this.radarLayer) {
            this.radarLayer.removeFrom(this.map);
            this.radarLayer = null;
        }
        this.timeLayers.forEach(timeLayer =>
            timeLayer.tileLayer.removeFrom(this.map)
        );
        this.timeLayers = [];
        this.timeLayerIndex = 0;
    },
    generateLayers: function () {
   
        let timeLayers = [];
        if (this.radarLayer) {
            timeLayers.push({
                timestamp: 'Live Radar',
                tileLayer: this.radarLayer
            });
        }
        return timeLayers;
    }
});
L.control.radar = function (options) {
    return new L.Control.Radar(options);
};
