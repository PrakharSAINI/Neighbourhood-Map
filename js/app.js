/** The model for app. These are the coworking spaces listings that will
be shown to the user.*/

var initialSpaces = [
  {
    "name": "Milkshake and Co.",
    "location": {"lat": 30.7408502, "lng": 76.7972599}
  },
  {
    "name": "Uncle Jack's",
    "location": {"lat": 30.7408896, "lng": 76.7972148}
  },
  {
    "name": "Rustic Door",
    "location": {"lat": 30.7542476, "lng": 76.7877952}
  },
  {
    "name": "Burgrill",
    "location": {"lat": 30.7408270, "lng": 76.7978909}
  },
  {
    "name": "Get Desserted",
    "location": {"lat": 30.7407806, "lng": 76.7974402}
  },
  {
    "name": "Bon  Nourriture",
    "location": {"lat": 30.7475505, "lng": 76.7932236}
  },
  {
    "name": "La Pino'z Pizza",
    "location": {"lat": 30.7478997, "lng": 76.7929333}
  },
  {
    "name": "The Willow Cafe",
    "location": {"lat": 30.7587387, "lng": 76.7834682}
  },
  {
    "name": "AJA Fresh, Grilled & Healthy",
    "location": {"lat": 30.7592908, "lng": 76.7828372}
  },
  {
    "name": "Super Donuts",
    "location": {"lat": 30.7409384, "lng": 76.7972599}
  },
  {
    "name": "Casa Bella Vista Pizzeria",
    "location": {"lat": 30.7547301, "lng": 76.7873445}
  },
  {
    "name": "PiFi Pizza Zone",
    "location": {"lat": 30.7409454, "lng": 76.7977557}
  },
  {
    "name": "Backpackers Cafe",
    "location": {"lat": 30.7474867, "lng": 76.7932037}
  },
  {
    "name": "Nik Baker's",
    "location": {"lat": 30.7478881, "lng": 76.7932488}
  },
  {
    "name": "Gusto Kitchen & Kaffe",
    "location": {"lat": 30.7328298, "lng": 76.8032989}
  },
  {
    "name": "Chapter Seven",
    "location": {"lat": 30.7327602, "lng": 76.8034792}
  },
  {
    "name": "Monica's Puddings & Pies",
    "location": {"lat": 30.7409569, "lng": 76.7974402}
  },
  {
    "name": "NABOBS Cafe and Pub",
    "location": {"lat": 30.7470923, "lng": 76.7936544}
  },
  {
    "name": "Fraiche",
    "location": {"lat": 30.7408896, "lng": 76.7972148}
  },
  {
    "name": "Dumpling Hood",
    "location": {"lat": 30.7478997, "lng": 76.7929333}
  }
];


// Create global variables to use in google maps
var map,
  infowindow,
  bounds;

//googleSuccess() is called when page is loaded
function googleSuccess() {
  "use strict";

  //Google map elements - set custom map marker
  var image = {
    "url": "img/32x32.png",
    // This marker is 32 pixels wide by 32 pixels high.
    "size": new google.maps.Size(32, 32),
    // The origin for this image is (0, 0).
    "origin": new google.maps.Point(0, 0),
    // The anchor for this image is the base of the flagpole at (0, 32).
    "anchor": new google.maps.Point(0, 32)
  };

  //Google map elements - set map options
  var mapOptions = {
    "center": {
      "lat": 30.7399033,
      "lng": 76.7936489
    },
    zoom: 14,
    styles: [
    {
      "featureType": "landscape",
      "stylers": [
        { "hue": "#FFBB00"},
        {"saturation": 43.400000000000006},
        {"lightness": 37.599999999999994},
        {"gamma": 1}
      ]
    },{
      "featureType": "road.highway",
      "stylers": [
        {"hue": "#FFC200"},
        {"saturation": -61.8},
        {"lightness": 45.599999999999994},
        {"gamma": 1}
      ]
    },{
      "featureType": "road.arterial",
      "stylers": [
        {"hue": "#FF0300"},
        {"saturation": -100},
        {"lightness": 51.19999999999999},
        {"gamma": 1}
      ]
    },{
      "featureType": "road.local",
      "stylers": [
        {"hue": "#FF0300"},
        {"saturation": -100},
        {"lightness": 52},
        {"gamma": 1}
      ]
    },{
      "featureType": "water",
      "stylers": [
        {"hue": "#0078FF"},
        {"saturation": -13.200000000000003},
        {"lightness": 2.4000000000000057},
        {"gamma": 1}
      ]
    },{
      "featureType": "poi",
      "stylers": [
        {"hue": "#00FF6A"},
        {"saturation": -1.0989010989011234},
        {"lightness": 11.200000000000017},
        {"gamma": 1}
      ]
    }],
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: false,
    mapTypeControlOptions: {
    style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
    }
  };
  map = new google.maps.Map(document.getElementById("map"), mapOptions);
  infowindow = new google.maps.InfoWindow({
    maxWidth: 150,
    content: ""
  });
  bounds = new google.maps.LatLngBounds();

  // Close infowindow when clicked elsewhere on the map
  map.addListener("click", function(){
    infowindow.close(infowindow);
  });

  // Recenter map upon window resize
  window.onresize = function () {
    map.fitBounds(bounds);
  };


  //Creating Space object
  var Space = function (data, map) {
    this.name = data.name;
    this.location = data.location;
    this.photoUrl = "https://www.zomato.com/widgets/foodie_widget_img.php?widget_type=2&lat=" + this.location.lat + "&lon=" + this.location.lng;
  };

  // Get contect infowindows
  function getContent(space) {
    var contentString = "<h3>" + space.name +
      "</h3><br><div style='width:200px;min-height:120px'><img width=65% src=" + '"' +
      space.photoUrl + '"></div>';
      return contentString;

  }

  // Bounce effect on marker
  function toggleBounce(marker) {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function() {
        marker.setAnimation(null);
      }, 700);
    }
  }

 function ViewModel() {
    var self = this;

    // Nav button control
    this.isNavClosed = ko.observable(false);
    this.navClick = function () {
      this.isNavClosed(!this.isNavClosed());
    };

    // Creating list elements from the spaceList
    this.spaceList = ko.observableArray();
    initialSpaces.forEach(function(item){
      self.spaceList.push(new Space(item));
    });

    // Create a marker per space item
    this.spaceList().forEach(function(space) {
      var marker = new google.maps.Marker({
        map: map,
        position: space.location,
        icon: image,
        animation: google.maps.Animation.DROP
      });
      space.marker = marker;
      // Extend the boundaries of the map for each marker
      bounds.extend(marker.position);
      // Create an onclick event to open an infowindow and bounce the marker at each marker
      marker.addListener("click", function(e) {
        map.panTo(this.position);
        //pan down infowindow by 200px to keep whole infowindow on screen
        map.panBy(0, -200);
        infowindow.setContent(getContent(space));
        infowindow.open(map, marker);
        toggleBounce(marker);
    });
  });


    // Creating click for the list item
    this.itemClick = function (space) {
      google.maps.event.trigger(space.marker, "click");
    };

    // Filtering the Space list
    self.filter = ko.observable("");

    this.filteredSpaceList = ko.dependentObservable(function() {
      var q = this.filter().toLowerCase();
      if (!q) {
      // Return self.spaceList() the original array;
      return ko.utils.arrayFilter(self.spaceList(), function(item) {
        item.marker.setVisible(true);
        return true;
      });
      } else {
        return ko.utils.arrayFilter(this.spaceList(), function(item) {
          if (item.name.toLowerCase().indexOf(q) >= 0) {
          return true;
          } else {
            item.marker.setVisible(false);
          return false;
          }
        });
      }
    }, this);
  }

 // Activates knockout.js
ko.applyBindings(new ViewModel());
}