var data = {
  places: [
    {
    name: 'Kauffman Center for the Performing Arts',
    Lat: 39.094114,
    Lng: -94.587513,
    apiInfo: ''
    },
    {
    name: 'Sprint Center',
    Lat: 39.098403,
    Lng: -94.580485,
    apiInfo: ''
    },
    {
    name: 'KC Live!',
    Lat: 39.098036,
    Lng: -94.581644,
    apiInfo: ''
    },
    {
    name: 'Bartle Hall',
    Lat: 39.098611,
    Lng: -94.587105,
    apiInfo: ''
    },
    {
    name: 'Folly Theater',
    Lat: 39.100426,
    Lng: -94.587212,
    apiInfo: ''
    },
    {
    name: 'Municipal Auditorium',
    Lat: 39.098095,
    Lng: -94.586407,
    apiInfo: ''
    },
    {
    name: 'The Midland',
    Lat: 39.099069,
    Lng: -94.583704,
    apiInfo: ''
    },
    {
    name: 'Kansas City Marriott',
    Lat: 39.101159,
    Lng: -94.58628,
    apiInfo: ''
    },
    {
    name: 'National World War I Museum at Liberty Memorial',
    Lat: 39.08134,
    Lng: -94.585937,
    apiInfo: ''
    },
    {
    name: 'Union Station',
    Lat: 39.085396,
    Lng: -94.585474,
    apiInfo: ''
    },
    {
    name: 'Crown Center',
    Lat: 39.083314,
    Lng: -94.582127,
    apiInfo: ''
    },
    {
    name: 'Kansas City Public Library',
    Lat: 39.116743,
    Lng: -94.583466,
    apiInfo: ''
    },
    {
    name: 'Nelson-Atkins Museum of Art',
    Lat: 39.045161,
    Lng: -94.580914,
    apiInfo: ''
    },
    {
    name: 'Uptown Theater',
    Lat: 39.061349,
    Lng: -94.590645,
    apiInfo: ''
    }
  ]
};

var Place = function (info) {
  this.name = ko.observable(info.name);
  this.Lat = ko.observable(info.Lat);
  this.Lng = ko.observable(info.Lng);
};

function ViewModel () {
  var self = this;

  self.places = ko.observableArray([]);
  self.names = ko.observableArray([]);

  data.places.forEach(function(info) {
    self.places.push( new Place(info));
  })

  data.places.forEach(function(info) {
    self.names.push( info.name);
  })

  initialize = function () {
    var kc = new google.maps.LatLng(39.097279,-94.585722);
    var mapOptions = {
      center: kc,
      zoom: 15
    };
    var map = new google.maps.Map(
      document.getElementById('map-canvas'), mapOptions);
    var pLen = data.places.length;
    for (i = 0; i < pLen; i++) {
      var marker = new google.maps.Marker({
          position: new google.maps.LatLng(data.places[i].Lat, data.places[i].Lng),
          map: map,
          title: data.places[i].name
      });

      google.maps.event.addListener(marker, 'click', function() {
        console.log(marker.getPosition());
        yelpRequest();
      });
    }

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

  viewChanger = function () {
    $('#pano').css('display', 'block');
    $('#info').css('display', 'none');
  }

  infoChanger = function () {
    $('#info').css('display', 'block');
    $('#pano').css('display', 'none');
  }

  $(function() {
    $( "#search" ).autocomplete({
      //appendTo: ".place-list",
      source: self.names(),
      response: function( event, ui ) {
        console.log("serach bar thing function thing bla bla bla");
      }
    });
  })

  /*
  $.getJSON('https://api.foursquare.com/v2/venues/4fe9d9bea17c0739a860b879/photos?&client_id=IISH2ZQK5FLY3F4GM0P4SUQN4EXQV5ZENQMBSD1POZ0AABOO&client_secret=OKCZBXIZOLZI4E1M55VIOSD2CL3UH1YJAMDPEXWR1FFLXNDZ&v=20150305', function (response) {
    $('#info').attr('src', response.response.photos.items[0].prefix.slice(0,-1) + response.response.photos.items[0].suffix);
    console.log(response.response.photos.items[0].prefix.slice(0,-1) + response.response.photos.items[0].suffix);
  })
  */

  google.maps.event.addDomListener(window, 'load', initialize);
}
ko.applyBindings(new ViewModel());


//&client_id=IISH2ZQK5FLY3F4GM0P4SUQN4EXQV5ZENQMBSD1POZ0AABOO&client_secret=OKCZBXIZOLZI4E1M55VIOSD2CL3UH1YJAMDPEXWR1FFLXNDZ&v=20150305'