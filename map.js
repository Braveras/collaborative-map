document.addEventListener('DOMContentLoaded', function() {
    // Definimos una única extensión para el nivel de zoom más grande
    const extent = [0, 0, 24064, 24064]; // Extensión única para el zoom máximo

    const tileSize = 512;

    // Número de tiles por nivel de zoom
    const tileCounts = [
        { width: 8, height: 8 },   // Zoom level 0
        { width: 17, height: 17 }, // Zoom level 1
        { width: 34, height: 34 }  // Zoom level 2
    ];

    const map = L.map('map', {
        crs: L.CRS.Simple,
        minZoom: 1,
        maxZoom: 2,
        zoom: 1,
        center: [-2000, 2000], // Centro inicial en rasterCoords
        attributionControl: false
    });

    L.TileLayer.CustomTiles = L.TileLayer.extend({
        getTileUrl: function(coords) {
            const z = coords.z;
            const x = coords.x;
            const y = this.flipY(coords.y, z);
            return `organized-tiles/${z}/${x}_${y}.png`;
        },
        
        flipY: function(y, z) {
            const maxTilesY = tileCounts[z].height - 1; // Usamos la cantidad correcta de tiles
            return maxTilesY - y;
        },

        getTileSize: function() {
            return L.point(tileSize, tileSize);
        }
    });

    L.tileLayer.customTiles = function() {
        return new L.TileLayer.CustomTiles({
            bounds: L.latLngBounds(
                map.unproject([extent[0], extent[3]], 0), // Esquina suroeste
                map.unproject([extent[2], extent[1]], 0)  // Esquina noreste
            )
        });
    };

    L.tileLayer.customTiles().addTo(map);

    var markers = [];
    var tempMarker = null;

    map.on('click', function(e) {
        if (tempMarker) {
            map.removeLayer(tempMarker);
        }
        
        tempMarker = L.marker(e.latlng).addTo(map);
        
        var popupContent = `
            <input type="text" id="markerText" placeholder="Texto del marcador">
            <select id="markerColor">
                <option value="red">Rojo</option>
                <option value="blue">Azul</option>
                <option value="green">Verde</option>
            </select>
            <button onclick="saveMarker()">Guardar</button>
        `;
        
        tempMarker.bindPopup(popupContent).openPopup();
    });

    window.saveMarker = function() {
        var text = document.getElementById('markerText').value;
        var color = document.getElementById('markerColor').value;

        var iconUrl = `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`;
        
        // Obtener las coordenadas del marcador en píxeles (rasterCoords)
        var markerCoords = map.latLngToContainerPoint(tempMarker.getLatLng());
        
        // Guardar el marcador con sus coordenadas y propiedades
        var markerData = {
            x: markerCoords.x,
            y: markerCoords.y,
            text: text,
            color: color
        };
        
        markers.push(markerData);

        // Crear y agregar el marcador al mapa usando las coordenadas originales
        var markerIcon = new L.Icon({
            iconUrl: iconUrl,
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });

        var marker = L.marker(tempMarker.getLatLng(), { icon: markerIcon }).addTo(map);
        marker.bindPopup(text);

        map.removeLayer(tempMarker);
        tempMarker = null;

        saveMarkersToStorage();
    };

    function saveMarkersToStorage() {
        localStorage.setItem('mapMarkers', JSON.stringify(markers));
    }

    function loadMarkersFromStorage() {
        var storedMarkers = JSON.parse(localStorage.getItem('mapMarkers')) || [];
        
        storedMarkers.forEach(function(markerData) {
            var iconUrl = `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${markerData.color}.png`;
            
            // Crear y agregar el marcador usando las coordenadas almacenadas (en píxeles)
            var markerIcon = new L.Icon({
                iconUrl: iconUrl,
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });
            
            var latLng = map.containerPointToLatLng([markerData.x, markerData.y]);
            
            var marker = L.marker(latLng, { icon: markerIcon }).addTo(map);
            marker.bindPopup(markerData.text);
        });
    }

    loadMarkersFromStorage();
});
