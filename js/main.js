//collection of venues
var data = {
  places: [
    {
    name: 'Kauffman Center for the Performing Arts',
    Lat: 39.094114,
    Lng: -94.587513,
    vid: '4bc4e070abf4952177b4c593',
    show: true
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
  });
  data.places.forEach(function(info) {
    self.names.push( info.name);
  });

  //initialize search bar with search instructions
  self.searchString = ko.observable("Search for a Venue");

  //create variable for number of places in data.places
  var pLen = data.places.length;

  //declare map vairable
  var kcMap;
  
  //create a map class
  var Map = function() {
        
    this.kc = new google.maps.LatLng(39.092279,-94.589722);
    this.mapOptions = {
      center: this.kc,
      zoom: 14
    };
    this.map = new google.maps.Map(document.getElementById('map-canvas'), this.mapOptions);

    this.markers = [];

    this.mark = function() {
    //add marker for each location in self.buffer()
    var bLen = self.buffer().length;
      for (i = 0; i < pLen; i++) {
        var marker;
        if (self.buffer()[i].show() === true) {
          marker = new google.maps.Marker({
              position: new google.maps.LatLng(self.buffer()[i].Lat(), self.buffer()[i].Lng()),
              map: this.map,
              icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
              title: self.buffer()[i].name()
          });
        } else {continue;}
        this.markers.push(marker);

        //return a function that calls get foursquare() when user clicks a marker
        google.maps.event.addListener(marker, 'click', (function(iCopy, markersCopy) {
          return function () {
            getFoursquare(data.places[iCopy]);
            this.setAnimation(google.maps.Animation.DROP);
            //change marker color to green when its name is clicked
            for (var marker in markersCopy) {
              markersCopy[marker].setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
            }
            this.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
          };
        })(i, this.markers));
      }
    };
    this.mark();

    // Sets the map on all markers in the array.
    this.setAllMap = function (map) {
      for (var i = 0; i < this.markers.length; i++) {
        this.markers[i].setMap(map);
        
      }
    };

    // Removes the markers from the map, but keeps them in the array.
    this.clearMarkers = function() {
      this.setAllMap(null);
    };

    // Shows any markers currently in the array.
    this.showMarkers = function () {
      this.setAllMap(this.map);
    };

    // Deletes all markers in the array by removing references to them.
    this.deleteMarkers = function () {
      this.clearMarkers();
      this.markers = [];
    };

    //create streetview element
    this.panoramaOptions = {
      position: this.kc,
      pov: {
        heading: 34,
        pitch: 10
      }
    };
    //create panorama
    this.panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), this.panoramaOptions);
      this.map.setStreetView(this.panorama);
  };

  //change to streetview
  viewChanger = function () {
    $('#pano').css('display', 'block');
    $('#info').css('display', 'none');
  };

  //change to info view
  infoChanger = function () {
    $('.tips-h2').css('display', 'block');
    $('#info').css('display', 'block');
    $('#pano').css('display', 'none');
  };

  //clear text in search bar when user clicks to make a new search
  clearText = function () {
    this.searchString("");
    $('#search').css('color', 'black');
    filter();
  };

  filter = function () {
    if (event.keyCode == 13) {
      return;
    } else { 
      //Compare user text input to venue names. If they match, set "show" property to true.
      for (var i=0; i< pLen; i++) {     
        if (self.places()[i].name().toLowerCase().search(self.searchString().toLowerCase()) == -1) {
            self.buffer()[i].show(false);
        } else {
          self.buffer()[i].show(true);
        }
      }
      kcMap.deleteMarkers();
      kcMap.mark();
    }
  };
  
  //search() is called when the user clicks the search button
  search = function () {
    var loopSwitch = true;
    var len = self.buffer().length;  
    for (var i=0; i<len; i++) {
      //complete the search bar text with the first match in self.buffer()
      if (loopSwitch === true) {
        if (self.buffer()[i].show() === true) {
          self.searchString(self.buffer()[i].name());
          loopSwitch = false;
        } 
      }
    }
    //call getFoursquare() and changeColor() on the place whose name matches the text in the search bar
    for (var place in self.buffer()) {  
      if (self.buffer()[place].name() == self.searchString()) {
        getFoursquare(self.buffer()[place]);
        changeColor.call(self.buffer()[place]);
      }
    } 
    infoChanger();
  };
  
  //called when user clicks on a venue from the venue list
  preGetFoursquare = function () {
    getFoursquare(this);
    changeColor.call(this);
  };

  changeColor = function () {
    //change marker color to green when its corresponding name is clicked and change the others to red
    for (var marker in kcMap.markers) {
      if (this.name() == kcMap.markers[marker].title) {
        kcMap.markers[marker].setAnimation(google.maps.Animation.DROP);
        kcMap.markers[marker].setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
      } else {
        kcMap.markers[marker].setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
      }
    }
  };
  
  //makes 2 requests to the foursquare api
  getFoursquare = function (place) {
    infoChanger();
    //hide instructions
    $('#pre-click').css('display', 'none');
    //request for images
    $.ajax({ url: 'https://api.foursquare.com/v2/venues/' + place.vid + '/photos?&client_id=IISH2ZQK5FLY3F4GM0P4SUQN4EXQV5ZENQMBSD1POZ0AABOO&client_secret=OKCZBXIZOLZI4E1M55VIOSD2CL3UH1YJAMDPEXWR1FFLXNDZ&v=20150305', 
      success: function (response) {
        //if there are no available images
        if (response.response.photos.items.length === 0) {
          $('.img-error').text('There are no available images for this venue.');
          for (var i=0; i<3; i++) {
            $('#img' + i).attr('src', '');
          }
        } else {
          //set image sources to new image urls
          $('.img-error').text('');
          for (var x=0; x<3; x++) {
            $('#img' + x).attr('src', response.response.photos.items[x].prefix + "200x200" + response.response.photos.items[x].suffix);
          }
        }
        //If there are images, show the image divs. If not, don't.
        for (var j=0; j<3; j++) {
          if ($('#img' + j).attr('src') === '') {
            $('#img' + j).css('display', 'none');
          } else {
            $('#img' + j).css('display', 'block');
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
    });

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
    });
  };

  //instaniate Map when the page loads
  google.maps.event.addDomListener(window, 'load', kcMap = new Map());
}

ko.applyBindings(new ViewModel());