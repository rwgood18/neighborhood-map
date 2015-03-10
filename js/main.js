var data = {
  places: [
    {name: 'Kauffman Center for the Performing Arts',
    LatLng: '39.094114,-94.587513',
    apiInfo: ''},
    {name: 'Sprint Center'}
  ]
}



function ViewModel () {

  function initialize() {
    var kc = new google.maps.LatLng(39.097279,-94.585722);
    var mapOptions = {
      center: kc,
      zoom: 16
    };
    var map = new google.maps.Map(
        document.getElementById('map-canvas'), mapOptions);

    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(39.094114,-94.587513),
        map: map,
        title: 'Hello World!'
    });

    var panoramaOptions = {ko.applyBindings(new ViewModel());
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
}
ko.applyBindings(new ViewModel());