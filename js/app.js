var map,
  infowindow,
  bounds;
// initialize zomato function
Zomato.init({"key" :"a407a643533db8f33505efd14ba99642"});
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
    styles: mapstyles,
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
    this.res_id = data.res_id;
    this.resURL = "";
    this.cost = "";
    this.cuisine = "";
    this.success = "";
    this.photoUrl = "https://www.zomato.com/widgets/foodie_widget_img.php?widget_type=2&lat=" + this.location.lat + "&lon=" + this.location.lng;
  };


  // Get contect infowindows
  function getContent(space) {
    var contentString = "<a href="+ space.resURL +"><h3>" + space.name +
      "</h3></a><br>"+ space.cuisine +"<p>Average cost for two: " + space.cost +"</p><br><div style='width:200px;min-height:120px'><img width=65% src=" + '"' +
      space.photoUrl + '"></div>';
    var errorstring = "There was an error with AJAX request. Please try again later"

      if (space.success) {
        return contentString;
      } else {
        return errorstring;
      }


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

    //Zomato API request
    self.getResturantData=ko.computed(function(){
      self.spaceList().forEach(function(space){

        Zomato.restaurant(space.res_id, function(restaurant){
          space.cost = restaurant.average_cost_for_two;
          space.resURL = restaurant.url;
          space.cuisine = restaurant.cuisines;
          space.success = true;
        }, function(error){
          space.success = false;
          console.error("There was an error with AJAX request");
        });

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
