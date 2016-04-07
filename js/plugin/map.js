function initMap(id) {
    let mapboxId = 'castafiore.k59m8f42',
        mapboxUrl = 'http://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png';

    let map = L.map(id, {center:[30.664789, 104.072941], zoom: 10, zoomControl: false});
    L.tileLayer(mapboxUrl, {id: mapboxId}).addTo(map);
    return map;
}

export default initMap;