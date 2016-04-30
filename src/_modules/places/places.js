'use strict';

const
  getPlaces = function getPlaces (google) {

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
              console.log('found % results', results.length);
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
  },

  parseResult = function parseResult (responseArr) {
    const
      fragment = document.createDocumentFragment(),
      ulFrag = document.createElement('ul'),
      responseResults = document.getElementsByClassName('responseResults')[0];
    let div, li, h3, img, p, photo, tmp;

    responseArr.forEach((obj) => {
      // console.log(obj);
      h3 = document.createElement('h3');
      img = document.createElement('img');
      photo = document.createElement('img');
      p = document.createElement('p');
      li = document.createElement('li');
      div = document.createElement('div');

      h3.textContent = obj.name;
      div.appendChild(h3);
      img.src = obj.icon;
      div.appendChild(img);

      if (obj.photos) {
        // console.log(tmp[0]);
        tmp = obj.photos[0];
        photo.src = tmp.getUrl({maxHeight: 300, maxWidth: 300});
        div.appendChild(photo);
      }

      if (obj.price_level) {
        p.textContent = `Value for Money: ${obj.price_level}`;
        div.appendChild(p);
      }

      li.appendChild(div);
      fragment.appendChild(li);
    });

    ulFrag.appendChild(fragment);

    responseResults.appendChild(ulFrag);
  };

export default {getPlaces, parseResult};