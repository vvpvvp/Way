import L from "leaflet";

let icons = {
    'blue': L.icon({
        iconUrl: 'images/markers-blue.png', 
        iconSize: [32, 41],
        iconAnchor: [17,40],
        popupAnchor: [16,2]
    })
}
function initMap(id) {
    let mapboxId = 'castafiore.k59m8f42',
        mapboxUrl = 'http://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png';

    let map = L.map(id, {center:[30.664789, 104.072941], zoom: 10, zoomControl: false});
    L.tileLayer(mapboxUrl, {id: mapboxId}).addTo(map);

    $('#mapContainer').append('<div id="floatTip"></div>')
    return map;
}

function addMarker(map, style, title, coord) {
    return L.marker(coord, {icon: icons[style], title: title}).addTo(map);
}
         
function drawPolyline(map, trip, inProgress) {
    inProgress = !!inProgress;

    let polyline, polyline2, points = [], point, title;
    let startEnd = [trip.start, trip.end], 
        coords = trip['coords'];
                
    for (var i = coords.length - 1; i >= 0; i--) {
        point = new L.LatLng(coords[i][1], coords[i][0]);
        points.push(point);

        if(i == 0 || i == coords.length - 1)  {
            title = (i === 0 ? startEnd[0] : startEnd[1]);
            addMarker(map, 'blue', title, [coords[i][1], coords[i][0]]);
        }
    }
    polyline = L.polyline(points, {
        color: 'grey',
        weight: 3,
        opacity: 0.5,
        smoothFactor: 1
    }).addTo(map);

    if(inProgress) {
        console.log(JSON.stringify(points.slice(0, trip.index)));
        polyline2 = L.polyline(points.slice(0, trip.index), {
            color: '#83D2E1',
            weight: 3,
            opacity: 1,
            smoothFactor: 1
        }).addTo(map);
    };

    return polyline;
}



export {initMap, drawPolyline};
