'use strict';

export default function getPlaces (google) {
  let
    Places = function Places() {
      // this.name = 'places';
      console.log('%s module loaded', 'places');
    },

    map,
    service,
    infowindow,

    createMarker = function createMarker(place) {
      let
        placeLoc = place.geometry.location,
        marker = new google.maps.Marker({
          map: map,
          position: placeLoc,
        });

      google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name);
        infowindow.open(map, window);
      });
    },

    init = function initialize(lat, lng, typePlace, objArgs) {
      let
        place = new google.maps.LatLng(lat,lng),
        request = {
          location: place,
          radius: '5000',
          type: [typePlace]
        };

      Object.assign(request, objArgs);

      map = new google.maps.Map(document.getElementById('map'), {
        center: place,
        zoom: 15
      });

      infowindow = new google.maps.InfoWindow();
      service = new google.maps.places.PlacesService(map);

      return new Promise((resolve, reject) => {
        service.nearbySearch(request, function callback(results, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            console.log('found result');
            results.forEach((result) => {
              createMarker(result);
            });
            resolve(results);
          }
          else {
            reject(Error(status));
          }
        });
      });
    };

  Places();
  return init;
};