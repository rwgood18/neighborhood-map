function initialize() {
  var kc = new google.maps.LatLng(39.097279,-94.585722);
  var mapOptions = {
    center: kc,
    zoom: 16
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