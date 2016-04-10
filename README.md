# Way
On The Way demo


### Map(id, datas, options)

- id: container id
- datas:  sample -> {'plan':[{}],'onway': [{}] }
- options: sample -> {user_marker: boolean, polyline_animated: boolean, zoom: boolean}
    - user_marker: default false, would add a marker for the user position
    - polyline_animated: default false, would draw the both polyline polyline_animated
    - zoom: default false, the move would zoom on differrent area

NOTICE: if wanna to use zoom feature, make sure the object in onway has 'day' attribute

##### examples

```
let map = new Map(id, datas);
let map = new Map(id, datas, {user_marker: true, polyline_animated: true, zoom: true});
```

### map.move/map.go 

```
let map = new Map(id, content);
let place = content.onway[5]; // lat, lng

setTimeout(function() {
    map.move(place, 1000, function(){console.log('moving done')});
    // map.go(place);
}, 3000);
```
