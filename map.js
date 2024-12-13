document.addEventListener('DOMContentLoaded', function() {
    var map = L.map('map', {
        crs: L.CRS.Simple,
        minZoom: 0,
        maxZoom: 3
    });

    var bounds = [[0, 0], [2048, 2048]];
    var image = L.imageOverlay('overlay/border.svg', bounds).addTo(map);
    map.fitBounds(bounds);

    L.tileLayer('organized-tiles/3_{y}_{x}.png', {
        minZoom: 0,
        maxZoom: 3,
        tileSize: 256,
        noWrap: true,
        tms: true,
        bounds: bounds
    }).addTo(map);
});
