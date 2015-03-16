var data = {
  places: [
    {
    name: 'Kauffman Center for the Performing Arts',
    Lat: 39.094114,
    Lng: -94.587513,
    id: '4bc4e070abf4952177b4c593'
    },
    {
    name: 'Sprint Center',
    Lat: 39.098403,
    Lng: -94.580485,
    id: '4abb8024f964a520df8320e3'
    },
    {
    name: 'KC Live!',
    Lat: 39.098036,
    Lng: -94.581644,
    id: '4c34bf94a0ced13a83b0186e'
    },
    {
    name: 'Bartle Hall',
    Lat: 39.098611,
    Lng: -94.587105,
    id: '4c03d3c6f56c2d7fb1591d66'
    },
    {
    name: 'Folly Theater',
    Lat: 39.100426,
    Lng: -94.587212,
    id: '4ad4c01ff964a520eff120e3'
    },
    {
    name: 'Municipal Auditorium',
    Lat: 39.098095,
    Lng: -94.586407,
    id: '4ad4c01ff964a520f2f120e3'
    },
    {
    name: 'The Midland',
    Lat: 39.099069,
    Lng: -94.583704,
    apiInfo: '4ad4c01ff964a520eef120e3'
    },
    {
    name: 'Kansas City Marriott',
    Lat: 39.101159,
    Lng: -94.58628,
    id: '4ada400af964a520872021e3'
    },
    {
    name: 'National World War I Museum at Liberty Memorial',
    Lat: 39.08134,
    Lng: -94.585937,
    id: '4f9c0ba5e4b04dd7353a754d'
    },
    {
    name: 'Union Station',
    Lat: 39.085396,
    Lng: -94.585474,
    id: '4f885099e4b0cec3aa2c928a'
    },
    {
    name: 'Crown Center',
    Lat: 39.083314,
    Lng: -94.582127,
    id: '4ad4c01ff964a520fff120e3'
    },
    {
    name: 'Kansas City Public Library',
    Lat: 39.116743,
    Lng: -94.583466,
    id: '4b13eb34f964a5207a9a23e3'
    },
    {
    name: 'Nelson-Atkins Museum of Art',
    Lat: 39.045161,
    Lng: -94.580914,
    id: '4ad4c01ef964a520aff120e3'
    },
    {
    name: 'Uptown Theater',
    Lat: 39.061349,
    Lng: -94.590645,
    id: '4ad4c01ff964a520f1f120e3'
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
  self.buffer = ko.observableArray([]);
  self.names = ko.observableArray([]);

  data.places.forEach(function(info) {
    self.places.push( new Place(info));
    self.buffer.push( new Place(info));
  })

  data.places.forEach(function(info) {
    self.names.push( info.name);
  })

  this.searchString = ko.observable("Search for a Place");

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
        getFoursquare();
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

  clearText = function () {
    this.searchString("");
  }
  
  $(function() {
    $( "#search" ).autocomplete({
      appendTo: ".place-list",
      source: self.names(),
      response: function( event, ui ) {
      },
      select: function (event, ui) {
        getFoursquare();
      }
    });   
  })
 
  getFoursquare = function () {
    infoChanger();
    console.log("getFoursquare called");
    $.getJSON('https://api.foursquare.com/v2/venues/4fe9d9bea17c0739a860b879/photos?&client_id=IISH2ZQK5FLY3F4GM0P4SUQN4EXQV5ZENQMBSD1POZ0AABOO&client_secret=OKCZBXIZOLZI4E1M55VIOSD2CL3UH1YJAMDPEXWR1FFLXNDZ&v=20150305', function (response) {
      $('#img0').attr('src', response.response.photos.items[0].prefix + "200x200" + response.response.photos.items[0].suffix);
      $('#img1').attr('src', response.response.photos.items[1].prefix + "200x200" + response.response.photos.items[1].suffix);
      $('#img2').attr('src', response.response.photos.items[2].prefix + "200x200" + response.response.photos.items[2].suffix);
      //console.log(response.response.photos.items[0].prefix + "200x200" + response.response.photos.items[0].suffix);
    })

    $.getJSON('https://api.foursquare.com/v2/venues/4fe9d9bea17c0739a860b879/tips?&client_id=IISH2ZQK5FLY3F4GM0P4SUQN4EXQV5ZENQMBSD1POZ0AABOO&client_secret=OKCZBXIZOLZI4E1M55VIOSD2CL3UH1YJAMDPEXWR1FFLXNDZ&v=20150305', function (response) {
      console.log(response);
      $('#p0').text(response.response.tips.items[0].text);
      $('#p1').text(response.response.tips.items[1].text);
      $('#p2').text(response.response.tips.items[2].text);
      $('#p3').text(response.response.tips.items[3].text);
      $('#p4').text(response.response.tips.items[4].text);
    })
  }

  google.maps.event.addDomListener(window, 'load', initialize);
}

ko.applyBindings(new ViewModel());

//&client_id=IISH2ZQK5FLY3F4GM0P4SUQN4EXQV5ZENQMBSD1POZ0AABOO&client_secret=OKCZBXIZOLZI4E1M55VIOSD2CL3UH1YJAMDPEXWR1FFLXNDZ&v=20150305'
