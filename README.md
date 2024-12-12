<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Corepunk Map</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
    <style>
        #map { height: 100vh; width: 100%; }
    </style>
</head>
<body>
    <div id="map"></div>
    <script>
        var map = L.map('map', {
            crs: L.CRS.Simple,
            minZoom: 0,
            maxZoom: 3
        });

        var bounds = [[0,0], [8192,8192]];
        //var image = L.imageOverlay('organized-tiles/3_0_0.png', bounds).addTo(map);

        map.fitBounds(bounds);

        L.tileLayer('organized-tiles/3_{y}_{x}.png', {
            minZoom: 0,
            maxZoom: 3,
            tileSize: 1024,
            noWrap: true,
            bounds: bounds,
            tms: true
        }).addTo(map);
    </script>
</body>
</html>