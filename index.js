import template from "./js/template";
import Handlebars from "handlebars/dist/handlebars";
import L from "leaflet";
require('./css/index.css');

let temp = Handlebars.compile(template.userInfo);
console.log(temp({a:"测试"}));
console.log(1);


let map, ways;

function initMap() {
    let mapboxId = 'castafiore.k59m8f42',
        mapboxUrl = 'http://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png';

    map = L.map('mapContainer', {center:[30.664789, 104.072941], zoom: 10, zoomControl: false});
    L.tileLayer(mapboxUrl, {id: mapboxId}).addTo(map);
}

function bindEvents() {
  $(document).on('click', '.way', function() {
    $(event.target).siblings().removeClass('active');
    $(event.target).addClass('active');
    map.setView(coords[$(event.target).html()].split(','));
  })
}

function drawWay(coords) {
    let polyline, points = [], point;
    polyline = L.polyline(coords, {color: 'red'}).addTo(map);
    map.fitBounds(polyline.getBounds());
}

function drawMultipleWays(datas) {
    for (let i = datas.length - 1; i >= 0; i--) {
        let history = datas[i]['history'];
        let recent = history[history.length - 1];
        let coords = recent['coords'];
        drawWay(coords);
        alert(coords.length);

        return;
    }
}

bindEvents();
initMap();

$.get('data/ways.json', function(res) {
    // drawMultipleWays(res);
});



// var pointA = new L.LatLng(28.635308, 77.22496);
// var pointB = new L.LatLng(28.984461, 77.70641);
// var pointList = [pointA, pointB];

// var firstpolyline = new L.Polyline(pointList, {
// color: 'red',
// weight: 3,
// opacity: 0.5,
// smoothFactor: 1

// });
// firstpolyline.addTo(map);