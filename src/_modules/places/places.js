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
    let div, li, h3, logo, logodiv, p, photo, tmp, photodiv;

    responseArr.forEach((obj) => {
      // console.log(obj);
      h3 = document.createElement('h3');
      logo = document.createElement('img');
      p = document.createElement('p');
      li = document.createElement('li');
      div = document.createElement('div');
      logodiv = document.createElement('div');

      h3.textContent = obj.name;
      div.appendChild(h3);
      logo.src = obj.icon;

      logodiv.className += ' logodiv';
      logodiv.appendChild(logo);
      div.appendChild(logodiv);

      if (obj.photos) {
        photo = document.createElement('img');
        // console.log(tmp[0]);
        tmp = obj.photos[0];
        photo.width = 200;
        photo.height = 200;
        photo.src = tmp.getUrl({maxHeight: 200, maxWidth: 200});
        photodiv = document.createElement('div');
        photodiv.className += ' photodiv';
        photodiv.appendChild(photo);
        photodiv.id = 'imgdiv';
        div.appendChild(photodiv);
      }

      if (obj.price_level) {
        p.textContent = `Value for Money: ${obj.price_level}`;
        div.appendChild(p);
      }

      li.appendChild(div);
      fragment.appendChild(li);
    });

    ulFrag.appendChild(fragment);
    ulFrag.className+=' w3-ul w3-card-4 w3-center';
    let divs = ulFrag.querySelectorAll('li > div');
    for (let i = 0,ln = divs.length; i<ln; i++) {
      divs[i].className += ' w3-container w3-center w3-hover-green';
      divs[i].id = 'search-result';
      divs[i].querySelector('h3').className += ' w3-red';
    }
    responseResults.className += ' w3-card';
    responseResults.appendChild(ulFrag);

  },
  createSlider = (responseArr) => {
    let
      fragment = document.createDocumentFragment(),
      spanSlider, img, divImgHolder, btnHolder, btnHref,
      divFrag = parseResult(responseArr),
      ln = divFrag.children.length,
      divImgHolder = document.createElement('div'),
      responseResults = document.getElementsByClassName('responseResults')[0];

    responseResults.className += ' w3-card';
    divImgHolder.className += ' div-img-holder';

    for (let i=0, idName, childNodes = divFrag.children; i<ln; i++) {
      spanSlider = document.createElement('span');
      idName = 'slider-'+'div-'+i;
      spanSlider.id = idName;
      responseResults.appendChild(spanSlider);

      divImgHolder.appendChild(childNodes[i]);

      btnHref = document.createElement('a');
      btnHref.href = '#'+idName;
      btnHref.className += 'slider-change';
      btnHolder.appendChild(btnHref);
    }

    responseResults.appendChild(divImgHolder);
    responseResults.appendChild(btnHolder);

    // TODO: Fix the width of divImgHolder by calculating total div cards
    // 3 div cards per slide
  };

export default {getPlaces, parseResult};