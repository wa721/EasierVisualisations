window.MakeMapOnLoad = function(mapFunction){
  google.maps.event.addDomListener(window, 'load', mapFunction)
}

window.HeatMap = function(inputData){
  var mapOptions = {
      center: new google.maps.LatLng(36.2021, 37.1343),
      zoom: 6,
      maxZoom:16,
      minZoom:6
    };

    window.map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);

    var locations = [];
    for (row in inputData){
      row = result[row]
      var lat = row['lat'];
      var lng = row['lng'];
      locations.push(new google.maps.LatLng(lat,lng));
    }

    heatmap = new google.maps.visualization.HeatmapLayer({
      data: locations,
      map: map
    });
}

window.changeGradient = function() {
    var gradient = [
      'rgba(0, 255, 255, 0)',
      'rgba(0, 255, 255, 1)',
      'rgba(0, 191, 255, 1)',
      'rgba(0, 127, 255, 1)',
      'rgba(0, 63, 255, 1)',
      'rgba(0, 0, 255, 1)',
      'rgba(0, 0, 223, 1)',
      'rgba(0, 0, 191, 1)',
      'rgba(0, 0, 159, 1)',
      'rgba(0, 0, 127, 1)',
      'rgba(63, 0, 91, 1)',
      'rgba(127, 0, 63, 1)',
      'rgba(191, 0, 31, 1)',
      'rgba(255, 0, 0, 1)'
    ]
    heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
}

window.changeRadius = function() {
      heatmap.set('radius', heatmap.get('radius') ? null : 20);
}

window.changeOpacity = function() {
      heatmap.set('opacity', heatmap.get('opacity') ? null : 0.2);
}

window.toggleHeatmap = function() {
      heatmap.setMap(heatmap.getMap() ? null : map);
}
