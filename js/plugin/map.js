import L from "leaflet";

class Map {
    constructor(container){
        this.container = container;
        this.$container = $('#' + container);
        this.icons = {
            'blue': L.icon({
                iconUrl: 'images/markers-blue.png', 
                iconSize: [32, 41],
                iconAnchor: [17,40],
                popupAnchor: [16,2]
            })
        }
        this.instance = null;
        this.init();
    }

    init(){
        let mapboxId = 'castafiore.k59m8f42',
        mapboxUrl = 'http://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png';

        this.instance = L.map(this.container, {
            center:[40.664789, 104.072941], 
            zoom: 10, 
            zoomControl: false, 
            touchZoom:false, 
            scrollWheelZoom:false,
            doubleClickZoom:false
        });

        L.tileLayer(mapboxUrl, {id: mapboxId}).addTo(this.instance);
        // this.$container.append('<div id="floatTip"></div>')
    }

    addMarker(style, title, coord) {
        return L.marker(coord, {icon: this.icons[style], title: title}).addTo(this.instance);
    }

    drawPolyline(datas, style) {
        let polyline, points = [], point, title, i, lat, lng;

        for (i = datas.length - 1; i >= 0; i--) {
            lat = datas[i]['gps'][1];
            lng = datas[i]['gps'][0];
            
            point = new L.LatLng(lat, lng);
            points.push(point);

            if(datas[i]['location'] && datas[i]['location'].trim() != '')  {
                this.addMarker('blue', datas[i]['location'].trim(), [lat, lng]);
            }
        }

        polyline = L.polyline(points, {
            color: style,
            weight: 3,
            opacity: 0.5,
            smoothFactor: 1
        }).addTo(this.instance);
            this.instance.fitBounds(polyline.getBounds());

        return polyline;
    }

    focus(ele) {
        if(ele && typeof ele.getBounds === 'function') {
            console.log(ele.getBounds());
            this.instance.fitBounds(ele.getBounds());
        }
    }
}

Map.GREY = 'grey';
Map.COLORFUL = 'blue';

export default Map;