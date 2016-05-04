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
          // zoom: 15
        });

        infowindow = new google.maps.InfoWindow();
        service = new google.maps.places.PlacesService(map);

        return new Promise((resolve, reject) => {
          service.nearbySearch(request, function callback(results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
              console.log(`found ${results.length} results`);
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
      fragment = document.createDocumentFragment();
    let
      div, li, h3, logo, logodiv, p, photo, tmp, photodiv;

    responseArr.forEach((obj) => {
      // console.log(obj);
      h3 = document.createElement('h3');
      logo = document.createElement('img');
      p = document.createElement('p');
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

      fragment.appendChild(div);
    });

    // ulFrag.className+=' w3-ul w3-card-4 w3-center';
    const divs = fragment.children;
    for (let i = 0,ln = divs.length; i<ln; i++) {
      divs[i].className += ' w3-card-2 w3-hover-green';
      divs[i].id = 'search-result';
      divs[i].querySelector('h3').className += ' w3-red';
    }

    return fragment;
  },

  createSlider = (responseArr) => {
    let
      responseFrag = document.createDocumentFragment(),
      divImgFrag = document.createDocumentFragment(),
      btnFrag = document.createDocumentFragment(),

      span, img, btnHref,

      fragment = parseResult(responseArr),
      divResImgHolder = Array.from(fragment.children),
      ln = divResImgHolder.length,
      responseResults = document.getElementsByClassName('responseResults')[0],
      divImgHolder = responseResults.getElementsByClassName('div-img-holder')[0],
      btnHolder = responseResults.getElementsByClassName('button-holder')[0];

    // adjust the slider-holder width
    // Fix the width of divImgHolder by calculating total div cards
    // 3 div cards per slide
    divImgHolder.style.width = `${Math.ceil(ln * 800)}px`;

    // populate data in frames

    divResImgHolder.forEach( (e, index) => {
      // span = document.createElement('span');
      // idName = 'slider-'+'div-'+index;
      // span.id = idName;
      // span.className += ' span-slider';

      try {
        // responseFrag.appendChild(span);

        e.className += ' slider-image card';
        divImgFrag.appendChild(e);
        // console.log("divImgFrag works");
        // console.log(e);
      }
      catch (err) {
        console.error(err);
        console.log(e);
      }
    });

    for(let i=0, ln = divResImgHolder.length/2; i<ln; i++ ) {
      btnHref = document.createElement('a');
      btnHref.href = `#slider-div-${i}`;
      btnHref.className += ' slider-change';
      btnFrag.appendChild(btnHref);
    }

    try {
      // responseResults.insertBefore(responseFrag, divImgHolder);
      divImgHolder.appendChild(divImgFrag);
      btnHolder.appendChild(btnFrag);
    }
    catch (e) {
      console.error('appending frag to document error!');
    }
  },

  slideTransit = () => {
    let
      id, num=0,
      slider = document.querySelector('.div-img-holder');

    Array.from(document.getElementsByClassName('slider-change')).forEach((e) => {
      e.addEventListener('click', function (evt) {
        let that= this;
        // id = evt.target.hash;
        id = that.href;
        // console.log(id);
        num = parseInt(id[id.length - 1]) * -800;
        slider.style.left = `${num}px`;
      });
    });
  };

export default {getPlaces, createSlider, slideTransit};