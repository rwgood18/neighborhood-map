function initialize() {
  var kc = new google.maps.LatLng(39.097279,-94.585722);
  var mapOptions = {
    center: kc,
    zoom: 15
  };
  var map = new google.maps.Map(
      document.getElementById('map-canvas'), mapOptions);
  var panoramaOptions = {
    position: kc,
    pov: {
      heading: 34,
      pitch: 10
    }
  };
  var panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), panoramaOptions);
  map.setStreetView(panorama);
}

google.maps.event.addDomListener(window, 'load', initialize);






/*
var map;
var infowindow;

function initialize() {
  var kc = new google.maps.LatLng(39.097279,-94.585722);

  var request = {
    location: kc,
    radius: 500,
    types: ['establishment']
  };

  map = new google.maps.Map(document.getElementById('map-canvas'), {
    center: kc,
    zoom: 15,
  });

  infowindow = new google.maps.InfoWindow();
  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, callback);
}


google.maps.event.addDomListener(window, 'load', initialize);

==========================================================================
function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }
}

function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
}
*/