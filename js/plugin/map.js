import L from "leaflet";
class Marker {
    constructor(map, instance) {
        this.map = map;
        this.instance = instance;
    }    

    move(to, duration, callback) {
        callback = callback || function() {};

        let _s, _to, isGo = (arguments && arguments.length == 1 &&  arguments[0] instanceof Array);
        let _this = this;
        _s = isGo ? 0 : duration / 1000;
        _to = isGo ? arguments[0] : to;
        $(this.instance._icon).css({transition: (_s + 's')});

        setTimeout(function() { // to prevent transition delay
            _this.instance.setLatLng(_to);
        }, 0);

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
        this.d3path = null;
        this.allowZoom = false,
        this.svg = null;
        this.init();

    }
    
    transition(e) {
        let that = this;
        this.transition()
            .duration(function(d){
                return parseInt(d.features[0]['properties']['duration'] || 1000);
            })
            // TODO
            // .delay(function(d) { 
            //     console.log(parseInt(d.features[0]['properties']['delay'] || 1));
            //     return parseInt(d.features[0]['properties']['delay'] || 1);
            // })
            .attrTween("stroke-dasharray", function(d) {
                let l = that.node().getTotalLength();
                let i = d3.interpolateString("0," + l, l + "," + l);

                return function (t) {
                    return i(t);
                }
            })
    }

    init(){
        let mapboxId = 'yefei.jdc3fkbg',
        mapboxUrl = 'http://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png';

        this.instance = L.map(this.container, {
            center:[31.664789, 104.072941], 
            zoom: 5, 
            zoomControl: false, 
            touchZoom:this.allowZoom, 
            scrollWheelZoom:this.allowZoom,
            doubleClickZoom:this.allowZoom
        });

        L.tileLayer(mapboxUrl, {id: mapboxId}).addTo(this.instance);

        let width = $('.mapContainer').width();
        let height = $('.mapContainer').height();

        this.svg = d3.select(this.instance.getPanes().overlayPane).append("svg")
            .attr('width', width)
            .attr('height', height);
    }


    addMarker(options) {
        let coord = options['gps'];
        let style = options['style'] || 'blue';
        let title = options['title'] || '';
        let l_marker = L.marker(coord, {icon: this.icons[style], title: title}).addTo(this.instance);
        
        return  (new Marker(this.instance, l_marker));
    }

    drawD3Line(options, gps_list) {
        let geo_data = {
            "type": "FeatureCollection",
            "features": [
                {"type":"Feature","properties": options,"geometry":{"type":"LineString","coordinates":gps_list}}
            ]
        };

        // var g = d3.select('svg');
        let trip = this.svg.selectAll('path' + parseInt(Math.random(1) * 10000))
            .data([geo_data])
            .enter().append("path")
            .attr("stroke", options['style'])
            .attr("fill", "transparent")
            .attr("stroke-width", 3)
            .attr("opacity", 1);

        let that = this;

        let projectPoint = function(x, y) {
            let point = that.instance.latLngToLayerPoint(new L.LatLng(y, x));
                this.stream.point(point.x, point.y);
        }

        let d3path = d3.geo.path().projection(d3.geo.transform({
            point: projectPoint
        }));

        // TODO 
        // let transition = function(e) {
        //     var _this = this;
        //     this.transition()
        //         .delay(function(d) {
        //             return 10000;
        //         })
        //         .duration(function(d){
        //             var duration = 10000;// d.properties.duration / 60 / timeFactor * 1000;
        //             return duration;
        //         })
        //         .attrTween("stroke-dasharray", function(d) {
        //             var l = _this.node().getTotalLength();
        //             var i = d3.interpolateString("0," + l, l + "," + l);

        //             return function (t) {
        //                 return i(t);
        //             }
        //         })
        // }

        trip.attr("d", d3path);
        trip.call(this.transition);

    }

    drawPolyline(datas, options) {
        let polyline, points = [], point, title, i, lat, lng, _options, gps_list = [];
        let l_opacity = 1, l_style = options;

        for (i = 0; i <= datas.length - 1; i++) {
            lat = datas[i]['gps'][1];
            lng = datas[i]['gps'][0];
            
            point = new L.LatLng(lat, lng);
            points.push(point);

            if(datas[i]['location'] && datas[i]['location'].trim() != '')  {
                gps_list.push([lng, lat]);
                _options = {'gps': [lat, lng], style: 'blue', title: datas[i]['location'].trim()};
                this.addMarker(_options);
            }
        }

        /*
         If we pass a option object whose structure like -> {duration: style: delay: }, then
            - draw the d3 animated line
            - draw leaflet polyline with opacity == 0
         Otherwise
            - draw the leaflet polyline with opacity == 1
        */

        if(options instanceof Object) {
            l_opacity = 0;
            l_style = options['style'];

            let that = this;

            setTimeout(function() {
                that.drawD3Line(options, gps_list);
            }, options.delay);
        }

        polyline = L.polyline(points, {
            color: l_style,
            weight: 3,
            opacity: l_opacity,
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
