document.addEventListener('DOMContentLoaded', function() {
        const extents = [
            [0, 0, 6656, 6656],   // Zoom level 0
            [0, 0, 12288, 12288], // Zoom level 1
            [0, 0, 24064, 24064]  // Zoom level 2
        ];

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

        // Ajustar la vista inicial
        const initialExtent = extents[0];
        const southWest = map.unproject([initialExtent[0], initialExtent[3]], 0);
        const northEast = map.unproject([initialExtent[2], initialExtent[1]], 0);
        map.fitBounds(L.latLngBounds(southWest, northEast));
});
