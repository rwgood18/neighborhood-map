//collection of venues
var data = {
  places: [
    {
    name: 'Kauffman Center for the Performing Arts',
    Lat: 39.094114,
    Lng: -94.587513,
    vid: '4bc4e070abf4952177b4c593',
    show: false
    },
    {
    name: 'Sprint Center',
    Lat: 39.098403,
    Lng: -94.580485,
    vid: '4abb8024f964a520df8320e3',
    show: true
    },
    {
    name: 'KC Live!',
    Lat: 39.098036,
    Lng: -94.581644,
    vid: '4c34bf94a0ced13a83b0186e',
    show: true
    },
    {
    name: 'Bartle Hall',
    Lat: 39.098611,
    Lng: -94.587105,
    vid: '4c03d3c6f56c2d7fb1591d66',
    show: true
    },
    {
    name: 'Folly Theater',
    Lat: 39.100426,
    Lng: -94.587212,
    vid: '4ad4c01ff964a520eff120e3',
    show: true
    },
    {
    name: 'Municipal Auditorium',
    Lat: 39.098095,
    Lng: -94.586407,
    vid: '4ad4c01ff964a520f2f120e3',
    show: true
    },
    {
    name: 'The Midland',
    Lat: 39.099069,
    Lng: -94.583704,
    vid: '4ad4c01ff964a520eef120e3',
    show: true
    },
    {
    name: 'Kansas City Marriott',
    Lat: 39.101159,
    Lng: -94.58628,
    vid: '4ada400af964a520872021e3',
    show: true
    },
    {
    name: 'National World War I Museum at Liberty Memorial',
    Lat: 39.08134,
    Lng: -94.585937,
    vid: '4f9c0ba5e4b04dd7353a754d',
    show: true
    },
    {
    name: 'Union Station',
    Lat: 39.085396,
    Lng: -94.585474,
    vid: '4f885099e4b0cec3aa2c928a',
    show: true
    },
    {
    name: 'Crown Center',
    Lat: 39.083314,
    Lng: -94.582127,
    vid: '4ad4c01ff964a520fff120e3',
    show: true
    },
    {
    name: 'Kansas City Public Library',
    Lat: 39.116743,
    Lng: -94.583466,
    vid: '4b13eb34f964a5207a9a23e3',
    show: true
    },
    {
    name: 'Nelson-Atkins Museum of Art',
    Lat: 39.045161,
    Lng: -94.580914,
    vid: '4ad4c01ef964a520aff120e3',
    show: true
    },
    {
    name: 'Uptown Theater',
    Lat: 39.061349,
    Lng: -94.590645,
    vid: '4ad4c01ff964a520f1f120e3',
    show: true
    }
  ]
};

//instantiate each venue as a Place
var Place = function (info) {
  this.name = ko.observable(info.name);
  this.Lat = ko.observable(info.Lat);
  this.Lng = ko.observable(info.Lng);
  this.vid = info.vid;
  this.show = ko.observable(true);
};

//ViewModel
function ViewModel () {
  var self = this;

  self.searchString = ko.observable();

  //initialize observable arrays
  self.places = ko.observableArray([]);
  self.buffer = ko.observableArray([]);
  self.names = ko.observableArray([]);

  //add content to observable arrays
  data.places.forEach(function(info) {
    self.places.push( new Place(info));
    self.buffer.push( new Place(info));
  })
  data.places.forEach(function(info) {
    self.names.push( info.name);
  })
  //initialize search bar with search instructions
  this.searchString = ko.observable("Search for a Venue");

  //create variable for number of places in data.places
  var pLen = data.places.length;

  


  //create the background map
  initialize = function () {
    var kc = new google.maps.LatLng(39.092279,-94.589722);
    var mapOptions = {
      center: kc,
      zoom: 15
    };
    var map = new google.maps.Map(
      document.getElementById('map-canvas'), mapOptions);
    
    mark = function() {
    //add marker for each location in data.places
      for (i = 0; i < pLen; i++) {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(data.places[i].Lat, data.places[i].Lng),
            map: map,
            title: self.buffer()[i].name()
        });

        //return a function that calls get foursquare() when user clicks a marker
        google.maps.event.addListener(marker, 'click', (function(icopy) {
          return function () {
            getFoursquare(data.places[icopy]);
          }
        })(i))
      }
    }
    mark();
    //create streetview element
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

  //change to streetview
  viewChanger = function () {
    $('#pano').css('display', 'block');
    $('#info').css('display', 'none');
  }

  //change to info view
  infoChanger = function () {
    $('#info').css('display', 'block');
    $('#pano').css('display', 'none');
  }

  //clear text in search bar when user clicks to make a new search
  clearText = function () {
    this.searchString("");
    $('#search').css('color', 'black');
  }

  filter = function () {
    for (var i=0; i<14; i++) {     
      if (self.places()[i].name().includes(self.searchString()) == false) {
          self.buffer()[i].show(false);
      } else {
        self.buffer()[i].show(true);
      }
    }
    self.initialize().mark();
  }
  
  /*
  //autocomplete functionality for search bar
  $(function() {
    $( "#search" ).autocomplete({
      appendTo: ".place-list",
      source: self.names(),

      //this function is called when the user selects a suggestion from the list
      select: function (event, ui) {
        var x = window.setTimeout(function(){
          search();
        }, 10);
      }
    });
  })
*/

  //search() is called when the user clicks the search button
  search = function () {
    var term = $('#search').val();
    for (var i=0; i<pLen; i++) {
      if (data.places[i].name == term) {
        getFoursquare(data.places[i]);
      }
    }
  }

  //called when user clicks on a venue from the venue list
  preGetFoursquare = function () {
    getFoursquare(this);
  }
  
  //makes 2 requests to the foursquare api
  getFoursquare = function (place) {
    infoChanger();

    //hide instructions
    $('#pre-click').css('display', 'none');

    //request for images
    $.ajax({ url: 'https://api.foursquare.com/v2/venues/' + place.vid + '/photos?&client_id=IISH2ZQK5FLY3F4GM0P4SUQN4EXQV5ZENQMBSD1POZ0AABOO&client_secret=OKCZBXIZOLZI4E1M55VIOSD2CL3UH1YJAMDPEXWR1FFLXNDZ&v=20150305', 
      success: function (response) {
        //if there are no available images
        if (response.response.photos.items.length == 0) {
          $('.img-error').text('There are no available images for this venue.');
          for (var i=0; i<3; i++) {
            $('#img' + i).attr('src', '');
          }
        } else {
          //set image sources to new image urls
          $('.img-error').text('');
          for (var i=0; i<3; i++) {
            $('#img' + i).attr('src', response.response.photos.items[i].prefix + "200x200" + response.response.photos.items[i].suffix);
          }
        }
        //If there are images, show the image divs. If not, don't.
        for (var i=0; i<3; i++) {
          if ($('#img' + i).attr('src') == '') {
            $('#img' + i).css('display', 'none');
          } else {
            $('#img' + i).css('display', 'block');
          }
        }
      },
      //If the request fails, show error message
      error: function (jqXHR, textStatus, errorThrown) {
        if (textStatus == 'error') {
          $('.img-error').text('Error: The requested images are unavailable.');
          $('.image').css('height', '0');
        }
      }
    })

    $.ajax({ url: 'https://api.foursquare.com/v2/venues/' + place.vid + '/tips?&client_id=IISH2ZQK5FLY3F4GM0P4SUQN4EXQV5ZENQMBSD1POZ0AABOO&client_secret=OKCZBXIZOLZI4E1M55VIOSD2CL3UH1YJAMDPEXWR1FFLXNDZ&v=20150305', 
      success: function (response) {
        //create an element for each tip and append it the the tip-list div
        $('.tip-list').empty();
        var len = response.response.tips.items.length;
        for (var i=0; i<len; i++) {
          var text = response.response.tips.items[i].text;
          $('.tip-list').append("<p>" + text + "</p>");
        }
      },
      //If the request fails, show error message
      error: function (jqXHR, textStatus, errorThrown) {
        if (textStatus == 'error') {
          $('.tip-error').text('Error: The requested data is unavailable.');
        }
      }
    })
  }

  //call initialize() when the page loads
  google.maps.event.addDomListener(window, 'load', initialize);
}

ko.applyBindings(new ViewModel());