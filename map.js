document.addEventListener('DOMContentLoaded', function() {
        const extents = [
            [0, 0, 6656, 6656],   // Zoom level 0
            [0, 0, 12288, 12288], // Zoom level 1
            [0, 0, 24064, 24064]  // Zoom level 2
        ];
		
		const extent = [0, 0, 24064, 24064]

        const tileSize = 512;

        const map = L.map('map', {
            crs: L.CRS.Simple,
            minZoom: 0,
            maxZoom: 2,
            zoom: 0,
            center: [3328, 3328],
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
                const maxTiles = Math.ceil(extents[z][3] / tileSize) - 1;
                return maxTiles - y;
            },

            getTileSize: function() {
                return L.point(tileSize, tileSize);
            }
        });

        L.tileLayer.customTiles = function() {
            return new L.TileLayer.CustomTiles();
        };

        L.tileLayer.customTiles().addTo(map);

        function updateMapBounds() {
            const zoom = map.getZoom();
            const extent = extents[zoom];
            const southWest = map.unproject([extent[0], extent[3]], zoom);
            const northEast = map.unproject([extent[2], extent[1]], zoom);
            map.setMaxBounds(L.latLngBounds(southWest, northEast));
        }

        map.on('zoomend', updateMapBounds);
        updateMapBounds();

        map.on('mousemove', function(e) {
            const point = map.project(e.latlng, map.getZoom());
            document.getElementById('coordinates').innerHTML = `X: ${Math.floor(point.x)}, Y: ${Math.floor(extents[map.getZoom()][3] - point.y)}`;
        });

        const initialExtent = extents[0];
        const southWest = map.unproject([initialExtent[0], initialExtent[3]], 0);
        const northEast = map.unproject([initialExtent[2], initialExtent[1]], 0);
        map.fitBounds(L.latLngBounds(southWest, northEast));
		
		
		
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
			
			var icon = new L.Icon({
				iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
				shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
				iconSize: [25, 41],
				iconAnchor: [12, 41],
				popupAnchor: [1, -34],
				shadowSize: [41, 41]
			});
			
			var marker = L.marker(tempMarker.getLatLng(), {icon: icon}).addTo(map);
			marker.bindPopup(text);
			markers.push({lat: marker.getLatLng().lat, lng: marker.getLatLng().lng, text: text, color: color});
			
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
				var icon = new L.Icon({
					iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${markerData.color}.png`,
					shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
					iconSize: [25, 41],
					iconAnchor: [12, 41],
					popupAnchor: [1, -34],
					shadowSize: [41, 41]
				});
				
				var marker = L.marker([markerData.lat, markerData.lng], {icon: icon}).addTo(map);
				marker.bindPopup(markerData.text);
			});
		}

		loadMarkersFromStorage();

});
