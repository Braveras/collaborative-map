document.addEventListener('DOMContentLoaded', function() {
    const map = L.map('map').setView([0, 0], 3);

    L.tileLayer('organized-tiles/{z}_{x}_{y}.png', {
        minZoom: 3,
        maxZoom: 3,
        tileSize: 256,
        attribution: 'Custom Map'
    }).addTo(map);

    // Set map bounds
    const southWest = map.unproject([0, 2048], map.getMaxZoom());
    const northEast = map.unproject([2048, 0], map.getMaxZoom());
    const bounds = L.latLngBounds(southWest, northEast);

    map.setMaxBounds(bounds);
    map.fitBounds(bounds);
});

