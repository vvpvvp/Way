import L from "leaflet";
function initMap(id) {
    // let token = ;
    let accessToken = "sk.eyJ1IjoidnZwdnZwIiwiYSI6ImNpbXE5N3Z2ZDAwZml1d200ZXlsOWc1amcifQ.ZXyMGibdhjaHrAmLyfwhvg";
// Replace 'mapbox.streets' with your map id.
var mapboxTiles = L.tileLayer('https://api.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=' + accessToken);

var map = L.map(id)
    .addLayer(mapboxTiles,{
    zoomwheel:false
})
    .setView([42.3610, -71.0587], 0);


    // let mapboxId = 'castafiore.k59m8f42',
    //     mapboxUrl = 'http://{s}.tiles.mapbox.com/v2/{id}/{z}/{x}/{y}.png';

    // let map = L.map(id, {center:[30.664789, 104.072941], zoom: 10, zoomControl: false});
    // L.tileLayer(mapboxUrl, {id: mapboxId}).addTo(map);
    return map;
}
         
function drawPolyline(map, coords) {
    let polyline, points = [],
        point;
    for (var i = coords.length - 1; i >= 0; i--) {
        point = new L.LatLng(coords[i][1], coords[i][0]);
        console.log(coords[i][0] + ',' + coords[i][1]);
        points.push(point);
    }
    polyline = L.polyline(points, {
        color: 'red',
        weight: 3,
        opacity: 0.5,
        smoothFactor: 1
    }).addTo(map);

    return polyline;
}

export {initMap, drawPolyline};