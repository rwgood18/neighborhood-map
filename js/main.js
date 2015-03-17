var data = {
  places: [
    {
    name: 'Kauffman Center for the Performing Arts',
    Lat: 39.094114,
    Lng: -94.587513,
    vid: '4bc4e070abf4952177b4c593'
    },
    {
    name: 'Sprint Center',
    Lat: 39.098403,
    Lng: -94.580485,
    vid: '4abb8024f964a520df8320e3'
    },
    {
    name: 'KC Live!',
    Lat: 39.098036,
    Lng: -94.581644,
    vid: '4c34bf94a0ced13a83b0186e'
    },
    {
    name: 'Bartle Hall',
    Lat: 39.098611,
    Lng: -94.587105,
    vid: '4c03d3c6f56c2d7fb1591d66'
    },
    {
    name: 'Folly Theater',
    Lat: 39.100426,
    Lng: -94.587212,
    vid: '4ad4c01ff964a520eff120e3'
    },
    {
    name: 'Municipal Auditorium',
    Lat: 39.098095,
    Lng: -94.586407,
    vid: '4ad4c01ff964a520f2f120e3'
    },
    {
    name: 'The Midland',
    Lat: 39.099069,
    Lng: -94.583704,
    vid: '4ad4c01ff964a520eef120e3'
    },
    {
    name: 'Kansas City Marriott',
    Lat: 39.101159,
    Lng: -94.58628,
    vid: '4ada400af964a520872021e3'
    },
    {
    name: 'National World War I Museum at Liberty Memorial',
    Lat: 39.08134,
    Lng: -94.585937,
    vid: '4f9c0ba5e4b04dd7353a754d'
    },
    {
    name: 'Union Station',
    Lat: 39.085396,
    Lng: -94.585474,
    vid: '4f885099e4b0cec3aa2c928a'
    },
    {
    name: 'Crown Center',
    Lat: 39.083314,
    Lng: -94.582127,
    vid: '4ad4c01ff964a520fff120e3'
    },
    {
    name: 'Kansas City Public Library',
    Lat: 39.116743,
    Lng: -94.583466,
    vid: '4b13eb34f964a5207a9a23e3'
    },
    {
    name: 'Nelson-Atkins Museum of Art',
    Lat: 39.045161,
    Lng: -94.580914,
    vid: '4ad4c01ef964a520aff120e3'
    },
    {
    name: 'Uptown Theater',
    Lat: 39.061349,
    Lng: -94.590645,
    vid: '4ad4c01ff964a520f1f120e3'
    }
  ]
};

var Place = function (info) {
  this.name = ko.observable(info.name);
  this.Lat = ko.observable(info.Lat);
  this.Lng = ko.observable(info.Lng);
  this.vid = info.vid;
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
  var pLen = data.places.length;
  initialize = function () {
    var kc = new google.maps.LatLng(39.092279,-94.589722);
    var mapOptions = {
      center: kc,
      zoom: 15
    };
    var map = new google.maps.Map(
      document.getElementById('map-canvas'), mapOptions);
    
    for (i = 0; i < pLen; i++) {
      var marker = new google.maps.Marker({
          position: new google.maps.LatLng(data.places[i].Lat, data.places[i].Lng),
          map: map,
          title: data.places[i].name
      });

      google.maps.event.addListener(marker, 'click', (function(icopy) {
        return function () {
          getFoursquare(data.places[icopy]);
        }
      })(i))
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
        var x = window.setTimeout(function(){
          search();
        }, 10);
      }
    });
  })

  search = function () {
    var term = $('#search').val();
    for (var i=0; i<pLen; i++) {
      if (data.places[i].name == term) {
        getFoursquare(data.places[i]);
      }
    }
  }

  preGetFoursquare = function () {
    getFoursquare(this);
  }
 
  getFoursquare = function (place) {
    infoChanger();
    $.getJSON('https://api.foursquare.com/v2/venues/' + place.vid + '/photos?&client_id=IISH2ZQK5FLY3F4GM0P4SUQN4EXQV5ZENQMBSD1POZ0AABOO&client_secret=OKCZBXIZOLZI4E1M55VIOSD2CL3UH1YJAMDPEXWR1FFLXNDZ&v=20150305', function (response) {
      $('#img0').attr('src', response.response.photos.items[0].prefix + "200x200" + response.response.photos.items[0].suffix);
      $('#img1').attr('src', response.response.photos.items[1].prefix + "200x200" + response.response.photos.items[1].suffix);
      $('#img2').attr('src', response.response.photos.items[2].prefix + "200x200" + response.response.photos.items[2].suffix);
    })

    $.getJSON('https://api.foursquare.com/v2/venues/' + place.vid + '/tips?&client_id=IISH2ZQK5FLY3F4GM0P4SUQN4EXQV5ZENQMBSD1POZ0AABOO&client_secret=OKCZBXIZOLZI4E1M55VIOSD2CL3UH1YJAMDPEXWR1FFLXNDZ&v=20150305', function (response) {
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
