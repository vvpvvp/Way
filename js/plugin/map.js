import L from "leaflet";
class Marker {
    constructor(map, instance) {
        this.map = map;
        this.instance = instance;
    }    

    move(from, to, seconds, callback) {
        callback = callback || function() {};

        let _s, _to, isGo = (arguments && arguments.length == 1 &&  arguments[0] instanceof Array);

        _s = isGo ? 0 : seconds;
        _to = isGo ? arguments[0] : to;
        $(this.instance._icon).css({transition: (_s + 's')});
        this.instance.setLatLng(_to);
        callback.call(this);
    }
}

class Map {
    constructor(container){
        this.container = container;
        this.$container = $('#' + container);
        this.markers = {};
        this.icons = {
            'blue': L.icon({
                iconUrl: 'images/markers-blue.png', 
                iconSize: [16, 20],
                iconAnchor: [9, 20],
                popupAnchor: [16, 2]
            }),
            'orange': L.icon({
                iconUrl: 'images/markers-orange.png', 
                iconSize: [16, 20],
                iconAnchor: [9, 20],
                popupAnchor: [16, 2]
            })
        }
        this.instance = null;
        this.allowZoom = false,
        this.init();
    }

    init(){
        let mapboxId = 'yefei.jdc3fkbg',
        mapboxUrl = 'http://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png';

        this.instance = L.map(this.container, {
            center:[40.664789, 104.072941], 
            zoom: 5, 
            zoomControl: false, 
            touchZoom:this.allowZoom, 
            scrollWheelZoom:this.allowZoom,
            doubleClickZoom:this.allowZoom
        });

        L.tileLayer(mapboxUrl, {id: mapboxId}).addTo(this.instance);
        // this.$container.append('<div id="floatTip"></div>')
    }


    addMarker(options) {
        let coord = options['gps'];
        let style = options['style'] || 'blue';
        let title = options['title'] || '';
        let l_marker = L.marker(coord, {icon: this.icons[style], title: title}).addTo(this.instance);
        
        return  (new Marker(this.instance, l_marker));
    }

    drawPolyline(datas, style) {
        let polyline, points = [], point, title, i, lat, lng, options;


        for (i = 0; i <= datas.length - 1; i++) {
            lat = datas[i]['gps'][1];
            lng = datas[i]['gps'][0];
            
            point = new L.LatLng(lat, lng);
            points.push(point);

            if(datas[i]['location'] && datas[i]['location'].trim() != '')  {
                options = {'gps': [lat, lng], style: 'blue', title: datas[i]['location'].trim()};
                this.addMarker(options);
            }
        }

        polyline = L.polyline(points, {
            color: style,
            weight: 3,
            opacity: 1,
            smoothFactor: 1
        }).addTo(this.instance);

        return polyline;
    }

    focus(ele) {
        if(ele && typeof ele.getBounds === 'function') {
            let bounds =  ele.getBounds();
            // 1072 container width
            // 380 user info and gap with
            bounds._northEast.lng += (1072 / (1072 - 400) - 1) * (bounds._northEast.lng - bounds._southWest.lng);
            this.instance.fitBounds(bounds);
        }
    }
}

Map.GREY = '#888888';
Map.COLORFUL = '#5BE4CB';
Map.MARKER_ORANGE = 'orange';
Map.MARKER_BLUE = 'blue';

export default Map;
