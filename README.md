# Way
On The Way demo



### Move API use examples

```
let gps_from = [31.353617, 118.398167], gps_to = [31.891577, 117.32411];
let marker = map.addMarker({gps: gps_from, style: Map.MARKER_ORANGE});
let duration = 10000; // millionseconds

// move the marker to specified coordination
marker.move(gps_to, duration, function(){console.log('moving done')});

// move the marker directly
marker.move(gps_to);
```

### Dynamic draw polyline exampes

```
// draw grey polyline
let drawPoly = map.drawPolyline(content.plan, Map.GREY); 

// draw colorful polyline
let drawPoly = map.drawPolyline(content.plan, Map.COLORFUL);

// draw polyline with animation: include delay and duration
let drawPoly = map.drawPolyline(content.plan, {duration: 1000, delay: 0, style: Map.GREY});
map.drawPolyline(content.plan, {duration: 1000, delay: 1200, style: Map.COLORFUL});
```
