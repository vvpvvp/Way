import L from "leaflet";


class Map {
    constructor(container, providerName, datas, options){
        this.container = container;
        this.datas = datas;
        this.user_marker = options ? options.user_marker : false;
        this.polyline_animated = options ? options.polyline_animated : false;
        this.zoom = options ? options.zoom : false;
        this.plan_polyline = null;
        this.onway_polyline = null;
        this.timeout = null;
        this.vehicles = ['current', 'bicycle','bus', 'car', 'plane', 'ship', 'train'];
        this.icons = {
            'blue': L.icon({
                iconUrl: 'images/markers-blue.png', 
                iconSize: [14, 14],
                iconAnchor: [8, 8],
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
        this.d3trigger = false;
        this.allowZoom = this.zoom,
        this.svg = null;
        this.init(providerName);
    }
    
    transition(e, mapThis) {
        let that = this;
        console.log(this);
        this.transition()
            .duration(function(d){
                return Map.ANIMATED_DURATION;
            })
            .each("end", function (d) {
                $(mapThis.plan_polyline._path).attr('stroke-opacity', 1)
                $(mapThis.onway_polyline._path).attr('stroke-opacity', 1)
                d3.selectAll('.animatedPath').remove();
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


    initSpecialProvider(name) {
        let options = {
            center:[31.664789, 104.072941],
            zoom:5,
            zoomControl: this.allowZoom, 
            touchZoom:false, 
            scrollWheelZoom:false,
            doubleClickZoom:false
        };

        if(name === 'gaode') {
            let normalm = L.tileLayer.chinaProvider('GaoDe.Normal.Map',{maxZoom:18,minZoom:5});
            let normal = L.layerGroup([normalm]);
     
            options.layers = [normal];
            this.instance = L.map(this.container,options);
        }
        else if(name === 'mapbox') {
            let mapboxId = 'yefei.jdc3fkbg',
            mapboxUrl = 'http://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png';

            this.instance = L.map(this.container,options);
            L.tileLayer(mapboxUrl, {id: mapboxId}).addTo(this.instance);
   
        }
        else {
            throw new Error('Provider not defiend');
        }
    }

    init(provideName){

        this.initSpecialProvider(provideName);

        let width = $('.mapContainerDiv').width();
        let height = $('.mapContainerDiv').height();
        let gps, lng, lat;
        let _this = this;
        
        this.svg = d3.select(this.instance.getPanes().overlayPane).append("svg")
            .attr('width', width)
            .attr('height', height);


        this.plan_polyline = this.drawPolyline(this.datas.plan, Map.GREY);
        this.onway_polyline = this.drawPolyline(this.datas.onway, Map.COLORFUL);

        $(".leaflet-marker-icon").tooltipster();

        if(this.user_marker)  {
            gps = this.datas.onway[0]['gps'];
            lng = gps[0];
            lat = gps[1];
            this.marker = this.addMarker({gps: [lat, lng], style: this.vehicles[0]});
        }

        this.focus(this.plan_polyline);

        this.instance.on('moveend', function() {
            console.log('move end ');
            if(_this.polyline_animated && !_this.d3trigger) {
                _this.d3trigger = true;
                console.log('draw d3 line ing .....');
                // _this.drawD3Line(_this.datas.plan, Map.GREY);
                _this.drawD3Line(_this.datas.onway, Map.COLORFUL);
            }
        }) 
    }

    pack4Points(place) {
        let index = this.datas.onway.indexOf(place);
        let points = [place];
        let offset = 1;
        let roundNumber = 3;

        while(points.length < roundNumber) {
            if(points.length < roundNumber && index + offset <= this.datas.onway.length -1)
                points.push(this.datas.onway[index + offset]);
            if(points.length < roundNumber && index - offset >= 0)
                points.unshift(this.datas.onway[index - offset]);
            offset ++;
        }
        return points;
    }
    go(place) {
        let lng = place['gps'][0], lat = place['gps'][1];
        this.marker.setLatLng([lat,lng]);
    }

    move(index, duration, callback) {
        callback = callback || function() {};

        let place = this.datas.onway[index];
        let traffic = place['traffic'];

        // console.log(place['traffic']);

        if(!this.user_marker) return;
        if(this.timeout) return;

        
        let places = this.pack4Points(place);
        let points = [];
        let l_lng, l_lat;
        let l_duration, l_destination;
        let _this = this;

        for (let i = 0; i < places.length; i++) {
            l_lng = places[i]['gps'][0];
            l_lat = places[i]['gps'][1];
            points.push([l_lat, l_lng]);
        }

        if(arguments && arguments.length == 1 &&  arguments[0] instanceof Array) {
            l_duration = 0;
            l_destination = arguments[0];
        }
        else {
            l_lng = place['gps'][0], l_lat = place['gps'][1]; 
            l_duration = duration / 1000;
            l_destination = [l_lat, l_lng];
        }

        setTimeout(function() {
            let len = _this.vehicles.length;
            let index = 1+ Math.floor(parseInt(Math.random() * (len - 1)));
            let vehicle = _this.vehicles[index];
            $(_this.marker._icon).attr('src', 'images/icons/' + vehicle + '@2x.png');
            $(_this.marker._icon).css({transition: (l_duration + 's')});
            _this.marker.setLatLng(l_destination);
        }, 0);

        _this.timeout = setTimeout(function() {
            clearTimeout(_this.timeout);
            _this.timeout = null;
            $(_this.marker._icon).css({transition: '0s'});
            $(_this.marker._icon).attr('src', 'images/icons/current@2x.png');
            if(_this.zoom)
                _this.instance.fitBounds(points);
            callback.call(_this);
        }, duration);
    }    

    addMarker(options) {
        let coord = options['gps'];
        let style = options['style'] || 'blue';
        let title = options['title'] || '';
        let icon;

        if(this.icons[style]) // pre-defined icons
            icon = this.icons[style];
        else  // vehicles icons: car, plane, etc.
            icon = L.icon({
                iconUrl: 'images/icons/' + style +'@2x.png', 
                iconSize: [18, 18],
                iconAnchor: [10, 10],
                popupAnchor: [24, 2],
                className: 'user-icon'
            }); 

        return L.marker(coord, {icon: icon, title: title}).addTo(this.instance);
    }

    drawD3Line(datas, style) {

        let i, lat, lng, gps_list = [];

        for (i = 0; i <= datas.length - 1; i++) {
            lng = datas[i]['gps'][0];
            lat = datas[i]['gps'][1];
            gps_list.push([lng, lat]);
        }

        let geo_data = {
            "type": "FeatureCollection",
            "features": [
                {"type":"Feature","properties": {style: style},"geometry":{"type":"LineString","coordinates":gps_list}}
            ]
        };

        // var g = d3.select('svg');
        let trip = this.svg.selectAll('path' + parseInt(Math.random(1) * 10000))
            .data([geo_data])
            .enter().append("path")
            .attr('class','animatedPath')
            .attr("stroke", style)
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
        trip.call(this.transition, that);

    }

    drawPolyline(datas, style) {
        let polyline, points = [], point, title, i, lat, lng, _options;

        for (i = 0; i <= datas.length - 1; i++) {
            lng = datas[i]['gps'][0];
            lat = datas[i]['gps'][1];
            
            point = new L.LatLng(lat, lng);
            points.push(point);

            if(datas[i]['location'] && datas[i]['location'].trim() != '')  {
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


        polyline = L.polyline(points, {
            color: style,
            weight: 3,
            opacity: this.polyline_animated ? 0 : 1,
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

    zoomout() {
        this.instance.fitBounds(this.plan_polyline);
    }
}

Map.GREY = '#888888';
Map.COLORFUL = '#5BE4CB';
Map.MARKER_ORANGE = 'orange';
Map.MARKER_BLUE = 'blue';
Map.ANIMATED_DURATION = 2000;
Map.GAODE = 'gaode';
Map.MAPBOX = 'mapbox';

export default Map;
