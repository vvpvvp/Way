import { initMap, drawPolyline } from './js/map';

let map, polyline;

function formatCoords(data) {
    var _coords = [];
    for (var i = data.length - 1; i >= 0; i--) {['gps']
        _coords.push(data[i]['gps']);
    }
    return _coords;
} 

$.get('data/data.json', function(res) {
    map = initMap('mapContainer');
    polyline = drawPolyline(map, formatCoords(res));
    map.fitBounds(polyline);
});
